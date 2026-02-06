"use client";
import { useAppBridge } from "@heymantle/app-bridge-react";
import { SWRConfig } from "swr";

interface SWRConfigProviderProps {
  children: React.ReactNode;
}

export function SWRConfigProvider({ children }: SWRConfigProviderProps) {
  const { mantle, isReady } = useAppBridge();

  if (!isReady || !mantle) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        fetcher: async (resource: string, init?: RequestInit) => {
          const response = await mantle.authenticatedFetch(resource, init as RequestInit);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(
              errorData.error || `HTTP error! status: ${response.status}`
            ) as Error & { status?: number; info?: any };
            error.status = response.status;
            error.info = errorData;
            throw error;
          }
          return response.json();
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: (error: any) => {
          if (
            error?.status === 429 ||
            (error?.status >= 400 && error?.status < 500)
          ) {
            return false;
          }
          return true;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
