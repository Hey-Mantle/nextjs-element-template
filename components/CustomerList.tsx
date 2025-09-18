"use client";

import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import {
  Button,
  Card,
  HorizontalStack,
  Link,
  Text,
  TextField,
  VerticalStack,
} from "@heymantle/litho";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  email?: string;
  tags?: string[];
}

interface CustomerListResult {
  customers: Customer[];
  page: number;
  totalPages?: number;
}

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<CustomerListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { session, isSessionLoading, sessionError, authenticatedFetch } =
    useSharedMantleAppBridge();

  // Extract session token from session
  const sessionToken =
    session && typeof session === "object" && "accessToken" in session
      ? (session as any).accessToken
      : typeof session === "string"
      ? session
      : null;

  const handleSearch = async () => {
    if (!sessionToken) {
      setError("No session token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }
      params.set("page", "1");
      params.set("limit", "10"); // Limit to 10 results

      const url = `/api/customers?${params.toString()}`;

      const response = await authenticatedFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(
          `API call failed with status: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Customers" padded>
      <VerticalStack gap="4">
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
            disabled={!sessionToken || isSessionLoading}
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            disabled={loading || !sessionToken || isSessionLoading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </HorizontalStack>

        {/* Session Status */}
        {!sessionToken && !sessionError && !isSessionLoading && (
          <Text variant="bodySm" color="subdued">
            Waiting for session to initialize...
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
              <Text variant="bodyMd" color="success">
                Found {result.customers?.length || 0} customers
              </Text>
              {result.page && (
                <Text variant="bodySm" color="subdued">
                  Page {result.page} of {result.totalPages || "unknown"}
                </Text>
              )}
            </HorizontalStack>

            {result.customers && result.customers.length > 0 ? (
              <VerticalStack gap="2">
                {result.customers.map((customer: Customer) => (
                  <Card key={customer.id} padded>
                    <HorizontalStack
                      gap="3"
                      align="space-between"
                      blockAlign="center"
                    >
                      <VerticalStack gap="1">
                        <Link url={`mantle://customers/${customer.id}`}>
                          <Text variant="bodyMd" fontWeight="medium">
                            {customer.name}
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
                    </HorizontalStack>
                  </Card>
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
