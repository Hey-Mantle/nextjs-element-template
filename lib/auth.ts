import { PrismaAdapter } from "@auth/prisma-adapter";
import crypto from "crypto";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import { prisma } from "./prisma";

// this needs to be left in for the declare module below
import { JWT } from "next-auth/jwt";

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
      "https://app.heymantle.com/oauth/authorize",
    params: {
      scope: "read:apps",
      mode: "offline",
    },
  },
  token: {
    url:
      process.env.MANTLE_TOKEN_URL ??
      "https://app.heymantle.com/api/oauth/token",
  },
  issuer: "heymantle.com",
  userinfo: {
    url: process.env.MANTLE_USER_INFO_URL ?? "https://api.heymantle.com/v1/me",
  },
  async profile(
    { user: { id, email, name }, organization }: any,
    { access_token }: any
  ) {
    // Create or update organization directly in profile
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

    // Create or update user with organization link
    const userRecord = await prisma.user.upsert({
      where: { email },
      update: {
        name: name, // Update name from OAuth provider
        userId: id, // Update Mantle user ID
        organizationId: orgRecord.id,
      },
      create: {
        email,
        name: name, // Use name from OAuth provider
        userId: id,
        organizationId: orgRecord.id,
      },
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

// Session Token provider for authenticating with session tokens from the main platform
export const SessionTokenProvider: Provider = {
  id: "session-token",
  name: "Session Token",
  type: "credentials",
  credentials: {
    sessionToken: { label: "Session Token", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.sessionToken) {
      return null;
    }

    try {
      // The sessionToken is a JWT from the app bridge - verify it locally
      const jwt = credentials.sessionToken as string;

      // Decode the JWT payload first to get organization info
      const jwtParts = jwt.split(".");
      if (jwtParts.length !== 3) {
        console.log("Session token provider - invalid JWT format");
        return null;
      }

      // Decode the payload (base64url decode)
      const payload = JSON.parse(
        Buffer.from(jwtParts[1], "base64url").toString()
      );

      // Look up the organization by mantleId to get the access token for verification
      const organization = await prisma.organization.findUnique({
        where: { mantleId: payload.organizationId },
      });

      if (!organization) {
        throw new Error(`ORGANIZATION_NOT_FOUND:${payload.organizationId}`);
      }

      // Verify the signature using the organization's access token
      const expectedSignature = crypto
        .createHmac("sha256", organization.accessToken)
        .update(jwtParts[0] + "." + jwtParts[1])
        .digest("base64url");

      if (expectedSignature !== jwtParts[2]) {
        return null;
      }

      // Check if JWT is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      // Extract and return user info from JWT payload
      const user = {
        id: payload.user.id,
        email: payload.user.email,
        name: payload.user.name,
        organizationId: organization.id,
      };

      return user;
    } catch (error) {
      console.error("Session token authentication failed:", error);
      return null;
    }
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [MantleOAuth, SessionTokenProvider],
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
  },
  // Ensure HTTPS is used in production and development
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // SignIn callback runs before user creation, so we can't update the user here
      // User-organization linking will be handled in the JWT callback after user creation

      return true;
    },
    async jwt({ token, user, account }) {
      // If this is a credentials provider (session-token), pass the user data to the token
      if (account?.provider === "session-token" && user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.organizationId = user.organizationId;
      }

      // If this is MantleOAuth provider, handle user-organization linking for new users
      if (account?.provider === "MantleOAuth" && user) {
        // Get the user's organization info for the token
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { organization: true },
          });

          if (dbUser?.organization) {
            token.organizationId = dbUser.organization.mantleId;
            token.organizationName = dbUser.organization.name;
          }
        } catch (error) {
          console.error(
            "JWT callback - error fetching user organization:",
            error
          );
        }

        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      // For JWT strategy, get user data from token
      if (token) {
        const sessionResult = {
          ...session,
          user: {
            ...session.user,
            id: token.userId as string,
            email: token.email as string,
            name: token.name as string,
            organizationId: token.organizationId as string,
            organizationName: token.organizationName as string,
          },
        } as any; // Type assertion to handle complex type intersection

        return sessionResult;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // For relative URLs, make them absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // For same-origin URLs, return as-is
      if (new URL(url).origin === baseUrl) return url;

      // For OAuth flows, redirect to Mantle extension
      // For session token auth, this shouldn't be reached, but return baseUrl as fallback
      const mantleUrl =
        process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";
      return `${mantleUrl}/extensions/${process.env.NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE}`;
    },
  },
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
