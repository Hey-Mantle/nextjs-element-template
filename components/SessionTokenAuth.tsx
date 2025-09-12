"use client";

import {
  clientSessionTokenSignIn,
  getSessionTokenFromUrl,
} from "@/lib/auth-utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SessionTokenAuthProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
}

/**
 * Component that handles automatic session token authentication
 * This is particularly useful for iframe-based authentication
 */
export default function SessionTokenAuth({
  children,
  fallback,
  onAuthSuccess,
  onAuthError,
}: SessionTokenAuthProps) {
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt authentication if not already authenticated
    if (status === "unauthenticated") {
      const sessionToken = getSessionTokenFromUrl();

      if (sessionToken && !isAuthenticating) {
        setIsAuthenticating(true);
        setAuthError(null);

        clientSessionTokenSignIn(sessionToken)
          .then(() => {
            onAuthSuccess?.();
          })
          .catch((error) => {
            const errorMessage = error.message || "Authentication failed";
            setAuthError(errorMessage);
            onAuthError?.(errorMessage);
          })
          .finally(() => {
            setIsAuthenticating(false);
          });
      }
    }
  }, [status, isAuthenticating, onAuthSuccess, onAuthError]);

  // Show loading state while NextAuth is loading or while authenticating
  if (status === "loading" || isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {isAuthenticating ? "Authenticating..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show fallback if not authenticated and no session token in URL
  if (status === "unauthenticated") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Not Authenticated
            </h2>
            <p className="text-gray-600">Please authenticate to continue.</p>
          </div>
        </div>
      )
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}

/**
 * Hook for session token authentication
 */
export function useSessionTokenAuth() {
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticateWithToken = async (sessionToken: string) => {
    setIsAuthenticating(true);
    try {
      await clientSessionTokenSignIn(sessionToken);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    session,
    status,
    isAuthenticating,
    authenticateWithToken,
  };
}
