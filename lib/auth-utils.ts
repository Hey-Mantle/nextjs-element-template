import { auth } from "@/lib/auth";
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
