"use client";

import { useMantleAppBridge } from "@/lib/use-mantle-app-bridge";
import {
  Badge,
  Button,
  Card,
  HorizontalStack,
  Spinner,
  Text,
  VerticalStack,
} from "@heymantle/litho";

export default function AppBridgeSessionUser() {
  const {
    isConnected,
    session,
    isSessionLoading,
    sessionError,
    user,
    isUserLoading,
    userError,
    refreshSession,
    refreshUser,
  } = useMantleAppBridge();

  if (!isConnected) {
    return null;
  }

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Session & User</Text>

        {/* Session Section */}
        <VerticalStack gap="3">
          <HorizontalStack gap="3" align="center">
            <Text variant="bodyMd" fontWeight="medium">
              Session:
            </Text>
            {isSessionLoading ? (
              <HorizontalStack gap="2" align="center">
                <Spinner size="small" />
                <Text variant="bodySm">Loading...</Text>
              </HorizontalStack>
            ) : sessionError ? (
              <Badge status="critical">
                <Text variant="bodySm">Error</Text>
              </Badge>
            ) : session ? (
              <Badge status="success">
                <Text variant="bodySm">Active</Text>
              </Badge>
            ) : (
              <Badge status="warning">
                <Text variant="bodySm">No Session</Text>
              </Badge>
            )}
            <Button
              onClick={refreshSession}
              size="small"
              disabled={isSessionLoading}
            >
              Refresh
            </Button>
          </HorizontalStack>

          {sessionError && (
            <Text variant="bodyMd" color="critical">
              Session Error: {sessionError}
            </Text>
          )}

          {session && (
            <VerticalStack gap="2">
              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Session ID:
                </Text>
                <Text variant="bodyMd" className="font-mono">
                  {session.id}
                </Text>
              </HorizontalStack>

              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  User ID:
                </Text>
                <Text variant="bodyMd" className="font-mono">
                  {session.userId}
                </Text>
              </HorizontalStack>

              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Organization ID:
                </Text>
                <Text variant="bodyMd" className="font-mono">
                  {session.organizationId}
                </Text>
              </HorizontalStack>

              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Expires:
                </Text>
                <Text variant="bodyMd">
                  {new Date(session.expiresAt).toLocaleString()}
                </Text>
              </HorizontalStack>
            </VerticalStack>
          )}
        </VerticalStack>

        {/* User Section */}
        <VerticalStack gap="3">
          <HorizontalStack gap="3" align="center">
            <Text variant="bodyMd" fontWeight="medium">
              User:
            </Text>
            {isUserLoading ? (
              <HorizontalStack gap="2" align="center">
                <Spinner size="small" />
                <Text variant="bodySm">Loading...</Text>
              </HorizontalStack>
            ) : userError ? (
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
            <Button onClick={refreshUser} size="small" disabled={isUserLoading}>
              Refresh
            </Button>
          </HorizontalStack>

          {userError && (
            <Text variant="bodyMd" color="critical">
              User Error: {userError}
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

              <HorizontalStack gap="3" align="start">
                <Text variant="bodyMd" fontWeight="medium">
                  Organization:
                </Text>
                <Text variant="bodyMd">{user.organizationName}</Text>
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
    </Card>
  );
}
