"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useAppBridge } from "@heymantle/app-bridge-react";
import { Card, Stack, Text, TextField } from "@heymantle/litho";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { mantle } = useAppBridge();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(
    () => organization?.name || ""
  );
  const hasChanges = displayName !== (organization?.name || "");

  const handleSave = () => {
    (mantle as any)?.showToast("Settings saved", "success");
    // In a real app, persist the change here
  };

  const handleDiscard = () => {
    setDisplayName(organization?.name || "");
  };

  return (
    <Stack gap="4">
      <ui-title-bar
        title="General Settings"
        backAction={() => router.push("/")}
      />

      <Card>
        <Card.Section>
          <Stack gap="3">
            <Text variant="headingSm" fontWeight="semibold">
              Display Name
            </Text>
            <Text variant="bodySm" color="subdued">
              Edit the field below to see the &lt;ui-save-bar&gt; appear. It
              shows when there are unsaved changes and provides Save / Discard
              actions.
            </Text>
            <TextField
              label="Organization display name"
              value={displayName}
              onChange={setDisplayName}
            />
          </Stack>
        </Card.Section>
      </Card>

      <Card>
        <Card.Section>
          <Stack gap="3">
            <Text variant="headingSm" fontWeight="semibold">
              User Details
            </Text>
            {user && (
              <Stack gap="1">
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Name
                  </Text>
                  <Text variant="bodyMd">{user.name || "Not set"}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Email
                  </Text>
                  <Text variant="bodyMd">{user.email}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    User ID
                  </Text>
                  <Text variant="bodyMd">{user.userId || "N/A"}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Internal ID
                  </Text>
                  <Text variant="bodyMd">{user.id}</Text>
                </div>
              </Stack>
            )}
          </Stack>
        </Card.Section>
      </Card>

      <Card>
        <Card.Section>
          <Stack gap="3">
            <Text variant="headingSm" fontWeight="semibold">
              Organization Details
            </Text>
            {organization && (
              <Stack gap="1">
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Name
                  </Text>
                  <Text variant="bodyMd">{organization.name}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Mantle ID
                  </Text>
                  <Text variant="bodyMd">{organization.mantleId}</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Internal ID
                  </Text>
                  <Text variant="bodyMd">{organization.id}</Text>
                </div>
              </Stack>
            )}
          </Stack>
        </Card.Section>
      </Card>

      <Card>
        <Card.Section>
          <Stack gap="2">
            <Text variant="headingSm" fontWeight="semibold">
              About Contexts
            </Text>
            <Text variant="bodyMd" color="subdued">
              User and Organization data is provided by UserContext and
              OrganizationContext. These are populated during session sync in
              MantleProviderWrapper. Access them anywhere with useUser() and
              useOrganization().
            </Text>
          </Stack>
        </Card.Section>
      </Card>

      <ui-save-bar
        id="general-save-bar"
        message="You have unsaved changes"
        visible={hasChanges}
      >
        <button data-variant="primary" onClick={handleSave}>
          Save
        </button>
        <button onClick={handleDiscard}>Discard</button>
      </ui-save-bar>
    </Stack>
  );
}
