import NextAuth from "next-auth";
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
    return {
      id,
      email, // note, this could conflict cross-org with the same user email
      name,
      organizationId: organization.id,
      organizationName: organization.name,
      accessToken: access_token,
    };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [MantleOAuth],
  session: {
    strategy: "jwt",
  },
  // Ensure HTTPS is used in production and development
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account && user) {
        return {
          ...token,
          id: user.id,
          organizationId: user.organizationId,
          organizationName: user.organizationName,
          accessToken: account.access_token as string,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          organizationId: token.organizationId as string,
          organizationName: token.organizationName as string,
        },
        accessToken: token.accessToken,
      };
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
    organizationId: string;
    organizationName: string;
  }

  interface Organization {
    id: string;
    name: string;
  }

  interface Session {
    user: User;
    organization: Organization;
    accessToken: string;
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
