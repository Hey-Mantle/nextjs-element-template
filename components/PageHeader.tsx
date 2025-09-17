"use client";
import { useEmbeddedAuth } from "@/lib/embedded-auth-context";
import { Button, HorizontalStack, Text, VerticalStack } from "@heymantle/litho";
import { useState } from "react";
import UserInfoDisplay from "./UserInfoDisplay";

export default function PageHeader() {
  const { user, organization } = useEmbeddedAuth();
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  return (
    <>
      <HorizontalStack gap="4" align="space-between" blockAlign="center">
        <VerticalStack gap="1">
          <Text variant="headingLg">Mantle Element Starter</Text>
          <Text variant="bodyMd" color="subdued">
            A Next.js starter template for Mantle Elements using Litho UI
          </Text>
        </VerticalStack>

        <HorizontalStack gap="4" align="center">
          <Button onClick={() => setIsDebugModalOpen(true)}>User Info</Button>
        </HorizontalStack>
      </HorizontalStack>

      <ui-modal
        title="Debug Information"
        size="large"
        open={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
      >
        <UserInfoDisplay />
      </ui-modal>
    </>
  );
}
