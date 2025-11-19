"use client";
import {
  useAppBridge,
  useOrganization,
  useUser,
} from "@heymantle/app-bridge-react";
import {
  Card,
  HorizontalStack,
  Link,
  Text,
  VerticalStack,
} from "@heymantle/litho";

export default function DashboardContent() {
  const { mantle, isReady } = useAppBridge();
  const { user, isLoading: userLoading } = useUser();
  const { organization, isLoading: orgLoading } = useOrganization();
  // Get session token directly from mantle instance
  const sessionToken = mantle?.currentSession || null;

  if (!isReady || userLoading || orgLoading) {
    return (
      <Card>
        <Text>Loading...</Text>
      </Card>
    );
  }

  return (
    <VerticalStack gap="6">
      {/* User and Organization Info */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Session Information</Text>
          <VerticalStack gap="2">
            <HorizontalStack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                User:
              </Text>
              <Text variant="bodyMd">
                {user?.name || "Unknown"} ({user?.email || "No email"})
              </Text>
            </HorizontalStack>
            <HorizontalStack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                Organization:
              </Text>
              <Text variant="bodyMd">
                {organization?.name || "Unknown"} (ID:{" "}
                {organization?.id || "N/A"})
              </Text>
            </HorizontalStack>
            {sessionToken && (
              <VerticalStack gap="1">
                <Text variant="bodyMd" fontWeight="semibold">
                  Session Token:
                </Text>
                <Text variant="bodySm" color="subdued">
                  {typeof sessionToken === "string"
                    ? `${sessionToken.substring(0, 50)}...`
                    : "Session available"}
                </Text>
              </VerticalStack>
            )}
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Documentation Sections */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Documentation</Text>
          <VerticalStack gap="3">
            <Link url="/docs/authentication">
              <Text variant="bodyMd">Authentication</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              Client-side authenticatedFetch, server-side requests, and
              background job token exchange
            </Text>

            <Link url="/docs/web-components">
              <Text variant="bodyMd">Web Components</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              ui-modal, ui-title-bar, ui-save-bar, ui-nav-menu and more
            </Text>

            <Link url="/docs/navigation">
              <Text variant="bodyMd">Navigation</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              Navigation API, anchor tags, and useRouter integration
            </Text>

            <Link url="/docs/toasts">
              <Text variant="bodyMd">Toast Notifications</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              Show success and error messages to users
            </Text>

            <Link url="/docs/ui-hooks">
              <Text variant="bodyMd">UI Hooks & Custom Data</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              Extend Mantle pages with custom actions and data
            </Text>

            <Link url="/docs/api-reference">
              <Text variant="bodyMd">API Reference</Text>
            </Link>
            <Text variant="bodySm" color="subdued">
              Complete reference for all App Bridge methods
            </Text>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
