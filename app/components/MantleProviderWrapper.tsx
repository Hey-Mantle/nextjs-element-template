"use client";
import {
  useAppBridge,
  useAuthenticatedFetch,
  useOrganization,
} from "@heymantle/app-bridge-react";
import { AppProvider } from "@heymantle/litho";
import { MantleProvider } from "@heymantle/react";
import { useEffect, useState } from "react";

interface MantleProviderWrapperProps {
  children: React.ReactNode;
}

export default function MantleProviderWrapper({
  children,
}: MantleProviderWrapperProps) {
  const { mantle, isReady } = useAppBridge();
  const { organization } = useOrganization();
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [customerApiToken, setCustomerApiToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Request session when App Bridge is ready
  useEffect(() => {
    if (mantle && isReady && !mantle.currentSession) {
      mantle.requestSession();
    }
  }, [mantle, isReady]);

  useEffect(() => {
    async function syncSessionAndGetCustomerApiToken() {
      if (
        !isReady ||
        !mantle ||
        !organization ||
        !authenticatedFetch ||
        !mantle.currentSession
      ) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use authenticatedFetch to automatically handle authentication
        const response = await authenticatedFetch("/api/sync-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to sync session: ${errorData.error || response.status}`
          );
        }

        const data = await response.json();
        setCustomerApiToken(data.customerApiToken);
      } catch (err) {
        console.error("Failed to sync session:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    syncSessionAndGetCustomerApiToken();
  }, [isReady, mantle, organization, authenticatedFetch]);

  // Show loading state while App Bridge initializes or while fetching session
  // Don't return null as this can cause Next.js to think the page doesn't exist
  if (!isReady || !mantle?.currentSession || isLoading) {
    return <div>Loading Mantle...</div>;
  }

  // If we have an error or no customerApiToken, still render children
  // This allows modal pages to work even when accessed directly (not in iframe)
  // The children can handle their own error states if needed
  if (error || !customerApiToken) {
    return (
      <AppProvider
        darkModeAvailable
        darkModeStorageKey="nextjs-litho-dark-mode"
        embedded={true}
        onDarkModeChange={() => {}}
      >
        {children}
      </AppProvider>
    );
  }

  // Wrap children with AppProvider for Litho UI components
  return (
    <AppProvider
      darkModeAvailable
      darkModeStorageKey="nextjs-litho-dark-mode"
      embedded={true}
      onDarkModeChange={() => {}}
    >
      <MantleProvider
        appId={process.env.NEXT_PUBLIC_MANTLE_APP_ID!}
        customerApiToken={customerApiToken}
        apiUrl={process.env.NEXT_PUBLIC_MANTLE_APP_API_URL}
      >
        {children}
      </MantleProvider>
    </AppProvider>
  );
}
