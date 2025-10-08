"use client";

import { useOrganization, useUser } from "@heymantle/app-bridge-react";
import {
  Badge,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";

/**
 * Component that displays the current authenticated user and organization information
 * using the App Bridge hooks directly
 */
export default function UserInfoDisplay() {
  // Get user and organization data directly from App Bridge
  const { user, isLoading: userLoading, error: userError } = useUser();
  const {
    organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganization();

  const isLoading = userLoading || orgLoading;
  const error = userError || orgError;
  const isAuthenticated = !!(user && organization);

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
    <VerticalStack gap="6">
      {/* User Information Card */}
      <Card title="User Information" padded>
        <VerticalStack gap="3">
          <HorizontalStack gap="2" align="center">
            <Text variant="headingSm">Current User</Text>
            <Badge status="success">Authenticated</Badge>
          </HorizontalStack>

          <VerticalStack gap="2">
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
              <Text variant="bodyMd" as="code">
                {user.id}
              </Text>
            </HorizontalStack>
            {user.role && (
              <HorizontalStack gap="2">
                <Text variant="bodyMd" fontWeight="medium">
                  Role:
                </Text>
                <Text variant="bodyMd">{user.role}</Text>
              </HorizontalStack>
            )}
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Organization Information Card */}
      <Card title="Organization Information" padded>
        <VerticalStack gap="2">
          <HorizontalStack gap="2">
            <Text variant="bodyMd" fontWeight="medium">
              Name:
            </Text>
            <Text variant="bodyMd">{organization.name || "Not provided"}</Text>
          </HorizontalStack>
          <HorizontalStack gap="2">
            <Text variant="bodyMd" fontWeight="medium">
              Organization ID:
            </Text>
            <Text variant="bodyMd" as="code">
              {organization.id}
            </Text>
          </HorizontalStack>
          {organization.customerTags &&
            organization.customerTags.length > 0 && (
              <HorizontalStack gap="2">
                <Text variant="bodyMd" fontWeight="medium">
                  Customer Tags:
                </Text>
                <HorizontalStack gap="1">
                  {organization.customerTags.map((tag, index) => (
                    <Badge key={index} status="info">
                      {tag}
                    </Badge>
                  ))}
                </HorizontalStack>
              </HorizontalStack>
            )}
          {organization.contactTags && organization.contactTags.length > 0 && (
            <HorizontalStack gap="2">
              <Text variant="bodyMd" fontWeight="medium">
                Contact Tags:
              </Text>
              <HorizontalStack gap="1">
                {organization.contactTags.map((tag, index) => (
                  <Badge key={index} status="info">
                    {tag}
                  </Badge>
                ))}
              </HorizontalStack>
            </HorizontalStack>
          )}
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
