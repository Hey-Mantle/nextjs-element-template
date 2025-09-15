"use client";

import { clientSessionTokenSignIn } from "@/lib/auth-utils";
import { isRunningInIframe } from "@/lib/mantle-app-bridge";
import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface AppBridgeAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
}

/**
 * Component that handles authentication using session tokens from the Mantle App Bridge
 * This component automatically authenticates users when the app is loaded in an iframe
 */
export default function AppBridgeAuth({
  children,
  fallback,
  onAuthSuccess,
  onAuthError,
}: AppBridgeAuthProps) {
  const {
    data: session,
    status: authStatus,
    update: updateSession,
  } = useSession();

  // Check if we're actually running in an iframe using the App Bridge helper
  const isInIframe = isRunningInIframe();

  const {
    isConnected,
    isConnecting,
    session: appBridgeSession,
    isSessionLoading,
    sessionError,
    connectionError,
    refreshSession,
  } = useSharedMantleAppBridge();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const [hasRequestedSession, setHasRequestedSession] = useState(false);
  const [hasSuccessfulAuth, setHasSuccessfulAuth] = useState(false);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleAuthSuccess = useCallback(() => {
    onAuthSuccess?.();
  }, [onAuthSuccess]);

  const handleAuthError = useCallback(
    (error: string) => {
      onAuthError?.(error);
    },
    [onAuthError]
  );

  // Memoize session update function
  const stableUpdateSession = useCallback(async () => {
    return await updateSession();
  }, [updateSession]);

  // Helper function to extract token from session object
  const getTokenFromSession = (session: any): string | null => {
    if (!session) return null;

    // If session is a string (JWT token), use it directly
    if (typeof session === "string") {
      return session;
    }

    // Otherwise, try different possible property names for the token
    return session.accessToken || session.token || session.sessionToken || null;
  };

  // Extract session token at component level
  const sessionToken = getTokenFromSession(appBridgeSession);

  // Attempt authentication when app bridge session is available and we're not already authenticated
  useEffect(() => {
    // Check if we have a session but no access token - request fresh session (only once)
    if (
      isConnected &&
      appBridgeSession &&
      !sessionToken &&
      !isSessionLoading &&
      !hasAttemptedAuth &&
      !hasRequestedSession
    ) {
      setHasRequestedSession(true);
      refreshSession();
    }

    const shouldAuthenticate =
      isInIframe && // Only attempt App Bridge auth when actually in an iframe
      isConnected &&
      sessionToken &&
      !isSessionLoading &&
      authStatus === "unauthenticated" && // Only when NextAuth shows unauthenticated (not loading or authenticated)
      !isAuthenticating &&
      !hasAttemptedAuth &&
      !hasSuccessfulAuth && // Don't retry if we already had a successful auth
      !authError; // Don't retry if we already have an auth error

    if (shouldAuthenticate) {
      setIsAuthenticating(true);
      setAuthError(null);
      setHasAttemptedAuth(true);

      clientSessionTokenSignIn(sessionToken)
        .then(async () => {
          // Mark as successfully authenticated to prevent re-attempts
          setHasSuccessfulAuth(true);

          // Update the NextAuth session to reflect the new authentication state
          await stableUpdateSession();

          handleAuthSuccess();
        })
        .catch((error) => {
          const errorMessage = error.message || "Authentication failed";
          console.error("AppBridgeAuth - authentication failed:", errorMessage);
          setAuthError(errorMessage);
          handleAuthError(errorMessage);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    }
  }, [
    isConnected,
    appBridgeSession,
    sessionToken,
    isSessionLoading,
    authStatus,
    isAuthenticating,
    hasAttemptedAuth,
    hasRequestedSession,
    hasSuccessfulAuth,
    refreshSession,
    handleAuthSuccess,
    handleAuthError,
    stableUpdateSession,
  ]);

  // Reset successful auth flag when NextAuth session is established
  useEffect(() => {
    if (authStatus === "authenticated" && hasSuccessfulAuth) {
      setHasSuccessfulAuth(false);
      setHasAttemptedAuth(false);
      setHasRequestedSession(false);
    }
  }, [authStatus, hasSuccessfulAuth]);

  // Show loading state while connecting to app bridge or authenticating
  if (isConnecting || (isConnected && isSessionLoading && !hasAttemptedAuth)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {isConnecting ? "Connecting to Mantle..." : "Loading session..."}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while authenticating
  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show error state if app bridge connection failed
  if (connectionError && !isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
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
            Connection Failed
          </h2>
          <p className="text-gray-600 mb-4">{connectionError}</p>
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

  // Show error state if session loading failed
  if (sessionError && !appBridgeSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
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
            Session Error
          </h2>
          <p className="text-gray-600 mb-4">{sessionError}</p>
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

  // Show error state if authentication failed
  if (authError && hasAttemptedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
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
            onClick={() => {
              setHasAttemptedAuth(false);
              setAuthError(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show fallback if not connected to app bridge
  if (!isConnected && !isConnecting) {
    if (isInIframe) {
      // In iframe but not connected - this might mean the organization hasn't been set up yet
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Organization Not Set Up
              </h2>
              <p className="text-gray-600 mb-4">
                This element needs to be installed first. Please complete the
                OAuth setup process.
              </p>
              <button
                onClick={() => {
                  // Redirect to OAuth by reloading without any special parameters
                  // The server-side will handle the redirect to OAuth
                  window.location.reload();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )
      );
    } else {
      // Not in iframe - check if we have HMAC parameters indicating this is a valid Mantle request
      const urlParams = new URLSearchParams(window.location.search);
      const hasHmac = urlParams.has("hmac");
      const hasOrgId = urlParams.has("organizationId");

      if (hasHmac && hasOrgId) {
        // This is a valid Mantle request but accessed directly - redirect to OAuth
        return (
          fallback || (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Redirecting to Setup
                </h2>
                <p className="text-gray-600 mb-4">
                  This element needs to be set up. Redirecting to OAuth...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </div>
          )
        );
      } else {
        // Direct access without valid parameters
        return (
          fallback || (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Direct Access Not Allowed
                </h2>
                <p className="text-gray-600 mb-4">
                  This application must be accessed through the Mantle platform.
                  Please complete the OAuth installation first.
                </p>
                <p className="text-sm text-gray-500">
                  If you're setting up this element, please follow the
                  installation process.
                </p>
              </div>
            </div>
          )
        );
      }
    }
  }

  // Show fallback if no session token available
  if (isConnected && !sessionToken && !isSessionLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Session Available
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to retrieve session from Mantle platform.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    );
  }

  // Show loading state while NextAuth is loading
  if (authStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated (either by NextAuth or by successful session token auth)
  // Also consider authenticated if we have a successful app bridge connection with session token
  const hasValidAppBridgeAuth =
    isConnected && sessionToken && hasSuccessfulAuth;
  const shouldRenderChildren =
    (authStatus === "authenticated" && session) || hasValidAppBridgeAuth;

  if (shouldRenderChildren) {
    return <>{children}</>;
  }

  // Default fallback
  return (
    fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  );
}

/**
 * Hook for app bridge authentication status
 */
export function useAppBridgeAuth() {
  const { data: session, status: authStatus } = useSession();
  const {
    isConnected,
    isConnecting,
    session: appBridgeSession,
    isSessionLoading,
    sessionError,
    connectionError,
  } = useSharedMantleAppBridge();

  const isAuthenticated = authStatus === "authenticated" && session;
  const isLoading =
    authStatus === "loading" ||
    isConnecting ||
    (isConnected && isSessionLoading);
  const hasError = !!(connectionError || sessionError);

  return {
    // Authentication state
    isAuthenticated,
    isLoading,
    hasError,
    session,
    authStatus,

    // App bridge state
    isConnected,
    appBridgeSession,
    connectionError,
    sessionError,
  };
}
