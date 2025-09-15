"use client";

import { clientSessionTokenSignIn } from "@/lib/auth-utils";
import { isRunningInIframe } from "@/lib/mantle-app-bridge";
import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { useCallback, useEffect, useState } from "react";

interface EmbeddedAuthProps {
  children: React.ReactNode;
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
export default function EmbeddedAuth({ children }: EmbeddedAuthProps) {
  const isInIframe = isRunningInIframe();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Authenticate with session token when available
  useEffect(() => {
    if (
      isInIframe &&
      isConnected &&
      sessionToken &&
      !isSessionLoading &&
      !isAuthenticating &&
      !isAuthenticated &&
      !authError
    ) {
      setIsAuthenticating(true);
      setAuthError(null);

      clientSessionTokenSignIn(sessionToken)
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch((error) => {
          const errorMessage = error.message || "Authentication failed";
          console.error("EmbeddedAuth - authentication failed:", errorMessage);

          // Handle organization not found - redirect parent window to OAuth
          if (errorMessage.startsWith("ORGANIZATION_NOT_FOUND:")) {
            if (typeof window !== "undefined" && appBridge?.navigate) {
              appBridge.navigate(window.location.href);
            }
            return;
          }

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

  // Handle non-iframe access
  if (!isInIframe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Embedded App Only
          </h2>
          <p className="text-gray-600 mb-4">
            This application is designed to run as an embedded element within
            the Mantle platform.
          </p>
          <p className="text-sm text-gray-500">
            Please access this app through your Mantle dashboard or complete the
            OAuth installation process.
          </p>
        </div>
      </div>
    );
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
