"use client";
import {
  Organization,
  OrganizationProvider,
} from "@/contexts/OrganizationContext";
import { User, UserProvider } from "@/contexts/UserContext";
import {
  useAppBridge,
  useOrganization as useAppBridgeOrganization,
} from "@heymantle/app-bridge-react";
import { AppProvider } from "@heymantle/litho";
import { MantleProvider } from "@heymantle/react";
import process from "process";
import { useCallback, useEffect, useState } from "react";

interface MantleProviderWrapperProps {
  children: React.ReactNode;
}

export default function MantleProviderWrapper({
  children,
}: MantleProviderWrapperProps) {
  const { mantle, isReady } = useAppBridge();
  const { organization: appBridgeOrganization } = useAppBridgeOrganization();
  const [customerApiToken, setCustomerApiToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && mantle && !appBridgeOrganization) {
      mantle.requestOrganization();
    }
  }, [mantle, isReady, appBridgeOrganization]);

  const syncSessionAndGetCustomerApiToken = useCallback(async () => {
    if (!isReady || !mantle || !appBridgeOrganization) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await mantle.authenticatedFetch("/api/sync-session", {
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
      setUser(data.user);
      setOrganization(data.organization);
    } catch (err) {
      console.error("Failed to sync session:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [isReady, mantle, appBridgeOrganization]);

  useEffect(() => {
    syncSessionAndGetCustomerApiToken();
  }, [syncSessionAndGetCustomerApiToken]);

  if (!isReady || isLoading || error || !customerApiToken) {
    return null;
  }

  return (
    <UserProvider
      user={user}
      isLoading={isLoading}
      error={error}
      refetch={syncSessionAndGetCustomerApiToken}
    >
      <OrganizationProvider
        organization={organization}
        isLoading={isLoading}
        error={error}
      >
        <AppProvider
          darkModeAvailable
          darkModeStorageKey="Mantle--DarkMode"
          embedded={true}
          onDarkModeChange={() => {}}
        >
          <MantleProvider
            appId={process.env.NEXT_PUBLIC_MANTLE_APP_ID!}
            customerApiToken={customerApiToken}
            apiUrl={`${process.env.NEXT_PUBLIC_MANTLE_APP_API_URL}/v1`}
          >
            {children}
          </MantleProvider>
        </AppProvider>
      </OrganizationProvider>
    </UserProvider>
  );
}
