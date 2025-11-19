"use client";
import { useOrganization, useUser } from "@heymantle/app-bridge-react";
import { HorizontalStack, Link, Text, VerticalStack } from "@heymantle/litho";

export default function PageHeader() {
  // Get user and organization data directly from App Bridge
  const { user } = useUser();
  const { organization } = useOrganization();

  return (
    <HorizontalStack gap="4" align="space-between" blockAlign="center">
      <VerticalStack gap="1">
        <Link url="/">
          <Text variant="headingLg">Mantle Element Documentation</Text>
        </Link>
        <Text variant="bodyMd" color="subdued">
          Live documentation and examples for Mantle Elements
        </Text>
      </VerticalStack>

      <HorizontalStack gap="4" align="center">
        {user && (
          <Text variant="bodySm" color="subdued">
            {user.name}
          </Text>
        )}
        {organization && (
          <Text variant="bodySm" color="subdued">
            {organization.name}
          </Text>
        )}
      </HorizontalStack>
    </HorizontalStack>
  );
}
