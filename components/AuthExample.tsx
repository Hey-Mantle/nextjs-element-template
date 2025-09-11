"use client";

import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { signOut, useSession } from "next-auth/react";

export default function AuthExample() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card>
        <VerticalStack gap="3">
          <Text variant="bodyLg">Loading session...</Text>
        </VerticalStack>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <VerticalStack gap="3">
          <Text variant="bodyLg" color="warning">
            Not authenticated. Please sign in.
          </Text>
        </VerticalStack>
      </Card>
    );
  }

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Authentication Status</Text>

        <VerticalStack gap="3">
          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Name:
            </Text>
            <Text variant="bodyMd">{session.user.id}</Text>
          </HorizontalStack>

          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Email:
            </Text>
            <Text variant="bodyMd">{session.user.email}</Text>
          </HorizontalStack>

          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Mantle ID:
            </Text>
            <Text variant="bodyMd">{session.user.id}</Text>
          </HorizontalStack>

          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Organization ID:
            </Text>
            <Text variant="bodyMd">{session.organization.id}</Text>
          </HorizontalStack>

          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Organization Name:
            </Text>
            <Text variant="bodyMd">{session.organization.name}</Text>
          </HorizontalStack>

          <HorizontalStack gap="3" align="start">
            <Text variant="bodyMd" fontWeight="medium">
              Has Access Token:
            </Text>
            <Text
              variant="bodyMd"
              color={session.accessToken ? "success" : "critical"}
            >
              {session.accessToken ? "Yes" : "No"}
            </Text>
          </HorizontalStack>
        </VerticalStack>

        <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
      </VerticalStack>
    </Card>
  );
}
