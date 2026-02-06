import { useAppBridge } from "@heymantle/app-bridge-react";
import { useCallback } from "react";

/**
 * Hook for authenticated mutations (POST, PUT, DELETE, PATCH)
 * This uses authenticatedFetch from App Bridge, which is configured
 * in the SWRConfigProvider for GET requests via useSWR.
 */
export function useAuthenticatedMutation() {
  const { mantle, isReady } = useAppBridge();

  const mutate = useCallback(
    async (
      url: string,
      options: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: any;
        headers?: Record<string, string>;
      } = {}
    ) => {
      if (!mantle || !isReady) {
        throw new Error("Mantle App Bridge not ready");
      }

      const { method = "POST", body, headers = {} } = options;

      const fetchOptions: RequestInit = {
        method,
        headers: {
          ...headers,
        },
      };

      if (body !== undefined && method !== "GET") {
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...headers,
        };
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await mantle.authenticatedFetch(url, fetchOptions);

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
    [mantle, isReady]
  );

  return { mutate };
}
