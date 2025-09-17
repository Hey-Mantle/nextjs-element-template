import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "./prisma";

// this needs to be left in for the declare module below
import { JWT } from "next-auth/jwt";
import { identifyCustomer } from "./mantle-client";

// Mantle OAuth provider configuration
const MantleOAuth = {
  id: "MantleOAuth",
  name: "Mantle Extension OAuth",
  type: "oauth" as const,
  checks: ["state"] as ("state" | "pkce" | "none")[],
  clientId: process.env.NEXT_PUBLIC_MANTLE_ELEMENT_ID!,
  clientSecret: process.env.MANTLE_ELEMENT_SECRET!,
  authorization: {
    url:
      process.env.MANTLE_AUTHORIZE_URL ??
      `${
        process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com"
      }/oauth/authorize`,
    params: {
      scope: "read:apps",
      mode: "offline",
    },
  },
  token: {
    url:
      process.env.MANTLE_TOKEN_URL ??
      `${
        process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com"
      }/api/oauth/token`,
  },
  issuer: "heymantle.com",
  userinfo: {
    url:
      process.env.MANTLE_USER_INFO_URL ??
      `${
        process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com"
      }/api/v1/me`,
  },
  async profile(profileData: any, tokens: any) {
    // Extract user and organization data with error handling
    const { user, organization } = profileData;
    const { access_token } = tokens;

    if (!user) {
      throw new Error("User data is missing from profile response");
    }

    if (!organization) {
      throw new Error("Organization data is missing from profile response");
    }

    if (!access_token) {
      throw new Error("Access token is missing from tokens");
    }

    const { id, email, name } = user;
    const orgRecord = await prisma.organization.upsert({
      where: { mantleId: organization.id },
      update: {
        name: organization.name,
        accessToken: access_token,
      },
      create: {
        mantleId: organization.id,
        name: organization.name,
        accessToken: access_token,
      },
    });

    const userRecord = await prisma.user.upsert({
      where: { email },
      update: {
        name: name, // Update name from OAuth provider
        userId: id, // Update Mantle user ID
      },
      create: {
        email,
        name: name, // Use name from OAuth provider
        userId: id,
      },
    });

    await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: {
          userId: userRecord.id,
          organizationId: orgRecord.id,
        },
      },
      update: {}, // No fields to update for existing associations
      create: {
        userId: userRecord.id,
        organizationId: orgRecord.id,
      },
    });

    const { customerApiToken } = await identifyCustomer({
      platform: "mantle",
      platformId: orgRecord.mantleId,
      name: orgRecord.name,
      email: userRecord.email,
    });

    await prisma.organization.update({
      where: { id: orgRecord.id },
      data: { apiToken: customerApiToken },
    });

    return {
      id: userRecord.id, // Use database user ID
      email: userRecord.email,
      name: userRecord.name || "", // Ensure name is never null
      userId: userRecord.userId,
      organizationId: orgRecord.mantleId,
      organizationName: orgRecord.name,
    };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [MantleOAuth],
  session: {
    strategy: "jwt", // Use JWT for credentials-based authentication
  },
  // Custom session cookie names to avoid conflicts with other localhost apps
  // Updated for iframe compatibility
  cookies: {
    sessionToken: {
      name: `mantle-element-session-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `mantle-element-callback-url`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `mantle-element-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    state: {
      name: `mantle-element-state`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: `mantle-element-pkce-code-verifier`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Ensure HTTPS is used in production and development
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

// Type declarations for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    organizationId: string;
  }

  interface Session {
    user: User & {
      organizationId: string;
      organizationName: string;
    };
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    organizationId: string;
    organizationName: string;
    organization: {
      id: string;
      name: string;
    };
    accessToken: string;
  }
}
