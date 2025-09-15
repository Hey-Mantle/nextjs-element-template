import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server side
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Require authentication and redirect to signin if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

/**
 * Check if user is authenticated (client-side)
 */
export function useAuth() {
  // This would typically be used with useSession from next-auth/react
  // but we're keeping server-side focused for now
  throw new Error(
    "useAuth should be used with useSession from next-auth/react on the client side"
  );
}

/**
 * Get user's Mantle access token
 */
export async function getMantleAccessToken() {
  const session = await getServerSession();

  if (!session?.accessToken) {
    throw new Error("No access token available");
  }

  return session.accessToken;
}

/**
 * Check if user has required scopes
 */
export function hasScope(requiredScopes: string[], userScopes?: string) {
  if (!userScopes) return false;

  const userScopeList = userScopes.split(" ");
  return requiredScopes.every((scope) => userScopeList.includes(scope));
}

/**
 * Authenticate using a session token from the main platform
 * This is useful for iframe authentication or programmatic login
 */
export async function authenticateWithSessionToken(
  sessionToken: string,
  callbackUrl?: string
) {
  try {
    const result = await signIn("session-token", {
      sessionToken,
      redirectTo: callbackUrl || "/",
    });
    return result;
  } catch (error) {
    console.error("Session token authentication failed:", error);
    throw new Error("Failed to authenticate with session token");
  }
}

/**
 * Client-side session token authentication helper
 * This function can be called from the browser to authenticate with a session token
 */
export async function clientSessionTokenSignIn(
  sessionToken: string,
  callbackUrl?: string
) {
  try {
    const response = await fetch("/api/auth/session-token-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken,
        callbackUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("clientSessionTokenSignIn - error response:", error);
      throw new Error(error.error || "Authentication failed");
    }

    const result = await response.json();

    // Don't reload the page - let NextAuth handle the session update
    return result;
  } catch (error) {
    console.error("Client session token authentication failed:", error);
    throw error;
  }
}
