"use client";
import { components } from "@/lib/types/mantleApi";
import {
  useAppBridge,
  useAuthenticatedFetch,
  useUser,
} from "@heymantle/app-bridge-react";
import {
  Button,
  Card,
  HorizontalStack,
  Link,
  Select,
  Text,
  TextField,
  VerticalStack,
} from "@heymantle/litho";
import { useEffect, useState } from "react";

// Types from OpenAPI schema
type Customer = components["schemas"]["Customer"];
type CustomerListResult = components["schemas"]["Pagination"] & {
  customers: Customer[];
};

type RequestMode = "server" | "client" | "access-token";

// Helper function to extract session token
const extractSessionToken = (session: any): string | null => {
  if (!session) return null;
  if (typeof session === "string") return session;
  return session.accessToken || session.token || session.sessionToken || null;
};

// Customer card component
const CustomerCard = ({ customer }: { customer: Customer }) => (
  <Card padded>
    <VerticalStack gap="1">
      <Link url={`mantle://customers/${customer.id}`}>
        <Text variant="bodyMd" fontWeight="medium">
          {customer.name || `Customer ${customer.id}`}
        </Text>
      </Link>
      {customer.email && (
        <Text variant="bodySm" color="subdued">
          {customer.email}
        </Text>
      )}
      {customer.tags && customer.tags.length > 0 && (
        <Text variant="bodySm" color="subdued">
          Tags: {customer.tags.join(", ")}
        </Text>
      )}
    </VerticalStack>
  </Card>
);

interface CustomerListProps {
  hasAccessToken?: boolean;
}

export default function CustomerList({
  hasAccessToken = false,
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<CustomerListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestMode, setRequestMode] = useState<RequestMode>("server");

  const {
    mantle,
    isReady,
    isConnecting,
    error: appBridgeError,
  } = useAppBridge();
  const { authenticatedFetch } = useAuthenticatedFetch();
  const { user, isLoading: userLoading, error: userError } = useUser();

  // Get session token from app bridge
  const sessionToken = mantle?.currentSession
    ? extractSessionToken(mantle.currentSession)
    : null;

  // Request session when App Bridge is ready
  useEffect(() => {
    if (mantle && isReady && !sessionToken && !userLoading) {
      mantle.requestSession();
    }
  }, [mantle, isReady, sessionToken, userLoading]);

  // Switch away from access-token mode if no access token is available
  useEffect(() => {
    if (hasAccessToken === false && requestMode === "access-token") {
      setRequestMode("server");
    }
  }, [hasAccessToken, requestMode]);

  const handleSearch = async () => {
    if (!sessionToken) {
      setError("No session token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data =
        requestMode === "server"
          ? await searchViaServer()
          : requestMode === "client"
          ? await searchViaClient()
          : await searchViaAccessToken();
      setResult(data);
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchViaServer = async (): Promise<CustomerListResult> => {
    if (!mantle) {
      throw new Error("App Bridge not available");
    }

    const params = buildSearchParams();
    const url = `/api/customers?${params.toString()}`;

    const response = await authenticatedFetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API call failed with status: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    return response.json();
  };

  const searchViaClient = async (): Promise<CustomerListResult> => {
    if (!mantle) {
      throw new Error("App Bridge not available");
    }

    const params = buildSearchParams();
    const baseUrl =
      process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
      "https://api.heymantle.com/v1";
    const url = `${baseUrl}/customers?${params.toString()}`;

    const response = await authenticatedFetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API call failed with status: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    return response.json();
  };

  const searchViaAccessToken = async (): Promise<CustomerListResult> => {
    if (!mantle) {
      throw new Error("App Bridge not available");
    }

    const params = buildSearchParams();
    const url = `/api/customers?${params.toString()}`;

    // Use authenticatedFetch - the server will automatically use access token if available
    const response = await authenticatedFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API call failed with status: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    return response.json();
  };

  const buildSearchParams = (): URLSearchParams => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    params.set("page", "1");
    params.set("take", "10");
    return params;
  };

  // If no app bridge context is available, show a message
  if (!mantle) {
    return (
      <Card title="Customers" padded>
        <VerticalStack gap="4" align="center">
          <Text variant="bodyMd" color="subdued">
            Customer list is not available during setup. Please configure your
            environment variables first.
          </Text>
        </VerticalStack>
      </Card>
    );
  }

  return (
    <Card title="Customers" padded>
      <VerticalStack gap="4">
        {/* Request Mode Toggle */}
        <HorizontalStack gap="2" blockAlign="center">
          <Text variant="bodyMd" fontWeight="medium">
            Request Mode:
          </Text>
          <Select
            id="request-mode"
            name="request-mode"
            value={requestMode}
            onChange={(value: string) => setRequestMode(value as RequestMode)}
            options={[
              { label: "Server-side (via API route)", value: "server" },
              { label: "Client-side (direct to Mantle)", value: "client" },
              {
                label: hasAccessToken
                  ? "Access Token (via API route)"
                  : "Access Token (via API route) - Not Available",
                value: "access-token",
                disabled: !hasAccessToken,
              },
            ]}
            disabled={loading}
            onFocus={() => {}}
            onBlur={() => {}}
            tooltip="Choose between server-side proxy, direct client-side requests, or access token authentication"
          />
        </HorizontalStack>

        {/* Search Input */}
        <HorizontalStack gap="2" blockAlign="end">
          <TextField
            label="Search customers"
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
            placeholder="Enter search term..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            disabled={!sessionToken || isConnecting || userLoading}
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            disabled={loading || !sessionToken || isConnecting || userLoading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </HorizontalStack>

        {/* Session Status */}
        {!sessionToken && !appBridgeError && !isConnecting && (
          <Text variant="bodySm" color="subdued">
            {isReady
              ? userLoading
                ? "Loading user session..."
                : "Waiting for session..."
              : "Waiting for App Bridge to initialize..."}
          </Text>
        )}

        {/* Error Display */}
        {error && (
          <Card>
            <Text variant="bodyMd" color="critical">
              Error: {error}
            </Text>
          </Card>
        )}

        {/* Results */}
        {result && (
          <VerticalStack gap="3">
            <HorizontalStack gap="2" align="space-between" blockAlign="center">
              <HorizontalStack gap="2" blockAlign="center">
                <Text variant="bodyMd" color="success">
                  Found {result.customers?.length || 0} customers
                </Text>
                <Text variant="bodySm" color="subdued">
                  (
                  {requestMode === "server"
                    ? "via API route (JWT)"
                    : requestMode === "client"
                    ? "direct to Mantle"
                    : "via API route (Access Token)"}
                  )
                </Text>
              </HorizontalStack>
              {result.total && (
                <Text variant="bodySm" color="subdued">
                  Total: {result.total} customers
                </Text>
              )}
            </HorizontalStack>

            {result.customers && result.customers.length > 0 ? (
              <VerticalStack gap="2">
                {result.customers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </VerticalStack>
            ) : (
              <Card>
                <Text variant="bodyMd" color="subdued" alignment="center">
                  No customers found
                </Text>
              </Card>
            )}
          </VerticalStack>
        )}
      </VerticalStack>
    </Card>
  );
}
