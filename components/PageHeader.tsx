"use client";

import { useEmbeddedAuth } from "@/lib/embedded-auth-context";
import { useHmac } from "@/lib/hmac-context";
import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { Button, HorizontalStack, Text, VerticalStack } from "@heymantle/litho";
import { useState } from "react";
import DebugModal from "./DebugModal";

export default function PageHeader() {
  const { user, organization, isAuthenticated } = useEmbeddedAuth();
  const { session, isSessionLoading, sessionError } =
    useSharedMantleAppBridge();
  const { hmacVerificationStatus } = useHmac();
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  // Extract session token from session
  const sessionToken =
    session && typeof session === "object" && "accessToken" in session
      ? (session as any).accessToken
      : typeof session === "string"
      ? session
      : null;

  return (
    <>
      <HorizontalStack gap="4" align="space-between" blockAlign="center">
        <VerticalStack gap="1">
          <Text variant="headingLg">Customer Management</Text>
          <Text variant="bodySm" color="subdued">
            Manage your customers and view analytics
          </Text>
        </VerticalStack>

        <HorizontalStack gap="3" align="center">
          {/* User Info */}
          {isAuthenticated && user && organization && (
            <HorizontalStack gap="2" align="center">
              <VerticalStack gap="0" align="end">
                <Text variant="bodyMd" fontWeight="medium">
                  {user.name || user.email}
                </Text>
                <Text variant="bodySm" color="subdued">
                  {organization.name}
                </Text>
              </VerticalStack>
              {/* Simple avatar placeholder using initials */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#0070f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            </HorizontalStack>
          )}

          {/* Debug Menu Button */}
          <Button onClick={() => setIsDebugModalOpen(true)}>Debug Info</Button>
        </HorizontalStack>
      </HorizontalStack>

      {/* Debug Modal */}
      <DebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        sessionToken={sessionToken}
        isSessionLoading={isSessionLoading}
        sessionError={sessionError}
        user={user}
        organization={organization}
        isAuthenticated={isAuthenticated}
        hmacVerificationStatus={hmacVerificationStatus}
      />
    </>
  );
}
