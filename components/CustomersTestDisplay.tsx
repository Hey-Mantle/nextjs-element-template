"use client";

import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import {
  Button,
  Card,
  Link,
  Text,
  TextField,
  VerticalStack,
} from "@heymantle/litho";
import { useState } from "react";

export default function CustomersTestDisplay() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { session, isSessionLoading, sessionError } =
    useSharedMantleAppBridge();

  // Extract session token from session
  const sessionToken =
    session && typeof session === "object" && "accessToken" in session
      ? (session as any).accessToken
      : typeof session === "string"
      ? session
      : null;

  const handleSearch = async () => {
    console.log("handleSearch called with searchTerm:", searchTerm);
    console.log("sessionToken available:", !!sessionToken);

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
      params.set("limit", "10");

      const url = `/api/customers?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        setResult(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        setError(
          `API call failed with status: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <VerticalStack gap="3">
        <Text variant="headingMd">Customers Search</Text>

        {/* Session Token Status */}
        <VerticalStack gap="1">
          <Text variant="bodySm" color={sessionToken ? "success" : "critical"}>
            {sessionToken
              ? "✅ Session token available"
              : sessionError
              ? "❌ Session error"
              : isSessionLoading
              ? "⏳ Loading session..."
              : "❌ No session token"}
          </Text>
          {sessionError && (
            <Text variant="bodySm" color="critical">
              {sessionError}
            </Text>
          )}
          {!sessionToken && !sessionError && !isSessionLoading && (
            <Text variant="bodySm" color="subdued">
              Waiting for App Bridge to initialize...
            </Text>
          )}
        </VerticalStack>

        {/* Search Input */}
        <VerticalStack gap="2">
          <Text variant="bodySm" color="subdued">
            Debug: searchTerm = "{searchTerm}" (length: {searchTerm.length})
          </Text>
          <TextField
            label="Search customers"
            value={searchTerm}
            onChange={(value: string) => {
              console.log("TextField onChange:", value);
              setSearchTerm(value);
            }}
            placeholder="Enter search term..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              console.log("TextField onKeyDown:", e.key);
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
        </VerticalStack>

        {/* Results */}
        {error ? (
          <VerticalStack gap="2">
            <Text variant="bodyMd" color="critical">
              Error: {error}
            </Text>
          </VerticalStack>
        ) : result ? (
          <VerticalStack gap="2">
            <Text variant="bodyMd" color="success">
              ✅ Found {result.customers?.length || 0} customers
            </Text>

            {result.customers && result.customers.length > 0 ? (
              <VerticalStack gap="2">
                {result.customers.map((customer: any, index: number) => (
                  <Card key={customer.id || index}>
                    <VerticalStack gap="1">
                      <Link url={`mantle://customers/${customer.id}`}>
                        {customer.name}
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
                ))}
              </VerticalStack>
            ) : (
              <Text variant="bodySm" color="subdued">
                No customers found
              </Text>
            )}

            {result.page && (
              <Text variant="bodySm" color="subdued">
                Page: {result.page} of {result.totalPages || "unknown"}
              </Text>
            )}
          </VerticalStack>
        ) : (
          <Text variant="bodyMd" color="subdued">
            Enter a search term to find customers
          </Text>
        )}
      </VerticalStack>
    </Card>
  );
}
