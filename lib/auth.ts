import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { prisma } from "./prisma";

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
    return {
      id,
      email, // note, this could conflict cross-org with the same user email
      name,
    };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [MantleOAuth],
  session: {
    strategy: "database",
  },
  events: {
    async createUser({ user }) {
      // This event is called after the user is created
      console.log("User created:", user);

      // Try to get the organization data from the current OAuth flow
      // We'll handle this in the session callback instead since we have access to the account there
    },
  },
  // Custom session cookie names to avoid conflicts with other localhost apps
  cookies: {
    sessionToken: {
      name: `mantle-element-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `mantle-element-callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `mantle-element-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Ensure HTTPS is used in production and development
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async session({ session, user }) {
      // Get the latest user data including organization info
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          accounts: {
            where: { provider: "MantleOAuth" },
            select: { access_token: true },
          },
        },
      });

      if (dbUser) {
        // If organization data is missing, try to fetch it from the user info endpoint
        if (!dbUser.organizationId && dbUser.accounts[0]?.access_token) {
          try {
            const userInfoUrl =
              process.env.MANTLE_USER_INFO_URL ??
              "https://api.heymantle.com/v1/me";
            const response = await fetch(userInfoUrl, {
              headers: {
                Authorization: `Bearer ${dbUser.accounts[0].access_token}`,
              },
            });

            if (response.ok) {
              const userInfo = await response.json();
              if (userInfo.organization) {
                // Update the user with organization info
                await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    organizationId: userInfo.organization.id,
                    organizationName: userInfo.organization.name,
                  },
                });

                // Update the dbUser object for the response
                dbUser.organizationId = userInfo.organization.id;
                dbUser.organizationName = userInfo.organization.name;
              }
            }
          } catch (error) {
            console.error("Failed to fetch user organization data:", error);
          }
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser.id,
            organizationId: dbUser.organizationId,
            organizationName: dbUser.organizationName,
          },
          accessToken: dbUser.accounts[0]?.access_token || null,
        } as any; // Type assertion to handle complex type intersection
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      const mantleUrl =
        process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com";
      return `${mantleUrl}/extensions/${process.env.NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE}`;
      // // Handle redirect after OAuth - check if there's a state parameter with HMAC params
      // if (url.startsWith("/")) return `${baseUrl}${url}`;
      // if (new URL(url).origin === baseUrl) return url;
      // return baseUrl;
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
    organizationId?: string | null;
    organizationName?: string | null;
  }

  interface Session {
    user: User & {
      organizationId?: string | null;
      organizationName?: string | null;
    };
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    userId: string;
    organizationId: string;
    organizationName: string;
    accessToken: string;
  }
}
