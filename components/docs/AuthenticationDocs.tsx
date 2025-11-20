"use client";

import CodeBlock from "@/components/CodeBlock";
import {
  useAppBridge,
  useOrganization,
  useUser,
} from "@heymantle/app-bridge-react";
import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { useState } from "react";

export default function AuthenticationDocs() {
  const { mantle, isReady } = useAppBridge();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [clientFetchResult, setClientFetchResult] = useState<string | null>(
    null
  );
  const [serverFetchResult, setServerFetchResult] = useState<string | null>(
    null
  );

  const handleClientFetch = async () => {
    if (!mantle || !isReady) return;

    try {
      // Fetch from Core API via server proxy
      // The server proxy forwards both Authorization and X-Mantle-Session-Token-Auth headers
      const response = await mantle.authenticatedFetch(`/api/customers`, {});
      const data = await response.json();
      setClientFetchResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setClientFetchResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleServerFetch = async () => {
    if (!mantle || !isReady) return;

    try {
      // Use authenticatedFetch to include Authorization header
      // The server endpoint will proxy this to Mantle Core API
      const response = await mantle.authenticatedFetch(
        "/api/test-server-auth",
        {}
      );
      const data = await response.json();
      setServerFetchResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setServerFetchResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <VerticalStack gap="6" className="w-full">
      {/* Client-Side Authentication */}
      <Card title="Client-Side authenticatedFetch" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              Use <code>mantle.authenticatedFetch()</code> to make authenticated
              requests directly to your server or Mantle Core API. The App
              Bridge automatically includes the session token in the
              Authorization header.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="typescript">
              {`import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady } = useAppBridge();

  const fetchData = async () => {
    if (!mantle || !isReady) return;
    
    // authenticatedFetch automatically includes the session token
    // The server proxy forwards it to Mantle Core API
    const response = await mantle.authenticatedFetch('/api/customers');
    const data = await response.json();
    console.log(data);
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}`}
            </CodeBlock>
            <Button onClick={handleClientFetch} disabled={!isReady}>
              Test Client Fetch
            </Button>
            {clientFetchResult && (
              <div className="max-h-[400px] overflow-auto">
                <CodeBlock language="json">{clientFetchResult}</CodeBlock>
              </div>
            )}
          </VerticalStack>
        </div>
      </Card>

      {/* Server-Side Authentication */}
      <Card title="Server-Side Authentication" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              On the server, validate the JWT token from the Authorization
              header and optionally proxy requests to Mantle Core API.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="typescript">
              {`// Client-side: Use authenticatedFetch to call your server endpoint
import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady } = useAppBridge();

  const fetchData = async () => {
    if (!mantle || !isReady) return;
    
    // authenticatedFetch automatically includes Authorization header
    const response = await mantle.authenticatedFetch('/api/customers');
    const data = await response.json();
    console.log(data);
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}

// Server-side: app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get headers from the client request
  const authHeader = request.headers.get('authorization');
  const sessionTokenAuthHeader = request.headers.get('x-mantle-session-token-auth');

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get Core API URL from environment
  const baseUrl = process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL || 
    'https://api.heymantle.com/v1';
  const url = \`\${baseUrl}/customers\`;

  // Proxy the request to Mantle Core API
  // Forward both Authorization and X-Mantle-Session-Token-Auth headers
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: authHeader, // Forward JWT as-is
      'Content-Type': 'application/json',
      ...(sessionTokenAuthHeader && {
        'X-Mantle-Session-Token-Auth': sessionTokenAuthHeader,
      }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: \`API call failed: \${response.status} - \${errorText}\` },
      { status: response.status }
    );
  }

  return NextResponse.json(await response.json());
}`}
            </CodeBlock>
            <Button onClick={handleServerFetch} disabled={!isReady}>
              Test Server Fetch
            </Button>
            {serverFetchResult && (
              <div className="max-h-[400px] overflow-auto">
                <CodeBlock language="json">{serverFetchResult}</CodeBlock>
              </div>
            )}
          </VerticalStack>
        </div>
      </Card>

      {/* Background Job Token Exchange */}
      <Card title="Long-Term Session Token Exchange" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              For background jobs, exchange the short-term session token for a
              long-term access token that can be used for extended operations.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="typescript">
              {`// app/api/exchange-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWTTokenPayload } from '@/lib/jwt-auth';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionToken = authHeader.substring(7);
  const payload = verifyJWTTokenPayload(sessionToken);
  
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Exchange session token for long-term access token
  const response = await fetch(
    \`https://api.heymantle.com/v1/auth/exchange-token\`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${sessionToken}\`,
      },
      body: JSON.stringify({
        organizationId: payload.organization.id,
      }),
    }
  );

  const { accessToken } = await response.json();
  
  // Store accessToken securely for background jobs
  // This token can be used for long-running operations
  
  return NextResponse.json({ accessToken });
}`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Key Points */}
      <Card title="Key Points" padded>
        <VerticalStack gap="2">
          <Text variant="bodyMd">
            • <strong>Client-side:</strong> Use{" "}
            <code>mantle.authenticatedFetch()</code> for all API requests from
            React components
          </Text>
          <Text variant="bodyMd">
            • <strong>Server-side:</strong> Validate JWT tokens using{" "}
            <code>verifyJWTTokenPayload()</code> from the Authorization header
          </Text>
          <Text variant="bodyMd">
            • <strong>Background jobs:</strong> Exchange short-term session
            tokens for long-term access tokens
          </Text>
          <Text variant="bodyMd">
            • <strong>Token expiry:</strong> Session tokens expire after a short
            period (typically 1 hour). The App Bridge automatically refreshes
            tokens when needed.
          </Text>
        </VerticalStack>
      </Card>

      {/* User & Organization Info */}
      <Card title="Current User & Organization" padded>
        <VerticalStack gap="4">
          <Text variant="bodyMd">
            The App Bridge provides hooks to access the current user and
            organization data directly in your React components.
          </Text>
          <HorizontalStack gap="4" align="start">
            {user && (
              <VerticalStack gap="2">
                <Text variant="headingSm">User</Text>
                <Text variant="bodySm" color="subdued">
                  {user.name}
                </Text>
                {user.email && (
                  <Text variant="bodySm" color="subdued">
                    {user.email}
                  </Text>
                )}
              </VerticalStack>
            )}
            {organization && (
              <VerticalStack gap="2">
                <Text variant="headingSm">Organization</Text>
                <Text variant="bodySm" color="subdued">
                  {organization.name}
                </Text>
              </VerticalStack>
            )}
          </HorizontalStack>
          <CodeBlock language="typescript">
            {`import { useUser, useOrganization } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { user } = useUser();
  const { organization } = useOrganization();

  return (
    <div>
      {user && <p>User: {user.name}</p>}
      {organization && <p>Organization: {organization.name}</p>}
    </div>
  );
}`}
          </CodeBlock>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
