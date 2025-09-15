"use client";

import { Badge, Button, Card, Text, VerticalStack } from "@heymantle/litho";
import { useState } from "react";

interface SessionTestResponse {
  success?: boolean;
  error?: string;
  message?: string;
  session?: {
    user: {
      id: string;
      email: string;
      name: string;
      organizationId: string;
      organizationName: string;
    };
    expires: string;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    organization: {
      id: string;
      name: string;
    };
  };
  timestamp?: string;
  processedAt?: string;
}

export default function SessionTestComponent() {
  const [sessionTokenInput, setSessionTokenInput] = useState("");
  const [authResponse, setAuthResponse] = useState<SessionTestResponse | null>(
    null
  );
  const [sessionResponse, setSessionResponse] =
    useState<SessionTestResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const testSessionToken = async () => {
    if (!sessionTokenInput.trim()) {
      alert("Please enter a session token");
      return;
    }

    setLoading(true);
    setAuthResponse(null);
    setSessionResponse(null);

    try {
      // Step 1: Authenticate with session token
      console.log("Step 1: Authenticating with session token...");
      const authRes = await fetch("/api/auth/session-token-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: sessionTokenInput,
        }),
      });

      const authData = await authRes.json();
      setAuthResponse(authData);
      console.log("Authentication response:", authData);

      if (!authRes.ok) {
        console.error("Authentication failed:", authData);
        return;
      }

      // Step 2: Test the session with the new cookies
      console.log("Step 2: Testing session with cookies...");
      const sessionRes = await fetch("/api/auth/test-session", {
        method: "GET",
        credentials: "include", // Important: include cookies
      });

      const sessionData = await sessionRes.json();
      setSessionResponse(sessionData);
      console.log("Session test response:", sessionData);
    } catch (error) {
      console.error("Error during testing:", error);
      setAuthResponse({
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testSessionOnly = async () => {
    setLoading(true);
    setSessionResponse(null);

    try {
      const sessionRes = await fetch("/api/auth/test-session", {
        method: "GET",
        credentials: "include",
      });

      const sessionData = await sessionRes.json();
      setSessionResponse(sessionData);
      console.log("Session test response:", sessionData);
    } catch (error) {
      console.error("Error testing session:", error);
      setSessionResponse({
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = (
    response: SessionTestResponse | null,
    title: string
  ) => {
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

          {response.error && (
            <Text variant="bodyMd" color="critical">
              Error: {response.error}
            </Text>
          )}

          {response.session && (
            <VerticalStack gap="1">
              <Text variant="headingSm">Session Data:</Text>
              <VerticalStack gap="1">
                <Text variant="bodyMd">
                  • User ID: {response.session.user.id}
                </Text>
                <Text variant="bodyMd">
                  • Email: {response.session.user.email}
                </Text>
                <Text variant="bodyMd">
                  • Name: {response.session.user.name}
                </Text>
                <Text variant="bodyMd">
                  • Org ID: {response.session.user.organizationId}
                </Text>
                <Text variant="bodyMd">
                  • Org Name: {response.session.user.organizationName}
                </Text>
                <Text variant="bodyMd">
                  • Expires:{" "}
                  {new Date(response.session.expires).toLocaleString()}
                </Text>
              </VerticalStack>
            </VerticalStack>
          )}

          {response.user && (
            <VerticalStack gap="1">
              <Text variant="headingSm">User Data:</Text>
              <VerticalStack gap="1">
                <Text variant="bodyMd">• User ID: {response.user.id}</Text>
                <Text variant="bodyMd">• Email: {response.user.email}</Text>
                <Text variant="bodyMd">• Name: {response.user.name}</Text>
                <Text variant="bodyMd">
                  • Org ID: {response.user.organization.id}
                </Text>
                <Text variant="bodyMd">
                  • Org Name: {response.user.organization.name}
                </Text>
              </VerticalStack>
            </VerticalStack>
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
        <Text variant="headingLg">Session Authentication Test</Text>

        <VerticalStack gap="1">
          <Text variant="bodyMd">
            This component tests the NextAuth session flow:
          </Text>
          <Text variant="bodyMd">1. Enter a JWT session token below</Text>
          <Text variant="bodyMd">
            2. Click "Test Full Flow" to authenticate and then test the session
          </Text>
          <Text variant="bodyMd">
            3. Or click "Test Session Only" to check existing session cookies
          </Text>
        </VerticalStack>

        <VerticalStack gap="2">
          <Text variant="headingSm">Session Token (JWT):</Text>
          <textarea
            id="sessionToken"
            value={sessionTokenInput}
            onChange={(e) => setSessionTokenInput(e.target.value)}
            placeholder="Enter your JWT session token here..."
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
              boxSizing: "border-box",
            }}
          />
        </VerticalStack>

        <VerticalStack gap="2" align="leading">
          <Button
            onClick={testSessionToken}
            loading={loading}
            primary
            disabled={!sessionTokenInput.trim()}
          >
            Test Full Flow (Authenticate + Test Session)
          </Button>

          <Button onClick={testSessionOnly} loading={loading}>
            Test Session Only
          </Button>
        </VerticalStack>

        <VerticalStack gap="4">
          {renderResponse(authResponse, "1. Authentication Response")}
          {renderResponse(sessionResponse, "2. Session Test Response")}
        </VerticalStack>
      </VerticalStack>
    </Card>
  );
}
