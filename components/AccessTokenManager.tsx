"use client";

import {
  useAppBridge,
  useAuthenticatedFetch,
} from "@heymantle/app-bridge-react";
import {
  Badge,
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { useEffect, useRef, useState } from "react";

interface AccessTokenInfo {
  id: string;
  tokenType: string;
  scope: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  organization: {
    id: string;
    name: string;
  };
}

interface AccessTokenManagerProps {
  onTokenStatusChange?: (hasToken: boolean) => void;
}

export default function AccessTokenManager({
  onTokenStatusChange,
}: AccessTokenManagerProps) {
  const { mantle, isReady } = useAppBridge();
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<AccessTokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const hasLoadedStatus = useRef(false);

  // Load current token status when component mounts and session is available
  useEffect(() => {
    if (!hasLoadedStatus.current && isReady && mantle?.currentSession) {
      hasLoadedStatus.current = true;
      loadTokenStatus();
    }
  }, [isReady, mantle?.currentSession]);

  const loadTokenStatus = async () => {
    if (!authenticatedFetch) {
      console.error("authenticatedFetch not available");
      setError("Authentication not available. Please refresh the page.");
      setIsLoadingStatus(false);
      return;
    }

    try {
      console.log("Loading token status...");
      const response = await authenticatedFetch("/api/access-token-status");
      if (response.ok) {
        const data = await response.json();
        setTokenInfo(data.tokenInfo);
        onTokenStatusChange?.(!!data.tokenInfo);
      } else {
        console.log("No token found or error loading status");
        setTokenInfo(null);
        onTokenStatusChange?.(false);
      }
    } catch (err) {
      console.error("Failed to load token status:", err);
      setTokenInfo(null);
      onTokenStatusChange?.(false);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleRequestAccessToken = async () => {
    if (!authenticatedFetch) {
      setError("Authenticated fetch not available");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAction("Requesting access token...");

    try {
      const response = await authenticatedFetch("/api/test-token-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setTokenInfo(data.tokenInfo);
      setAction("Access token granted successfully!");
      onTokenStatusChange?.(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setTimeout(() => setAction(null), 3000);
    }
  };

  const handleRefreshToken = async () => {
    if (!authenticatedFetch || !tokenInfo) return;

    setIsLoading(true);
    setError(null);
    setAction("Refreshing access token...");

    try {
      const response = await authenticatedFetch("/api/refresh-access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setTokenInfo(data.tokenInfo);
      setAction("Access token refreshed successfully!");
      onTokenStatusChange?.(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setTimeout(() => setAction(null), 3000);
    }
  };

  const handleRevokeToken = async () => {
    if (!authenticatedFetch || !tokenInfo) return;

    setIsLoading(true);
    setError(null);
    setAction("Revoking access token...");

    try {
      const response = await authenticatedFetch("/api/revoke-access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setTokenInfo(null);
      setAction("Access token revoked successfully!");
      onTokenStatusChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setTimeout(() => setAction(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTokenTypeBadge = (tokenType: string) => {
    return tokenType === "offline" ? (
      <Badge status="success">Offline</Badge>
    ) : (
      <Badge status="info">Online</Badge>
    );
  };

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Access Token Management</Text>

        {action && (
          <Text variant="bodyMd" color="success">
            {action}
          </Text>
        )}

        {error && (
          <Text variant="bodyMd" color="critical">
            Error: {error}
          </Text>
        )}

        {isLoadingStatus ? (
          <Text variant="bodyMd">Loading token status...</Text>
        ) : !tokenInfo ? (
          <VerticalStack gap="3">
            <Text variant="bodyMd">
              No access token found. Request an access token to enable
              long-running operations.
            </Text>
            <Button onClick={handleRequestAccessToken} disabled={isLoading}>
              {isLoading ? "Requesting..." : "Request Access Token"}
            </Button>
          </VerticalStack>
        ) : (
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              Access token is active and ready for use.
            </Text>

            {/* Token Information */}
            <VerticalStack gap="2">
              <Text variant="headingSm">Token Information</Text>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  Type:
                </Text>
                {getTokenTypeBadge(tokenInfo.tokenType)}
              </HorizontalStack>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  Scopes:
                </Text>
                <Text variant="bodyMd">{tokenInfo.scope}</Text>
              </HorizontalStack>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  User:
                </Text>
                <Text variant="bodyMd">
                  {tokenInfo.user?.name || "Unknown"} (
                  {tokenInfo.user?.email || "Unknown"})
                </Text>
              </HorizontalStack>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  Organization:
                </Text>
                <Text variant="bodyMd">
                  {tokenInfo.organization?.name || "Unknown"}
                </Text>
              </HorizontalStack>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  Created:
                </Text>
                <Text variant="bodyMd">{formatDate(tokenInfo.createdAt)}</Text>
              </HorizontalStack>

              <HorizontalStack gap="2" align="start">
                <Text variant="bodyMd" color="subdued">
                  Updated:
                </Text>
                <Text variant="bodyMd">{formatDate(tokenInfo.updatedAt)}</Text>
              </HorizontalStack>

              {tokenInfo.expiresAt && (
                <HorizontalStack gap="2" align="start">
                  <Text variant="bodyMd" color="subdued">
                    Expires:
                  </Text>
                  <Text variant="bodyMd">
                    {formatDate(tokenInfo.expiresAt)}
                  </Text>
                </HorizontalStack>
              )}
            </VerticalStack>

            {/* Action Buttons */}
            <HorizontalStack gap="2">
              {tokenInfo.tokenType === "offline" && (
                <Button onClick={handleRefreshToken} disabled={isLoading}>
                  {isLoading ? "Refreshing..." : "Refresh Token"}
                </Button>
              )}

              <Button onClick={handleRevokeToken} disabled={isLoading}>
                {isLoading ? "Revoking..." : "Revoke Token"}
              </Button>
            </HorizontalStack>
          </VerticalStack>
        )}
      </VerticalStack>
    </Card>
  );
}
