import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
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
    console.log("MantleOAuth profile - received data:", {
      user: { id, email, name },
      organization: { id: organization?.id, name: organization?.name },
      hasAccessToken: !!access_token,
    });

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

    console.log("MantleOAuth profile - organization created/updated:", {
      id: orgRecord.id,
      mantleId: orgRecord.mantleId,
      name: orgRecord.name,
    });

    // Check if user already exists and update their organization
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { organizationId: orgRecord.id },
      });

      console.log("MantleOAuth profile - updated existing user organization:", {
        userId: existingUser.id,
        organizationId: orgRecord.id,
      });
    }

    return {
      id: existingUser?.id,
      email, // note, this could conflict cross-org with the same user email
      name,
      userId: id,
      organizationId: orgRecord.id,
    };
  },
};

// Session Token provider for authenticating with session tokens from the main platform
const SessionTokenProvider: Provider = {
  id: "session-token",
  name: "Session Token",
  type: "credentials",
  credentials: {
    sessionToken: { label: "Session Token", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.sessionToken) {
      console.log("Session token provider - no session token provided");
      return null;
    }

    try {
      // The sessionToken is a JWT from the app bridge - verify it locally
      const jwt = credentials.sessionToken as string;
      console.log(
        "Session token provider - received JWT:",
        jwt.substring(0, 50) + "..."
      );

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
      console.log("Session token provider - JWT payload:", payload);

      // Look up the organization by mantleId
      const organization = await prisma.organization.findUnique({
        where: { mantleId: payload.organizationId },
      });

      if (!organization) {
        console.log(
          "Session token provider - organization not found:",
          payload.organizationId
        );
        return null;
      }

      console.log("Session token provider - found organization:", {
        id: organization.id,
        mantleId: organization.mantleId,
        name: organization.name,
        accessTokenLength: organization.accessToken.length,
      });

      // Verify the signature using the organization's access token
      const crypto = require("crypto");
      const expectedSignature = crypto
        .createHmac("sha256", organization.accessToken)
        .update(jwtParts[0] + "." + jwtParts[1])
        .digest("base64url");

      console.log("Session token provider - signature verification details:", {
        organizationAccessTokenLength: organization.accessToken.length,
        organizationAccessTokenPreview:
          organization.accessToken.substring(0, 10) + "...",
        receivedSignature: jwtParts[2],
        expectedSignature: expectedSignature,
        signaturesMatch: expectedSignature === jwtParts[2],
      });

      if (expectedSignature !== jwtParts[2]) {
        console.log(
          "Session token provider - JWT signature verification failed"
        );
        return null;
      }

      // Check if JWT is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log("Session token provider - JWT expired");
        return null;
      }

      // Extract user info from JWT payload
      const user = {
        id: payload.userId,
        email:
          payload.userEmail ||
          payload.email ||
          `${payload.userId}@mantle.local`, // Fallback email if not provided
        name:
          payload.userName ||
          payload.name ||
          `User ${payload.userId.substring(0, 8)}`, // Fallback name if not provided
      };

      console.log("Session token provider - extracted user info:", {
        user,
        organizationId: organization.id,
        organizationName: organization.name,
      });

      if (!user?.id) {
        console.log("Session token provider - missing user ID in JWT");
        return null;
      }

      // Check if user exists in our database
      console.log("Session token provider - searching for user with:", {
        userId: user.id,
        email: user.email,
      });

      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { userId: user.id }, // Match by Mantle's internal user ID
            { email: user.email }, // Fallback to email match
          ],
        },
      });

      console.log("Session token provider - found existing user:", !!dbUser);
      if (dbUser) {
        console.log("Session token provider - existing user details:", {
          id: dbUser.id,
          email: dbUser.email,
          userId: dbUser.userId,
          organizationId: dbUser.organizationId,
        });
      }

      // Create or update user
      if (!dbUser) {
        console.log("Session token provider - creating new user");
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || null,
            userId: user.id,
            organizationId: organization.id,
          },
        });
        console.log("Session token provider - created user:", {
          id: dbUser.id,
          email: dbUser.email,
          userId: dbUser.userId,
          organizationId: dbUser.organizationId,
        });
      } else {
        console.log("Session token provider - updating existing user");
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            userId: user.id,
            organizationId: organization.id,
            name: user.name || dbUser.name,
          },
        });
        console.log("Session token provider - updated user:", {
          id: dbUser.id,
          email: dbUser.email,
          userId: dbUser.userId,
          organizationId: dbUser.organizationId,
        });
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name || "",
        organizationId: organization.mantleId,
        organizationName: organization.name,
      };
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
  events: {
    async createUser({ user }) {
      // This event is called after the user is created
      console.log("User created:", user);

      // Try to get the organization data from the current OAuth flow
      // We'll handle this in the session callback instead since we have access to the account there
    },
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
      console.log("SignIn callback - called with:", {
        provider: account?.provider,
        userId: user?.id,
        userEmail: user?.email,
        hasProfile: !!profile,
      });

      // SignIn callback runs before user creation, so we can't update the user here
      // User-organization linking will be handled in the JWT callback after user creation
      console.log(
        "SignIn callback - user will be linked to organization in JWT callback"
      );

      return true;
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback - called with:", {
        hasToken: !!token,
        hasUser: !!user,
        accountProvider: account?.provider,
        tokenKeys: token ? Object.keys(token) : [],
      });

      // If this is a credentials provider (session-token), pass the user data to the token
      if (account?.provider === "session-token" && user) {
        console.log("JWT callback - processing session-token user:", {
          userId: user.id,
          email: user.email,
          name: user.name,
          organizationId: (user as any).organizationId,
          organizationName: (user as any).organizationName,
        });

        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.organizationId = (user as any).organizationId;
        token.organizationName = (user as any).organizationName;
      }

      // If this is MantleOAuth provider, handle user-organization linking for new users
      if (account?.provider === "MantleOAuth" && user) {
        console.log("JWT callback - processing MantleOAuth user:", {
          userId: user.id,
          email: user.email,
          name: user.name,
        });

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
      console.log("Session callback - called with:", {
        hasSession: !!session,
        hasToken: !!token,
        sessionUser: session?.user,
        tokenKeys: token ? Object.keys(token) : [],
      });

      // For JWT strategy, get user data from token
      if (token) {
        console.log("Session callback - token data:", {
          userId: token.userId,
          email: token.email,
          name: token.name,
          organizationId: token.organizationId,
          organizationName: token.organizationName,
        });

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

        console.log("Session callback - returning session:", {
          hasUser: !!sessionResult.user,
          userId: sessionResult.user?.id,
          email: sessionResult.user?.email,
          name: sessionResult.user?.name,
        });

        return sessionResult;
      }

      console.log(
        "Session callback - no token data, returning original session"
      );
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
