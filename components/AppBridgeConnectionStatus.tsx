"use client";

import { isRunningInIframe } from "@/lib/mantle-app-bridge";
import { useMantleAppBridge } from "@/lib/use-mantle-app-bridge";
import {
  Badge,
  Card,
  HorizontalStack,
  Spinner,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { useEffect, useState } from "react";

export default function AppBridgeConnectionStatus() {
  const { isConnected, isConnecting, connectionError, connect } =
    useMantleAppBridge();

  const [isInIframe, setIsInIframe] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsInIframe(isRunningInIframe());
    setIsMounted(true);
  }, []);

  const getConnectionStatus = () => {
    if (isConnecting) {
      return {
        text: "Connecting...",
        color: "info" as const,
        icon: <Spinner size="small" />,
      };
    }

    if (connectionError) {
      return {
        text: "Connection Error",
        color: "critical" as const,
        icon: null,
      };
    }

    if (isConnected) {
      return {
        text: "Connected",
        color: "success" as const,
        icon: null,
      };
    }

    return {
      text: "Connecting...",
      color: "warning" as const,
      icon: null,
    };
  };

  const status = getConnectionStatus();

  // Prevent hydration mismatch by not rendering iframe-dependent content until mounted
  if (!isMounted) {
    return (
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Environment Detection</Text>
          <VerticalStack gap="3">
            <HorizontalStack gap="3" align="center">
              <Text variant="bodyMd" fontWeight="medium">
                Iframe Status:
              </Text>
              <Badge status="info">
                <Text variant="bodySm">Detecting...</Text>
              </Badge>
            </HorizontalStack>
            <Text variant="bodyMd" color="subdued">
              Detecting environment...
            </Text>
          </VerticalStack>
        </VerticalStack>
      </Card>
    );
  }

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Environment Detection</Text>

        <VerticalStack gap="3">
          {/* Iframe Detection */}
          <HorizontalStack gap="3" align="center">
            <Text variant="bodyMd" fontWeight="medium">
              Iframe Status:
            </Text>
            <Badge status={isInIframe ? "success" : "warning"}>
              <Text variant="bodySm">
                {isInIframe ? "Running in iframe" : "Not in iframe"}
              </Text>
            </Badge>
          </HorizontalStack>

          <Text variant="bodyMd" color="subdued">
            {isInIframe
              ? "App is embedded in an iframe. App Bridge should be available."
              : "App is running standalone. App Bridge will not be available."}
          </Text>

          {/* App Bridge Connection Status - Only show if in iframe */}
          {isInIframe && (
            <>
              <HorizontalStack gap="3" align="center">
                <Text variant="bodyMd" fontWeight="medium">
                  App Bridge Status:
                </Text>
                <Badge status={status.color}>
                  <HorizontalStack gap="2" align="center">
                    {status.icon}
                    <Text variant="bodySm">{status.text}</Text>
                  </HorizontalStack>
                </Badge>
              </HorizontalStack>

              {connectionError && (
                <VerticalStack gap="2">
                  <Text variant="bodyMd" fontWeight="medium" color="critical">
                    Connection Error:
                  </Text>
                  <Text variant="bodyMd" color="critical">
                    {connectionError}
                  </Text>
                </VerticalStack>
              )}
            </>
          )}
        </VerticalStack>
      </VerticalStack>
    </Card>
  );
}
