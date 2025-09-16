"use client";

import { isRunningInIframe } from "@/lib/mantle-app-bridge";
import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { useCallback, useEffect, useState } from "react";

interface EmbeddedAuthProps {
  children: React.ReactNode;
  needsOAuthRedirect?: boolean;
  organizationId?: string;
}

/**
 * Simple authentication wrapper for embedded iframe apps.
 *
 * This component:
 * 1. Connects to the Mantle app bridge
 * 2. Gets the session token from the app bridge
 * 3. Uses that token to authenticate with NextAuth
 * 4. Renders children once authenticated
 *
 * For non-iframe access, it shows an appropriate message.
 */
export default function EmbeddedAuth({
  children,
  needsOAuthRedirect = false,
  organizationId,
}: EmbeddedAuthProps) {
  const isInIframe = isRunningInIframe();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    isConnected,
    isConnecting,
    session: appBridgeSession,
    isSessionLoading,
    sessionError,
    connectionError,
    appBridge,
  } = useSharedMantleAppBridge();

  // Extract session token from app bridge session
  const getSessionToken = useCallback((session: any): string | null => {
    if (!session) return null;
    if (typeof session === "string") return session;
    return session.accessToken || session.token || session.sessionToken || null;
  }, []);

  const sessionToken = getSessionToken(appBridgeSession);

  // Handle OAuth redirect for unrecognized organizations or non-iframe access
  useEffect(() => {
    const actuallyInIframe = appBridge?.isInIframe?.() ?? isInIframe;

    console.log("EmbeddedAuth - OAuth redirect effect triggered:", {
      needsOAuthRedirect,
      isInIframe,
      actuallyInIframe,
      isConnected,
      hasAppBridge: !!appBridge,
      hasRedirect: !!appBridge?.redirect,
      hasIsInIframe: !!appBridge?.isInIframe,
      organizationId,
    });

    // Always treat non-iframe access as needing OAuth redirect
    const shouldRedirectToOAuth = needsOAuthRedirect || !actuallyInIframe;

    if (!shouldRedirectToOAuth) {
      console.log("EmbeddedAuth - OAuth redirect not needed, skipping");
      return;
    }

    if (
      shouldRedirectToOAuth &&
      actuallyInIframe &&
      isConnected &&
      appBridge?.redirect
    ) {
      console.log(
        "EmbeddedAuth - redirecting to OAuth for organization:",
        organizationId
      );
      setShouldRedirect(true);

      // For iframe context, redirect the parent window to ensure cookies are set at root level
      // This ensures the state cookie is accessible when the OAuth callback happens
      const baseUrl = `${window.location.origin}/api/auth/initiate`;
      const initiateUrl = organizationId
        ? `${baseUrl}?organizationId=${encodeURIComponent(organizationId)}`
        : baseUrl;
      console.log(
        "EmbeddedAuth - redirecting parent window to NextAuth initiate URL:",
        initiateUrl
      );
      appBridge.redirect(initiateUrl);
    } else if (shouldRedirectToOAuth && !actuallyInIframe) {
      // If we need OAuth redirect but we're not in an iframe, do a regular redirect
      // This should happen immediately, regardless of app bridge connection status
      console.log(
        "EmbeddedAuth - not in iframe, doing regular redirect to OAuth for organization:",
        organizationId
      );
      setShouldRedirect(true);

      // Use NextAuth's OAuth initiation endpoint to ensure proper state cookie handling
      const baseUrl = `/api/auth/initiate`;
      const initiateUrl = organizationId
        ? `${baseUrl}?organizationId=${encodeURIComponent(organizationId)}`
        : baseUrl;
      console.log("EmbeddedAuth - doing regular redirect to:", initiateUrl);
      window.location.href = initiateUrl;
    }
  }, [needsOAuthRedirect, isInIframe, isConnected, appBridge, organizationId]);

  // Only attempt authentication if we're actually in an iframe
  useEffect(() => {
    const actuallyInIframe = appBridge?.isInIframe?.() ?? isInIframe;

    if (
      actuallyInIframe &&
      isConnected &&
      sessionToken &&
      !isSessionLoading &&
      !isAuthenticating &&
      !isAuthenticated &&
      !authError &&
      !shouldRedirect
    ) {
      setIsAuthenticating(true);
      setAuthError(null);

      // Use the new authentication approach via API endpoint
      fetch("/api/auth/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
        }),
      })
        .then(async (response) => {
          const result = await response.json();

          if (response.ok && result.user) {
            setIsAuthenticated(true);
          } else {
            // Handle 401 Unauthorized - redirect parent window to OAuth
            if (response.status === 401) {
              setShouldRedirect(true);
              if (typeof window !== "undefined" && appBridge?.redirect) {
                appBridge.redirect(window.location.href);
              }
              return;
            }

            const errorMessage = result.error || "Authentication failed";
            setAuthError(errorMessage);
          }
        })
        .catch((error) => {
          const errorMessage = error.message || "Authentication failed";
          console.error("EmbeddedAuth - authentication failed:", errorMessage);
          setAuthError(errorMessage);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    }
  }, [
    isInIframe,
    isConnected,
    sessionToken,
    isSessionLoading,
    isAuthenticating,
    isAuthenticated,
    authError,
    shouldRedirect,
    appBridge,
  ]);

  // Show loading while connecting to app bridge
  if (isConnecting) {
    return <LoadingState message="Connecting to Mantle..." />;
  }

  // Show loading while getting session
  if (isConnected && isSessionLoading) {
    return <LoadingState message="Loading session..." />;
  }

  // Show loading while authenticating
  if (isAuthenticating) {
    return <LoadingState message="Authenticating..." />;
  }

  // Show loading while redirecting
  if (shouldRedirect) {
    return <LoadingState message="Redirecting to OAuth..." />;
  }

  // Show error states
  if (connectionError) {
    return <ErrorState title="Connection Failed" message={connectionError} />;
  }

  if (sessionError) {
    return <ErrorState title="Session Error" message={sessionError} />;
  }

  if (authError) {
    return (
      <ErrorState
        title="Authentication Failed"
        message={authError}
        onRetry={() => {
          setAuthError(null);
          setIsAuthenticated(false);
        }}
      />
    );
  }

  // Handle non-iframe access - this should now be handled by OAuth redirect above
  const actuallyInIframe = appBridge?.isInIframe?.() ?? isInIframe;
  if (!actuallyInIframe) {
    // If we reach here, it means the OAuth redirect didn't happen for some reason
    // Show a loading state while the redirect should be processing
    return <LoadingState message="Redirecting to authentication..." />;
  }

  // Handle app bridge connection issues
  if (!isConnected) {
    return (
      <ErrorState
        title="Not Connected"
        message="Unable to connect to Mantle platform. This app must be accessed through Mantle."
      />
    );
  }

  // Handle missing session token
  if (!sessionToken) {
    return (
      <ErrorState
        title="No Session"
        message="Unable to retrieve session from Mantle platform."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Render children when authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Default loading state
  return <LoadingState message="Initializing..." />;
}

// Helper components
function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
