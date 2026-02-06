"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useAuthenticatedMutation } from "@/hooks/useAuthenticatedMutation";
import { useAppBridge } from "@heymantle/app-bridge-react";
import { Badge, Button, Card, Stack, Text } from "@heymantle/litho";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TokensSettingsPage() {
  const { organization } = useOrganization();
  const { mantle } = useAppBridge();
  const { mutate } = useAuthenticatedMutation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const result = await mutate("/api/organization/refresh-access-token", {
        method: "POST",
      });
      if (result.success) {
        (mantle as any)?.showToast("Token refreshed successfully", "success");
      } else {
        (mantle as any)?.showToast("Refresh failed", "error");
      }
    } catch (err: any) {
      (mantle as any)?.showToast(`Error: ${err.message}`, "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Stack gap="4">
      <ui-title-bar
        title="Token Management"
        backAction={() => router.push("/")}
      />

      <Card>
        <Card.Section>
          <Stack gap="3">
            <Text variant="headingSm" fontWeight="semibold">
              Current Token Status
            </Text>
            {organization && (
              <Stack gap="1">
                <div className="flex items-center justify-between">
                  <Text variant="bodyMd" color="subdued">
                    Access Token
                  </Text>
                  <Badge
                    status={organization.accessToken ? "success" : "warning"}
                  >
                    {organization.accessToken ? "Present" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Text variant="bodyMd" color="subdued">
                    API Token
                  </Text>
                  <Badge status={organization.apiToken ? "success" : "warning"}>
                    {organization.apiToken ? "Present" : "Missing"}
                  </Badge>
                </div>
              </Stack>
            )}
          </Stack>
        </Card.Section>
        <Card.Section>
          <Button onClick={handleRefreshToken} loading={isRefreshing} primary>
            Refresh Token
          </Button>
        </Card.Section>
      </Card>

      <Card>
        <Card.Section>
          <Stack gap="2">
            <Text variant="headingSm" fontWeight="semibold">
              Token Lifecycle
            </Text>
            <Stack gap="2">
              <Text variant="bodyMd" color="subdued">
                <strong>Session Token</strong> &mdash; Short-lived JWT provided
                by App Bridge on each page load. Automatically included in
                authenticatedFetch requests.
              </Text>
              <Text variant="bodyMd" color="subdued">
                <strong>Token Exchange</strong> &mdash; During sync-session, the
                session token is exchanged for a long-lived offline access token
                via RFC 8693. This is stored on the Organization record.
              </Text>
              <Text variant="bodyMd" color="subdued">
                <strong>Refresh</strong> &mdash; When the access token nears
                expiry, call the refresh endpoint to exchange the current
                session token for a new access token. The &quot;Refresh
                Token&quot; button above demonstrates this using
                useAuthenticatedMutation.
              </Text>
            </Stack>
          </Stack>
        </Card.Section>
      </Card>
    </Stack>
  );
}
