"use client";

import {
  Badge,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";

interface HmacVerificationStatusProps {
  isVerified: boolean;
  hasHmac: boolean;
  isHmacValid?: boolean;
  isTimestampValid?: boolean;
  timestampAge?: number;
  errorMessage?: string;
  requestParams?: Record<string, string>;
}

export default function HmacVerificationStatus({
  isVerified,
  hasHmac,
  isHmacValid,
  isTimestampValid,
  timestampAge,
  errorMessage,
  requestParams,
}: HmacVerificationStatusProps) {
  const getStatusColor = () => {
    if (!hasHmac) return "subdued";
    if (isVerified) return "success";
    // Special case: valid HMAC but expired timestamp (for development/testing)
    if (isHmacValid && !isTimestampValid) return "warning";
    return "critical";
  };

  const getStatusText = () => {
    if (!hasHmac) return "No HMAC parameter - Direct access";
    if (isVerified) return "HMAC verified - Valid Mantle request";
    // Special case: valid HMAC but expired timestamp
    if (isHmacValid && !isTimestampValid)
      return "HMAC valid but timestamp expired (dev/testing)";
    return "HMAC verification failed";
  };

  const getStatusIcon = () => {
    if (!hasHmac) return "⚠️";
    if (isVerified) return "✅";
    // Special case: valid HMAC but expired timestamp
    if (isHmacValid && !isTimestampValid) return "⏰";
    return "❌";
  };

  const formatTimestampAge = (ageMs: number) => {
    const minutes = Math.floor(ageMs / 60000);
    const seconds = Math.floor((ageMs % 60000) / 1000);
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <VerticalStack gap="3">
      <HorizontalStack gap="3" align="center">
        <Text variant="bodyMd" fontWeight="medium">
          Status:
        </Text>
        <Text variant="bodyLg">{getStatusIcon()}</Text>
        <Text variant="bodyMd" color={getStatusColor()}>
          {getStatusText()}
        </Text>
      </HorizontalStack>

      {/* Detailed verification breakdown - only show if we have HMAC */}
      {hasHmac &&
        (isHmacValid !== undefined || isTimestampValid !== undefined) && (
          <VerticalStack gap="2">
            <Text variant="bodySm" fontWeight="medium">
              Verification Details:
            </Text>
            <HorizontalStack gap="3" align="center">
              <Text variant="bodySm" fontWeight="medium">
                HMAC:
              </Text>
              <Badge status={isHmacValid ? "success" : "critical"}>
                <Text variant="bodySm">
                  {isHmacValid ? "Valid" : "Invalid"}
                </Text>
              </Badge>
            </HorizontalStack>
            <HorizontalStack gap="3" align="center">
              <Text variant="bodySm" fontWeight="medium">
                Timestamp:
              </Text>
              <Badge status={isTimestampValid ? "success" : "warning"}>
                <Text variant="bodySm">
                  {isTimestampValid ? "Valid" : "Expired"}
                </Text>
              </Badge>
              {timestampAge !== undefined && (
                <Text variant="bodySm" color="subdued">
                  ({formatTimestampAge(timestampAge)} old)
                </Text>
              )}
            </HorizontalStack>
          </VerticalStack>
        )}

      {errorMessage && (
        <Text variant="bodySm" color="critical">
          Error: {errorMessage}
        </Text>
      )}

      {requestParams && Object.keys(requestParams).length > 0 && (
        <VerticalStack gap="2">
          <Text variant="bodySm" fontWeight="medium">
            Request Parameters:
          </Text>
          <Card>
            <VerticalStack gap="1">
              {Object.entries(requestParams).map(([key, value]) => (
                <HorizontalStack key={key} gap="2">
                  <Text variant="bodySm" color="link" className="font-mono">
                    {key}:
                  </Text>
                  <Text variant="bodySm" className="font-mono">
                    {value}
                  </Text>
                </HorizontalStack>
              ))}
            </VerticalStack>
          </Card>
        </VerticalStack>
      )}
    </VerticalStack>
  );
}
