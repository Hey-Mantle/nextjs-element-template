"use client";

import {
  useSharedAuth,
  useSharedMantleAppBridge,
} from "@heymantle/app-bridge-react";
import {
  Badge,
  Button,
  HorizontalStack,
  Spinner,
  Text,
  VerticalStack,
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
  const appBridge = useSharedMantleAppBridge();
  const { user, isLoading, error, refresh } = useSharedAuth();

  // Get organization ID from app bridge
  const organizationId = appBridge?.currentOrganizationId || null;

  if (!appBridge?.ready) {
    return null;
  }

  return (
    <VerticalStack gap="4">
      {/* Session Section */}
      <VerticalStack gap="3">
        <HorizontalStack gap="3" align="center">
          <Text variant="bodyMd" fontWeight="medium">
            Session:
          </Text>
          {isLoading ? (
            <HorizontalStack gap="2" align="center">
              <Spinner size="small" />
              <Text variant="bodySm">Loading...</Text>
            </HorizontalStack>
          ) : error ? (
            <Badge status="critical">
              <Text variant="bodySm">Error</Text>
            </Badge>
          ) : appBridge?.currentSession ? (
            <Badge status="success">
              <Text variant="bodySm">Active</Text>
            </Badge>
          ) : (
            <Badge status="warning">
              <Text variant="bodySm">No Session</Text>
            </Badge>
          )}
          <Button onClick={refresh} size="small" disabled={isLoading}>
            Refresh
          </Button>
        </HorizontalStack>

        {error && (
          <Text variant="bodyMd" color="critical">
            Session Error: {error}
          </Text>
        )}

        {appBridge?.currentSession && (
          <VerticalStack gap="2">
            {typeof appBridge.currentSession === "string" ? (
              // Handle JWT token string
              <>
                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Session Token:
                  </Text>
                  <Text
                    variant="bodyMd"
                    className="font-mono break-all overflow-wrap-anywhere max-w-full"
                  >
                    {appBridge.currentSession}
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Type:
                  </Text>
                  <Text variant="bodyMd">JWT Token</Text>
                </HorizontalStack>

                {/* Decoded JWT Payload */}
                {(() => {
                  const decodedPayload = decodeJWTPayload(
                    appBridge.currentSession as string
                  );
                  if (decodedPayload) {
                    return (
                      <VerticalStack gap="2">
                        <Text variant="bodyMd" fontWeight="medium">
                          Decoded JWT Payload:
                        </Text>
                        <VerticalStack gap="1">
                          {Object.entries(decodedPayload).map(
                            ([key, value]) => (
                              <HorizontalStack key={key} gap="3" align="start">
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
                              </HorizontalStack>
                            )
                          )}
                        </VerticalStack>
                      </VerticalStack>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              // Handle session object
              <>
                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Session ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(appBridge.currentSession as any).id}
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    User ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(appBridge.currentSession as any).userId}
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Organization ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {(appBridge.currentSession as any).organizationId}
                  </Text>
                </HorizontalStack>

                <HorizontalStack gap="3" align="start">
                  <Text variant="bodyMd" fontWeight="medium">
                    Expires:
                  </Text>
                  <Text variant="bodyMd">
                    {new Date(
                      (appBridge.currentSession as any).expiresAt
                    ).toLocaleString()}
                  </Text>
                </HorizontalStack>
              </>
            )}
          </VerticalStack>
        )}
      </VerticalStack>

      {/* Organization ID Section */}
      <VerticalStack gap="3">
        <HorizontalStack gap="3" align="center">
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
        </HorizontalStack>

        {organizationId && (
          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Current Org ID:
            </Text>
            <Text variant="bodyMd" className="font-mono">
              {organizationId}
            </Text>
          </HorizontalStack>
        )}
      </VerticalStack>

      {/* User Section */}
      <VerticalStack gap="3">
        <HorizontalStack gap="3" align="center">
          <Text variant="bodyMd" fontWeight="medium">
            User:
          </Text>
          {isLoading ? (
            <HorizontalStack gap="2" align="center">
              <Spinner size="small" />
              <Text variant="bodySm">Loading...</Text>
            </HorizontalStack>
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
          <Button onClick={refresh} size="small" disabled={isLoading}>
            Refresh
          </Button>
        </HorizontalStack>

        {error && (
          <Text variant="bodyMd" color="critical">
            User Error: {error}
          </Text>
        )}

        {user && (
          <VerticalStack gap="2">
            <HorizontalStack gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                Name:
              </Text>
              <Text variant="bodyMd">{user.name}</Text>
            </HorizontalStack>

            <HorizontalStack gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                Email:
              </Text>
              <Text variant="bodyMd">{user.email}</Text>
            </HorizontalStack>

            <HorizontalStack gap="3" align="start">
              <Text variant="bodyMd" fontWeight="medium">
                User ID:
              </Text>
              <Text variant="bodyMd" className="font-mono">
                {user.id}
              </Text>
            </HorizontalStack>

            {user.role && (
              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Role:
                </Text>
                <Text variant="bodyMd">{user.role}</Text>
              </HorizontalStack>
            )}
          </VerticalStack>
        )}
      </VerticalStack>
    </VerticalStack>
  );
}
