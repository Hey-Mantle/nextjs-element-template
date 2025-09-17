"use client";
import AppBridgeSessionUser from "@/components/AppBridgeSessionUser";
import { Card, HorizontalStack, Text, VerticalStack } from "@heymantle/litho";

interface DebugModalProps {
  // sessionToken: string | null;
  // isSessionLoading: boolean;
  // sessionError: string | null;
  user: any;
  organization: any;
  // isAuthenticated: boolean;
  // hmacVerificationStatus?: any;
}

export function DebugModalContent({
  // sessionToken,
  // isSessionLoading,
  // sessionError,
  user,
  organization,
}: // isAuthenticated,
// hmacVerificationStatus,
DebugModalProps) {
  return (
    <VerticalStack gap="4">
      <HorizontalStack gap="2" align="space-between" blockAlign="center">
        <Text variant="headingLg">Debug Information!</Text>
      </HorizontalStack>

      {/* Session Token Status */}
      {/* <Card title="Session Token Status" padded>
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
      </Card> */}

      {/* User Information */}
      <Card title="User Information" padded>
        <VerticalStack gap="2">
          <HorizontalStack gap="2">
            <Text variant="bodyMd" fontWeight="medium">
              Authenticated:
            </Text>
            {/* <Badge status={isAuthenticated ? "success" : "critical"}>
              {isAuthenticated ? "Yes" : "No"}
            </Badge> */}
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
      {/* {hmacVerificationStatus && (
        <Card title="HMAC Verification Details" padded>
          <HmacVerificationStatus {...hmacVerificationStatus} />
        </Card>
      )} */}

      {/* Session Token Details */}
      <Card title="Session Token Details" padded>
        <AppBridgeSessionUser />
      </Card>
    </VerticalStack>
  );
}
