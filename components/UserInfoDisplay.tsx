"use client";

import { useOrganization, useUser } from "@heymantle/app-bridge-react";
import {
  Badge,
  Card,
  Stack,
  Text,
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
        <Stack gap="2" align="center">
          <Text variant="bodyMd">Loading user information...</Text>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Stack gap="2">
          <Text variant="headingSm" color="critical">
            Authentication Error
          </Text>
          <Text variant="bodyMd" color="critical">
            {error}
          </Text>
        </Stack>
      </Card>
    );
  }

  if (!isAuthenticated || !user || !organization) {
    return (
      <Card>
        <Stack gap="2">
          <Text variant="headingSm" color="subdued">
            Not Authenticated
          </Text>
          <Text variant="bodyMd" color="subdued">
            Please authenticate to view user information.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="6">
      {/* User Information Card */}
      <Card title="User Information" padded>
        <Stack gap="3">
          <Stack horizontal gap="2" align="center">
            <Text variant="headingSm">Current User</Text>
            <Badge status="success">Authenticated</Badge>
          </Stack>

          <Stack gap="2">
            <Stack horizontal gap="2">
              <Text variant="bodyMd" fontWeight="medium">
                Name:
              </Text>
              <Text variant="bodyMd">{user.name || "Not provided"}</Text>
            </Stack>
            <Stack horizontal gap="2">
              <Text variant="bodyMd" fontWeight="medium">
                Email:
              </Text>
              <Text variant="bodyMd">{user.email}</Text>
            </Stack>
            <Stack horizontal gap="2">
              <Text variant="bodyMd" fontWeight="medium">
                User ID:
              </Text>
              <Text variant="bodyMd" as="code">
                {user.id}
              </Text>
            </Stack>
            {user.role && (
              <Stack horizontal gap="2">
                <Text variant="bodyMd" fontWeight="medium">
                  Role:
                </Text>
                <Text variant="bodyMd">{user.role}</Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Organization Information Card */}
      <Card title="Organization Information" padded>
        <Stack gap="2">
          <Stack horizontal gap="2">
            <Text variant="bodyMd" fontWeight="medium">
              Name:
            </Text>
            <Text variant="bodyMd">{organization.name || "Not provided"}</Text>
          </Stack>
          <Stack horizontal gap="2">
            <Text variant="bodyMd" fontWeight="medium">
              Organization ID:
            </Text>
            <Text variant="bodyMd" as="code">
              {organization.id}
            </Text>
          </Stack>
          {organization.customerTags &&
            organization.customerTags.length > 0 && (
              <Stack horizontal gap="2">
                <Text variant="bodyMd" fontWeight="medium">
                  Customer Tags:
                </Text>
                <Stack horizontal gap="1">
                  {organization.customerTags.map((tag, index) => (
                    <Badge key={index} status="info">
                      {tag}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
            )}
          {organization.contactTags && organization.contactTags.length > 0 && (
            <Stack horizontal gap="2">
              <Text variant="bodyMd" fontWeight="medium">
                Contact Tags:
              </Text>
              <Stack horizontal gap="1">
                {organization.contactTags.map((tag, index) => (
                  <Badge key={index} status="info">
                    {tag}
                  </Badge>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
