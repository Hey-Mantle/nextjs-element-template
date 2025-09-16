"use client";

import { useEmbeddedAuth } from "@/lib/embedded-auth-context";
import {
  Badge,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";

/**
 * Component that displays the current authenticated user and organization information
 * using the embedded auth context
 */
export default function UserInfoDisplay() {
  const { user, organization, isAuthenticated, isLoading, error } =
    useEmbeddedAuth();

  if (isLoading) {
    return (
      <Card>
        <VerticalStack gap="2" align="center">
          <Text variant="bodyMd">Loading user information...</Text>
        </VerticalStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <VerticalStack gap="2">
          <Text variant="headingSm" color="critical">
            Authentication Error
          </Text>
          <Text variant="bodyMd" color="critical">
            {error}
          </Text>
        </VerticalStack>
      </Card>
    );
  }

  if (!isAuthenticated || !user || !organization) {
    return (
      <Card>
        <VerticalStack gap="2">
          <Text variant="headingSm" color="subdued">
            Not Authenticated
          </Text>
          <Text variant="bodyMd" color="subdued">
            Please authenticate to view user information.
          </Text>
        </VerticalStack>
      </Card>
    );
  }

  return (
    <Card>
      <VerticalStack gap="4">
        <VerticalStack gap="2">
          <HorizontalStack gap="2" align="center">
            <Text variant="headingMd">Current User</Text>
            <Badge status="success">Authenticated</Badge>
          </HorizontalStack>

          <VerticalStack gap="3">
            {/* User Information */}
            <VerticalStack gap="2">
              <Text variant="headingSm">User Information</Text>
              <VerticalStack gap="1">
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Name:
                  </Text>
                  <Text variant="bodyMd">{user.name || "Not provided"}</Text>
                </HorizontalStack>
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Email:
                  </Text>
                  <Text variant="bodyMd">{user.email}</Text>
                </HorizontalStack>
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    User ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {user.id}
                  </Text>
                </HorizontalStack>
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Mantle User ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {user.userId}
                  </Text>
                </HorizontalStack>
                {user.emailVerified && (
                  <HorizontalStack gap="2">
                    <Text variant="bodyMd" fontWeight="medium">
                      Email Verified:
                    </Text>
                    <Badge status="success">Verified</Badge>
                  </HorizontalStack>
                )}
              </VerticalStack>
            </VerticalStack>

            {/* Organization Information */}
            <VerticalStack gap="2">
              <Text variant="headingSm">Organization Information</Text>
              <VerticalStack gap="1">
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Name:
                  </Text>
                  <Text variant="bodyMd">
                    {organization.name || "Not provided"}
                  </Text>
                </HorizontalStack>
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Organization ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {organization.id}
                  </Text>
                </HorizontalStack>
                <HorizontalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium">
                    Mantle ID:
                  </Text>
                  <Text variant="bodyMd" className="font-mono">
                    {organization.mantleId}
                  </Text>
                </HorizontalStack>
                {organization.apiToken && (
                  <HorizontalStack gap="2">
                    <Text variant="bodyMd" fontWeight="medium">
                      API Token:
                    </Text>
                    <Text variant="bodyMd" className="font-mono">
                      {organization.apiToken.substring(0, 20)}...
                    </Text>
                  </HorizontalStack>
                )}
              </VerticalStack>
            </VerticalStack>
          </VerticalStack>
        </VerticalStack>
      </VerticalStack>
    </Card>
  );
}
