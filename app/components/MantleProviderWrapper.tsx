"use client";
import {
  useAppBridge,
  useAuthenticatedFetch,
  useOrganization,
} from "@heymantle/app-bridge-react";
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

  useEffect(() => {
    async function syncSessionAndGetCustomerApiToken() {
      if (!isReady || !mantle || !organization || !authenticatedFetch) {
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

  // Show loading state while fetching the customer API token
  if (isLoading) {
    return <div>Loading Mantle...</div>;
  }

  // Show error state if we couldn't get the customer API token
  if (error || !customerApiToken) {
    return <>{children}</>;
  }

  // For now, just render children without MantleProvider since the customer API token
  // approach has CORS issues. The app-bridge-react hooks can be used directly instead.
  return <>{children}</>;
}
