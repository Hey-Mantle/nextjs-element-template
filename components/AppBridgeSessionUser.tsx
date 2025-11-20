"use client";

import { useAppBridge, useUser } from "@heymantle/app-bridge-react";
import {
  Badge,
  Button,
  Spinner,
  Stack,
  Text,
} from "@heymantle/litho";

// Utility function to decode JWT payload without verification
function decodeJWTPayload(token: string): Record<string, any> | null {
  // Split the JWT into its three parts
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  // Decode the payload (second part)
  const payload = parts[1];
  // Add padding if needed for base64 decoding
  const paddedPayload = payload.padEnd(
    payload.length + ((4 - (payload.length % 4)) % 4),
    "="
  );

  // Decode from base64url to JSON
  const decodedPayload = atob(
    paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
  );
  return JSON.parse(decodedPayload);
}

export default function AppBridgeSessionUser() {
  const { mantle, isReady } = useAppBridge();
  const { user, isLoading, error, refetch } = useUser();

  // Get organization ID from app bridge
  const organizationId = mantle?.currentOrganizationId || null;

  if (!isReady) {
    return null;
  }

  return (
    <Stack gap="4">
      {/* Session Section */}
      <Stack gap="3">
        <Stack horizontal gap="3" align="center">
          <Text variant="bodyMd" fontWeight="medium">
            Session:
          </Text>
          {isLoading ? (
            <Stack horizontal gap="2" align="center">
              <Spinner size="small" />
              <Text variant="bodySm">Loading...</Text>
            </Stack>
          ) : error ? (
            <Badge status="critical">
              <Text variant="bodySm">Error</Text>
            </Badge>
          ) : mantle?.currentSession ? (
            <Badge status="success">
              <Text variant="bodySm">Active</Text>
            </Badge>
          ) : (
            <Badge status="warning">
              <Text variant="bodySm">No Session</Text>
            </Badge>
          )}
          <Button onClick={refetch} size="small" disabled={isLoading}>
            Refresh
          </Button>
        </Stack>

        {error && (
          <Text variant="bodyMd" color="critical">
            Session Error: {error}
          </Text>
        )}

        {mantle?.currentSession && (
          <Stack gap="2">
            {typeof mantle.currentSession === "string" ? (
              // Handle JWT token string
              <>
                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Session Token:
                  </Text>
                  <Text
                    variant="bodyMd"
                    className="font-mono break-all overflow-wrap-anywhere max-w-full"
                  >
                    {mantle.currentSession}
                  </Text>
                </Stack>

                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Type:
                  </Text>
                  <Text variant="bodyMd">JWT Token</Text>
                </Stack>

                {/* Decoded JWT Payload */}
                {(() => {
                  const decodedPayload = decodeJWTPayload(
                    mantle.currentSession as string
                  );
                  if (decodedPayload) {
                    return (
                      <Stack gap="2">
                        <Text variant="bodyMd" fontWeight="medium">
                          Decoded JWT Payload:
                        </Text>
                        <Stack gap="1">
                          {Object.entries(decodedPayload).map(
                            ([key, value]) => (
                              <Stack horizontal key={key} gap="3" align="start">
                                <Text
                                  variant="bodySm"
                                  fontWeight="medium"
                                  className="min-w-24"
                                >
                                  {key}:
                                </Text>
                                <Text
                                  variant="bodySm"
                                  className="font-mono break-all"
                                >
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </Text>
                              </Stack>
                            )
                          )}
                        </Stack>
                      </Stack>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              // Handle session object
              <>
                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Session ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(mantle.currentSession as any).id}
                  </Text>
                </Stack>

                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    User ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(mantle.currentSession as any).userId}
                  </Text>
                </Stack>

                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Organization ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(mantle.currentSession as any).organizationId}
                  </Text>
                </Stack>

                <Stack horizontal gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Expires:
                  </Text>
                  <Text variant="bodyMd">
                    {new Date(
                      (mantle.currentSession as any).expiresAt
                    ).toLocaleString()}
                  </Text>
                </Stack>
              </>
            )}
          </Stack>
        )}
      </Stack>

      {/* Organization ID Section */}
      <Stack gap="3">
        <Stack horizontal gap="3" align="center">
          <Text variant="bodyMd" fontWeight="medium">
            Organization ID:
          </Text>
          {organizationId ? (
            <Badge status="success">
              <Text variant="bodySm">Available</Text>
            </Badge>
          ) : (
            <Badge status="warning">
              <Text variant="bodySm">Not Available</Text>
            </Badge>
          )}
        </Stack>

        {organizationId && (
          <Stack horizontal gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Current Org ID:
            </Text>
            <Text variant="bodyMd" className="font-mono">
              {organizationId}
            </Text>
          </Stack>
        )}
      </Stack>

      {/* User Section */}
      <Stack gap="3">
        <Stack horizontal gap="3" align="center">
          <Text variant="bodyMd" fontWeight="medium">
            User:
          </Text>
          {isLoading ? (
            <Stack horizontal gap="2" align="center">
              <Spinner size="small" />
              <Text variant="bodySm">Loading...</Text>
            </Stack>
          ) : error ? (
            <Badge status="critical">
              <Text variant="bodySm">Error</Text>
            </Badge>
          ) : user ? (
            <Badge status="success">
              <Text variant="bodySm">Loaded</Text>
            </Badge>
          ) : (
            <Badge status="warning">
              <Text variant="bodySm">No User</Text>
            </Badge>
          )}
          <Button onClick={refetch} size="small" disabled={isLoading}>
            Refresh
          </Button>
        </Stack>

        {error && (
          <Text variant="bodyMd" color="critical">
            User Error: {error}
          </Text>
        )}

        {user && (
          <Stack gap="2">
            <Stack horizontal gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                Name:
              </Text>
              <Text variant="bodyMd">{user.name}</Text>
            </Stack>

            <Stack horizontal gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                Email:
              </Text>
              <Text variant="bodyMd">{user.email}</Text>
            </Stack>

            <Stack horizontal gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                User ID:
              </Text>
              <Text variant="bodyMd" className="font-mono">
                {user.id}
              </Text>
            </Stack>

            {user.role && (
              <Stack horizontal gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Role:
                </Text>
                <Text variant="bodyMd">{user.role}</Text>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
