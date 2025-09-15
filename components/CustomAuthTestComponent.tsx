"use client";

import { Badge, Button, Card, Text, VerticalStack } from "@heymantle/litho";
import { useEffect, useState } from "react";

interface AuthTestResponse {
  success?: boolean;
  error?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    userId: string;
    organizationId: string;
    organizationName: string;
  };
  authMethod?: string;
  timestamp?: string;
  processedAt?: string;
  note?: string;
}

declare global {
  interface Window {
    mantle?: {
      currentSession?: string;
      ready?: boolean;
      on?: (event: string, handler: (data: any) => void) => void;
      requestSession?: () => void;
    };
  }
}

export default function CustomAuthTestComponent() {
  const [testResponse, setTestResponse] = useState<AuthTestResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [appBridgeReady, setAppBridgeReady] = useState(false);
  const [appBridgeSession, setAppBridgeSession] = useState<string | null>(null);

  // Initialize Mantle App Bridge integration
  useEffect(() => {
    const initializeAppBridge = () => {
      if (typeof window !== "undefined" && window.mantle) {
        console.log("Mantle App Bridge detected");
        setAppBridgeReady(window.mantle.ready || false);

        if (window.mantle.currentSession) {
          console.log("Session token available from App Bridge");
          setAppBridgeSession(window.mantle.currentSession);
        }

        // Listen for session updates
        if (window.mantle.on) {
          window.mantle.on("session", (data: any) => {
            console.log("App Bridge session updated:", data);
            if (data.session) {
              setAppBridgeSession(data.session);
            }
          });

          window.mantle.on("ready", (data: any) => {
            console.log("App Bridge ready:", data);
            setAppBridgeReady(true);
            if (data.session) {
              setAppBridgeSession(data.session);
            }
          });
        }

        // Request session if not available
        if (!window.mantle.currentSession && window.mantle.requestSession) {
          console.log("Requesting session from App Bridge");
          window.mantle.requestSession();
        }
      } else {
        console.log("Mantle App Bridge not detected, retrying...");
        // Retry in 1 second if app bridge not ready
        setTimeout(initializeAppBridge, 1000);
      }
    };

    initializeAppBridge();
  }, []);

  const testAppBridgeAuth = async () => {
    if (!appBridgeSession) {
      alert("No App Bridge session token available");
      return;
    }

    setLoading(true);
    setTestResponse(null);

    try {
      console.log(
        "Testing with App Bridge session token via Authorization header..."
      );
      const testRes = await fetch("/api/auth/test-session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${appBridgeSession}`,
        },
      });

      const testData = await testRes.json();
      setTestResponse(testData);
      console.log("App Bridge auth test response:", testData);
    } catch (error) {
      console.error("Error testing App Bridge auth:", error);
      setTestResponse({
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = (response: AuthTestResponse | null, title: string) => {
    if (!response) return null;

    return (
      <Card>
        <VerticalStack gap="2">
          <Text variant="headingMd">{title}</Text>

          {response.success ? (
            <Badge status="success">Success</Badge>
          ) : (
            <Badge status="critical">Error</Badge>
          )}

          {response.message && <Text variant="bodyMd">{response.message}</Text>}
          {response.note && (
            <Text variant="bodyMd" color="subdued">
              {response.note}
            </Text>
          )}

          {response.error && (
            <Text variant="bodyMd" color="critical">
              Error: {response.error}
            </Text>
          )}

          {response.user && (
            <VerticalStack gap="1">
              <Text variant="headingSm">User Data:</Text>
              <VerticalStack gap="1">
                <Text variant="bodyMd">• User ID: {response.user.id}</Text>
                <Text variant="bodyMd">• Email: {response.user.email}</Text>
                <Text variant="bodyMd">• Name: {response.user.name}</Text>
                <Text variant="bodyMd">
                  • Mantle User ID: {response.user.userId}
                </Text>
                <Text variant="bodyMd">
                  • Org ID: {response.user.organizationId}
                </Text>
                <Text variant="bodyMd">
                  • Org Name: {response.user.organizationName}
                </Text>
              </VerticalStack>
            </VerticalStack>
          )}

          {response.authMethod && (
            <Text variant="bodyMd" color="subdued">
              Auth Method: {response.authMethod}
            </Text>
          )}

          {(response.timestamp || response.processedAt) && (
            <Text variant="bodyMd" color="subdued">
              {response.timestamp &&
                `Timestamp: ${new Date(response.timestamp).toLocaleString()}`}
              {response.processedAt &&
                `Processed: ${new Date(response.processedAt).toLocaleString()}`}
            </Text>
          )}

          <VerticalStack gap="1">
            <Text variant="bodySm" fontWeight="medium">
              Raw Response:
            </Text>
            <Card>
              <Text
                variant="bodySm"
                className="font-mono whitespace-pre-wrap break-words text-xs"
              >
                {JSON.stringify(response, null, 2)}
              </Text>
            </Card>
          </VerticalStack>
        </VerticalStack>
      </Card>
    );
  };

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingLg">App Bridge JWT Auth Test</Text>

        <VerticalStack gap="1">
          <Text variant="bodyMd">
            This component tests authentication using the Mantle App Bridge
            session token:
          </Text>
          <Text variant="bodyMd">
            1. Session token is fetched automatically from App Bridge
          </Text>
          <Text variant="bodyMd">
            2. Token is sent as Authorization: Bearer header to server
          </Text>
          <Text variant="bodyMd">
            3. API endpoint verifies JWT and returns user context
          </Text>
        </VerticalStack>

        {/* App Bridge Status */}
        <Card>
          <VerticalStack gap="2">
            <Text variant="headingSm">Mantle App Bridge Status</Text>
            <VerticalStack gap="1">
              <Text variant="bodyMd">
                Ready:{" "}
                {appBridgeReady ? (
                  <Badge status="success">Connected</Badge>
                ) : (
                  <Badge status="warning">Not Ready</Badge>
                )}
              </Text>
              <Text variant="bodyMd">
                Session Available:{" "}
                {appBridgeSession ? (
                  <Badge status="success">Yes</Badge>
                ) : (
                  <Badge status="critical">No</Badge>
                )}
              </Text>
              {appBridgeSession && (
                <Text variant="bodyMd" color="subdued">
                  Token Preview: {appBridgeSession.substring(0, 50)}...
                </Text>
              )}
            </VerticalStack>
          </VerticalStack>
        </Card>

        <VerticalStack gap="2" align="leading">
          <Button
            onClick={testAppBridgeAuth}
            loading={loading}
            primary
            disabled={!appBridgeSession}
          >
            Test App Bridge Authentication
          </Button>
        </VerticalStack>

        <VerticalStack gap="4">
          {renderResponse(testResponse, "Authentication Test Result")}
        </VerticalStack>
      </VerticalStack>
    </Card>
  );
}
