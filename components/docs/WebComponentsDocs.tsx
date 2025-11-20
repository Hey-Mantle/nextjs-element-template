"use client";
import {
  Card,
  Link,
  Stack,
  Text,
} from "@heymantle/litho";

export default function WebComponentsDocs() {
  return (
    <Stack gap="6">
      {/* Overview */}
      <Card>
        <Stack gap="4">
          <Text variant="headingMd">Overview</Text>
          <Text variant="bodyMd">
            Mantle provides web components that integrate seamlessly with the
            Mantle UI. These components are invisible in your iframe but render
            in the parent Mantle window.
          </Text>
        </Stack>
      </Card>

      {/* Component List */}
      <Card>
        <Stack gap="4">
          <Text variant="headingMd">Available Components</Text>
          <Stack gap="3">
            <Link url="/docs/web-components/modal">
              <Stack horizontal gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  Display modals and dialogs
                </Text>
              </Stack>
            </Link>

            <Link url="/docs/web-components/title-bar">
              <Stack horizontal gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-title-bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  Page title bars with actions
                </Text>
              </Stack>
            </Link>

            <Link url="/docs/web-components/save-bar">
              <Stack horizontal gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-save-bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  Unsaved changes indicator
                </Text>
              </Stack>
            </Link>

            <Link url="/docs/web-components/nav-menu">
              <Stack horizontal gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-nav-menu
                </Text>
                <Text variant="bodySm" color="subdued">
                  Navigation menus
                </Text>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
