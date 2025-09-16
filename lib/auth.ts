import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
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
  // Ensure proper state handling
  state: true,
  // Allow account linking for this provider
  allowDangerousEmailAccountLinking: true,
  async profile(profileData: any, tokens: any) {
    console.log("[MantleOAuth Profile] Starting profile function");
    console.log(
      "[MantleOAuth Profile] Profile data:",
      JSON.stringify(profileData, null, 2)
    );
    console.log(
      "[MantleOAuth Profile] Tokens:",
      JSON.stringify(tokens, null, 2)
    );

    try {
      // Extract user and organization data with error handling
      const { user, organization } = profileData;
      const { access_token } = tokens;

      console.log(
        "[MantleOAuth Profile] Extracted user:",
        JSON.stringify(user, null, 2)
      );
      console.log(
        "[MantleOAuth Profile] Extracted organization:",
        JSON.stringify(organization, null, 2)
      );
      console.log(
        "[MantleOAuth Profile] Access token:",
        access_token ? "Present" : "Missing"
      );

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

      console.log(
        "[MantleOAuth Profile] User details - ID:",
        id,
        "Email:",
        email,
        "Name:",
        name
      );
      console.log(
        "[MantleOAuth Profile] Organization details - ID:",
        organization.id,
        "Name:",
        organization.name
      );

      // Create or update organization directly in profile
      console.log("[MantleOAuth Profile] Creating/updating organization...");
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
      console.log(
        "[MantleOAuth Profile] Organization record:",
        JSON.stringify(orgRecord, null, 2)
      );

      // Create or update user
      console.log("[MantleOAuth Profile] Creating/updating user...");
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
      console.log(
        "[MantleOAuth Profile] User record:",
        JSON.stringify(userRecord, null, 2)
      );

      // Create or update user-organization association
      console.log(
        "[MantleOAuth Profile] Creating/updating user-organization association..."
      );
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
      console.log(
        "[MantleOAuth Profile] User-organization association created/updated"
      );

      const result = {
        id: userRecord.id, // Use database user ID
        email: userRecord.email,
        name: userRecord.name || "", // Ensure name is never null
        userId: userRecord.userId,
        organizationId: orgRecord.mantleId,
        organizationName: orgRecord.name,
      };

      console.log(
        "[MantleOAuth Profile] Returning profile result:",
        JSON.stringify(result, null, 2)
      );
      return result;
    } catch (error) {
      console.error("[MantleOAuth Profile] Error in profile function:", error);
      console.error(
        "[MantleOAuth Profile] Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
      throw error; // Re-throw to let NextAuth handle it
    }
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
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[NextAuth SignIn] SignIn callback triggered");
      console.log("[NextAuth SignIn] User:", JSON.stringify(user, null, 2));
      console.log(
        "[NextAuth SignIn] Account:",
        JSON.stringify(account, null, 2)
      );
      console.log(
        "[NextAuth SignIn] Profile:",
        JSON.stringify(profile, null, 2)
      );

      // Always allow sign-in for MantleOAuth provider
      // This prevents OAuthAccountNotLinked errors
      if (account?.provider === "MantleOAuth") {
        console.log("[NextAuth SignIn] Allowing MantleOAuth sign-in");
        return true;
      }

      // SignIn callback runs before user creation, so we can't update the user here
      // User-organization linking will be handled in the JWT callback after user creation

      return true;
    },
    async jwt({ token, user, account }) {
      console.log("[NextAuth JWT] JWT callback triggered");
      console.log("[NextAuth JWT] Token:", JSON.stringify(token, null, 2));
      console.log("[NextAuth JWT] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth JWT] Account:", JSON.stringify(account, null, 2));

      // If this is MantleOAuth provider, handle user-organization linking for new users
      if (account?.provider === "MantleOAuth" && user) {
        console.log("[NextAuth JWT] Processing MantleOAuth user");
        // Get the user's organization info for the token
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              userOrganizations: {
                include: { organization: true },
              },
            },
          });

          console.log(
            "[NextAuth JWT] Database user:",
            JSON.stringify(dbUser, null, 2)
          );

          // For OAuth flow, get the first organization (there should only be one at this point)
          const userOrg = dbUser?.userOrganizations?.[0];
          if (userOrg?.organization) {
            token.organizationId = userOrg.organization.mantleId;
            token.organizationName = userOrg.organization.name;
            console.log("[NextAuth JWT] Added organization to token:", {
              organizationId: token.organizationId,
              organizationName: token.organizationName,
            });
          } else {
            console.log("[NextAuth JWT] No organization found for user");
          }
        } catch (error) {
          console.error(
            "[NextAuth JWT] Error fetching user organization:",
            error
          );
        }

        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log("[NextAuth JWT] Updated token with user data");
      }

      console.log(
        "[NextAuth JWT] Final token:",
        JSON.stringify(token, null, 2)
      );
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth Session] Session callback triggered");
      console.log(
        "[NextAuth Session] Session:",
        JSON.stringify(session, null, 2)
      );
      console.log("[NextAuth Session] Token:", JSON.stringify(token, null, 2));

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

        console.log(
          "[NextAuth Session] Final session result:",
          JSON.stringify(sessionResult, null, 2)
        );
        return sessionResult;
      }

      console.log("[NextAuth Session] No token, returning original session");
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log({ url, baseUrl }, "REDIRECTING TO MANTLE URL KPD");
      // For relative URLs, make them absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // For same-origin URLs, check if this is an OAuth callback with organizationId
      if (new URL(url).origin === baseUrl) {
        const urlObj = new URL(url);
        const organizationId = urlObj.searchParams.get("organizationId");

        // If this is an OAuth callback with organizationId, redirect to Mantle extension
        if (organizationId) {
          console.log(
            { organizationId },
            "OAuth callback detected, redirecting to Mantle extension"
          );
          const mantleUrl =
            process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";
          return `${mantleUrl}/extensions/${process.env.NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE}`;
        }

        // Otherwise return as-is for other same-origin URLs
        return url;
      }

      // For OAuth flows, redirect to Mantle extension
      // For session token auth, this shouldn't be reached, but return baseUrl as fallback
      const mantleUrl =
        process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";

      console.log({ mantleUrl }, "REDIRECTING TO MANTLE URL KPD");
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
