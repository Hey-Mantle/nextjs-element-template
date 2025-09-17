"use client";

import AppBridgeSessionUser from "@/components/AppBridgeSessionUser";
import HmacVerificationStatus from "@/components/HmacVerificationStatus";
import {
  Badge,
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionToken: string | null;
  isSessionLoading: boolean;
  sessionError: string | null;
  user: any;
  organization: any;
  isAuthenticated: boolean;
  hmacVerificationStatus?: any;
}

export default function DebugModal({
  isOpen,
  onClose,
  sessionToken,
  isSessionLoading,
  sessionError,
  user,
  organization,
  isAuthenticated,
  hmacVerificationStatus,
}: DebugModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "800px",
          maxHeight: "80vh",
          overflow: "auto",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <VerticalStack gap="4">
          <HorizontalStack gap="2" align="space-between" blockAlign="center">
            <Text variant="headingLg">Debug Information</Text>
            <Button onClick={onClose}>Close</Button>
          </HorizontalStack>

          {/* Session Token Status */}
          <Card title="Session Token Status" padded>
            <VerticalStack gap="2">
              <HorizontalStack gap="2" align="center">
                <Text variant="bodyMd" fontWeight="medium">
                  Status:
                </Text>
                <Badge
                  status={
                    sessionToken
                      ? "success"
                      : sessionError
                      ? "critical"
                      : isSessionLoading
                      ? "warning"
                      : "critical"
                  }
                >
                  {sessionToken
                    ? "Available"
                    : sessionError
                    ? "Error"
                    : isSessionLoading
                    ? "Loading"
                    : "Not Available"}
                </Badge>
              </HorizontalStack>
              {sessionError && (
                <Text variant="bodySm" color="critical">
                  {sessionError}
                </Text>
              )}
            </VerticalStack>
          </Card>

          {/* User Information */}
          <Card title="User Information" padded>
            <VerticalStack gap="2">
              <HorizontalStack gap="2">
                <Text variant="bodyMd" fontWeight="medium">
                  Authenticated:
                </Text>
                <Badge status={isAuthenticated ? "success" : "critical"}>
                  {isAuthenticated ? "Yes" : "No"}
                </Badge>
              </HorizontalStack>
              {user && (
                <VerticalStack gap="1">
                  <Text variant="bodySm">
                    <strong>Name:</strong> {user.name || "Not provided"}
                  </Text>
                  <Text variant="bodySm">
                    <strong>Email:</strong> {user.email}
                  </Text>
                  <Text variant="bodySm">
                    <strong>User ID:</strong> {user.id}
                  </Text>
                  <Text variant="bodySm">
                    <strong>Mantle User ID:</strong> {user.userId}
                  </Text>
                </VerticalStack>
              )}
            </VerticalStack>
          </Card>

          {/* Organization Information */}
          <Card title="Organization Information" padded>
            <VerticalStack gap="2">
              {organization && (
                <VerticalStack gap="1">
                  <Text variant="bodySm">
                    <strong>Name:</strong> {organization.name || "Not provided"}
                  </Text>
                  <Text variant="bodySm">
                    <strong>Organization ID:</strong> {organization.id}
                  </Text>
                  <Text variant="bodySm">
                    <strong>Mantle ID:</strong> {organization.mantleId}
                  </Text>
                  {organization.apiToken && (
                    <Text variant="bodySm">
                      <strong>API Token:</strong>{" "}
                      {organization.apiToken.substring(0, 20)}...
                    </Text>
                  )}
                </VerticalStack>
              )}
            </VerticalStack>
          </Card>

          {/* HMAC Verification Details */}
          {hmacVerificationStatus && (
            <Card title="HMAC Verification Details" padded>
              <HmacVerificationStatus {...hmacVerificationStatus} />
            </Card>
          )}

          {/* Session Token Details */}
          <Card title="Session Token Details" padded>
            <AppBridgeSessionUser />
          </Card>
        </VerticalStack>
      </div>
    </div>
  );
}
