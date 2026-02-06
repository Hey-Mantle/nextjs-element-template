"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import {
  Badge,
  Button,
  Card,
  Grid,
  SkeletonText,
  Stack,
  Text,
} from "@heymantle/litho";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const { organization } = useOrganization();
  const { data: customersData, isLoading: customersLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL}/customers?take=5`
  );
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pt-4">
      <Stack gap="4">
        <ui-title-bar title="Mantle Element Starter">
          <button
            onClick={() => {
              router.push("/settings");
            }}
          >
            Settings
          </button>
        </ui-title-bar>

        <Card>
          <Card.Section>
            <Stack gap="3">
              <Text variant="headingMd" fontWeight="bold">
                Welcome to your Mantle Element
              </Text>
              <Text variant="bodyMd" color="subdued">
                This is a live document template. Every card below is functional
                &mdash; pulling real data from your authenticated session. Use
                this as a starting point, then replace these sections with your
                own features.
              </Text>
            </Stack>
          </Card.Section>
        </Card>

        <Grid columns={2}>
          <Card>
            <Card.Section>
              <Stack gap="2">
                <Text variant="headingSm" fontWeight="semibold">
                  Current User
                </Text>
                {user ? (
                  <Stack gap="1">
                    <div className="flex items-center gap-2">
                      <Text variant="bodyMd">{user.name || "No name"}</Text>
                      <Badge>{user.email}</Badge>
                    </div>
                    <Text variant="bodySm" color="subdued">
                      ID: {user.id}
                    </Text>
                    {user.userId && (
                      <Text variant="bodySm" color="subdued">
                        Mantle User ID: {user.userId}
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <SkeletonText lines={3} />
                )}
              </Stack>
            </Card.Section>
          </Card>

          <Card>
            <Card.Section>
              <Stack gap="2">
                <Text variant="headingSm" fontWeight="semibold">
                  Organization
                </Text>
                {organization ? (
                  <Stack gap="1">
                    <div className="flex items-center gap-2">
                      <Text variant="bodyMd">{organization.name}</Text>
                      <Badge>{organization.mantleId}</Badge>
                    </div>
                    <Text variant="bodySm" color="subdued">
                      Access Token:{" "}
                      {organization.accessToken
                        ? `${organization.accessToken.substring(0, 12)}...`
                        : "None"}
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      API Token:{" "}
                      {organization.apiToken
                        ? `${organization.apiToken.substring(0, 12)}...`
                        : "None"}
                    </Text>
                  </Stack>
                ) : (
                  <SkeletonText lines={3} />
                )}
              </Stack>
            </Card.Section>
          </Card>
        </Grid>

        <Card>
          <Card.Section>
            <Stack gap="2">
              <Text variant="headingSm" fontWeight="semibold">
                Customers
              </Text>
              <Text variant="bodySm" color="subdued">
                Fetched via useSWR with the Core API URL using
                authenticatedFetch
              </Text>
            </Stack>
          </Card.Section>
          <Card.Section>
            {customersLoading ? (
              <SkeletonText lines={5} />
            ) : customersData?.customers?.length > 0 ? (
              <Stack gap="2">
                {customersData.customers.map((customer: any) => (
                  <a
                    href={`mantle://customers/${customer.id}`}
                    key={customer.id}
                    className="text-link"
                  >
                    {customer.name || customer.email}
                  </a>
                ))}
              </Stack>
            ) : (
              <Text variant="bodyMd" color="subdued">
                No customers found. Customers will appear here once your
                organization has been identified with Mantle.
              </Text>
            )}
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack gap="2">
              <Text variant="headingSm" fontWeight="semibold">
                Modal Example
              </Text>
              <Text variant="bodySm" color="subdued">
                Opens a &lt;ui-modal&gt; with src pointing to the /modal-example
                route. The modal auto-sizes to content, has its own
                ui-title-bar, and demonstrates showToast and closeModal.
              </Text>
              <div>
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
              </div>
            </Stack>
          </Card.Section>
        </Card>

        <ui-modal
          id="example-modal"
          open={showModal}
          onClose={() => setShowModal(false)}
          {...({ src: "/modal-example" } as any)}
        />

        <Card>
          <Card.Section>
            <Stack gap="3">
              <Text variant="headingSm" fontWeight="semibold">
                How This Works
              </Text>
              <Stack gap="2">
                <Text variant="bodyMd">
                  <strong>1. Session Sync</strong> &mdash; On load,
                  MantleProviderWrapper calls POST /api/sync-session with your
                  authenticated session token. This creates/updates User and
                  Organization records in the local database.
                </Text>
                <Text variant="bodyMd">
                  <strong>2. Token Exchange</strong> &mdash; The session token
                  (JWT) is exchanged for a long-lived offline access token via
                  RFC 8693 token exchange. This access token is stored on the
                  Organization and used for Core API calls.
                </Text>
                <Text variant="bodyMd">
                  <strong>3. SWR Data Fetching</strong> &mdash;
                  SWRConfigProvider wraps the app with authenticatedFetch as the
                  default fetcher. Use useSWR with the Core API URL and it
                  automatically includes auth headers.
                </Text>
                <Text variant="bodyMd">
                  <strong>4. Web Components</strong> &mdash; Use
                  &lt;ui-title-bar&gt; for page headers, &lt;ui-modal&gt; for
                  dialogs, &lt;ui-save-bar&gt; for unsaved changes, and
                  &lt;ui-nav-menu&gt; for navigation. See the Settings page for
                  a ui-save-bar example.
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Stack>
    </div>
  );
}
