"use client";

import { EmbeddedAuthProvider } from "@/lib/embedded-auth-context";
import { isRunningInIframe } from "@/lib/mantle-app-bridge";
import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { Button, Page, Spinner, VerticalStack } from "@heymantle/litho";
import { Organization, User } from "@prisma/client";
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
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const {
    isConnected,
    isConnecting,
    session: appBridgeSession,
    isSessionLoading,
    sessionError,
    connectionError,
    appBridge,
    authenticatedFetch,
  } = useSharedMantleAppBridge();

  // Extract session token from app bridge session
  const getSessionToken = useCallback((session: any): string | null => {
    if (!session) return null;
    if (typeof session === "string") return session;
    return session.accessToken || session.token || session.sessionToken || null;
  }, []);

  const sessionToken = getSessionToken(appBridgeSession);

  // Set client flag after hydration to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle OAuth redirect for unrecognized organizations or non-iframe access
  useEffect(() => {
    const actuallyInIframe = appBridge?.isInIframe?.() ?? isInIframe;
    // Always treat non-iframe access as needing OAuth redirect
    const shouldRedirectToOAuth = needsOAuthRedirect || !actuallyInIframe;

    if (!shouldRedirectToOAuth) {
      return;
    }

    if (
      shouldRedirectToOAuth &&
      actuallyInIframe &&
      isConnected &&
      appBridge?.redirect
    ) {
      setShouldRedirect(true);

      // For iframe context, redirect the parent window to ensure cookies are set at root level
      // This ensures the state cookie is accessible when the OAuth callback happens
      const baseUrl = `${window.location.origin}/api/auth/initiate`;
      const initiateUrl = organizationId
        ? `${baseUrl}?organizationId=${encodeURIComponent(organizationId)}`
        : baseUrl;
      appBridge.redirect(initiateUrl);
    } else if (shouldRedirectToOAuth && !actuallyInIframe) {
      // If we need OAuth redirect but we're not in an iframe, do a regular redirect
      // This should happen immediately, regardless of app bridge connection status
      setShouldRedirect(true);

      // Use NextAuth's OAuth initiation endpoint to ensure proper state cookie handling
      const baseUrl = `/api/auth/initiate`;
      const initiateUrl = organizationId
        ? `${baseUrl}?organizationId=${encodeURIComponent(organizationId)}`
        : baseUrl;
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

      // TODO: replace with app-bridge authenticatedFetch
      authenticatedFetch("/api/auth/verify-session", {
        method: "POST",
      })
        .then(async (response) => {
          const result = await response.json();

          if (response.ok && result.user && result.organization) {
            setUser(result.user);
            setOrganization(result.organization);
            setIsAuthenticated(true);
          } else {
            if (response.status === 401) {
              setShouldRedirect(true);
              appBridge?.redirect(window.location.href);
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

  // Always start with a loading state to prevent hydration mismatch
  // The client will update this state after hydration
  if (!isClient) {
    return <LoadingState message="Initializing..." />;
  }

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

  // Render children when authenticated, wrapped in context provider
  if (isAuthenticated) {
    return (
      <EmbeddedAuthProvider
        user={user}
        organization={organization}
        isAuthenticated={isAuthenticated}
        isLoading={isAuthenticating}
        error={authError}
      >
        {children}
      </EmbeddedAuthProvider>
    );
  }

  // Default loading state
  return <LoadingState message="Initializing..." />;
}

// Helper components
function LoadingState({ message }: { message: string }) {
  return (
    <Page title="Loading" subtitle={message}>
      <VerticalStack gap="4" align="center">
        <Spinner size="large" />
      </VerticalStack>
    </Page>
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
    <Page title={title} subtitle={message} fullWidth={true}>
      <VerticalStack gap="4" align="center">
        {onRetry && (
          <Button onClick={onRetry} primary>
            Try Again
          </Button>
        )}
      </VerticalStack>
    </Page>
  );
}
