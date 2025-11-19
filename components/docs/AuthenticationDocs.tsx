"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";
import { useState } from "react";

export default function AuthenticationDocs() {
  const { mantle, isReady } = useAppBridge();
  const [clientFetchResult, setClientFetchResult] = useState<string | null>(null);
  const [serverFetchResult, setServerFetchResult] = useState<string | null>(null);

  const handleClientFetch = async () => {
    if (!mantle || !isReady) return;

    try {
      const response = await mantle.authenticatedFetch("/api/test-endpoint");
      const data = await response.json();
      setClientFetchResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setClientFetchResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleServerFetch = async () => {
    try {
      const response = await fetch("/api/test-server-auth");
      const data = await response.json();
      setServerFetchResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setServerFetchResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <VerticalStack gap="6">
      {/* Client-Side Authentication */}
      <Card>
        <HorizontalStack gap="4" align="start">
          <VerticalStack gap="2" style={{ flex: 1 }}>
            <Text variant="headingMd">Client-Side authenticatedFetch</Text>
            <Text variant="bodyMd">
              Use <code>mantle.authenticatedFetch()</code> to make authenticated requests directly to
              your server or Mantle Core API. The App Bridge automatically includes the session token
              in the Authorization header.
            </Text>
            <Button onClick={handleClientFetch} disabled={!isReady}>
              Test Client Fetch
            </Button>
            {clientFetchResult && (
              <CodeBlock language="json">{clientFetchResult}</CodeBlock>
            )}
          </VerticalStack>
          <div style={{ flex: 1 }}>
            <CodeBlock language="typescript">
{`import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady } = useAppBridge();

  const fetchData = async () => {
    if (!mantle || !isReady) return;
    
    const response = await mantle.authenticatedFetch('/api/customers');
    const data = await response.json();
    console.log(data);
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}`}
            </CodeBlock>
          </div>
        </HorizontalStack>
      </Card>

      {/* Server-Side Authentication */}
      <Card>
        <HorizontalStack gap="4" align="start">
          <VerticalStack gap="2" style={{ flex: 1 }}>
            <Text variant="headingMd">Server-Side Authentication</Text>
            <Text variant="bodyMd">
              On the server, validate the JWT token from the Authorization header and optionally proxy
              requests to Mantle Core API.
            </Text>
            <Button onClick={handleServerFetch}>Test Server Fetch</Button>
            {serverFetchResult && (
              <CodeBlock language="json">{serverFetchResult}</CodeBlock>
            )}
          </VerticalStack>
          <div style={{ flex: 1 }}>
            <CodeBlock language="typescript">
{`// app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWTTokenPayload } from '@/lib/jwt-auth';

export async function GET(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyJWTTokenPayload(token);
  
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Now you can use the payload to make authenticated requests
  // or proxy to Mantle Core API
  const response = await fetch(
    \`https://api.heymantle.com/v1/customers\`,
    {
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    }
  );

  return NextResponse.json(await response.json());
}`}
            </CodeBlock>
          </div>
        </HorizontalStack>
      </Card>

      {/* Background Job Token Exchange */}
      <Card>
        <HorizontalStack gap="4" align="start">
          <VerticalStack gap="2" style={{ flex: 1 }}>
            <Text variant="headingMd">Long-Term Session Token Exchange</Text>
            <Text variant="bodyMd">
              For background jobs, exchange the short-term session token for a long-term access token
              that can be used for extended operations.
            </Text>
          </VerticalStack>
          <div style={{ flex: 1 }}>
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
          </div>
        </HorizontalStack>
      </Card>

      {/* Key Points */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Key Points</Text>
          <VerticalStack gap="2">
            <Text variant="bodyMd">
              • <strong>Client-side:</strong> Use <code>mantle.authenticatedFetch()</code> for all
              API requests from React components
            </Text>
            <Text variant="bodyMd">
              • <strong>Server-side:</strong> Validate JWT tokens using{" "}
              <code>verifyJWTTokenPayload()</code> from the Authorization header
            </Text>
            <Text variant="bodyMd">
              • <strong>Background jobs:</strong> Exchange short-term session tokens for long-term
              access tokens
            </Text>
            <Text variant="bodyMd">
              • <strong>Token expiry:</strong> Session tokens expire after a short period (typically
              1 hour). The App Bridge automatically refreshes tokens when needed.
            </Text>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
