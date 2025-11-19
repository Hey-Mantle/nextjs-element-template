"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import {
  Button,
  Card,
  HorizontalStack,
  Link,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function NavigationDocs() {
  const { mantle, isReady } = useAppBridge();

  const handleProgrammaticNavigation = () => {
    if (!mantle || !isReady) return;
    mantle.setPath("/docs/navigation");
  };

  return (
    <VerticalStack gap="6">
      {/* Overview */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Overview</Text>
          <Text variant="bodyMd">
            Mantle automatically tracks navigation within your Element to keep URLs synchronized.
            When users navigate in your app, Mantle updates the parent URL to reflect the current
            location.
          </Text>
        </VerticalStack>
      </Card>

      {/* Anchor Tags */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Anchor Tags</Text>
          <Text variant="bodyMd">
            Regular anchor tags work automatically. Mantle intercepts clicks and updates both the
            iframe URL and the parent URL.
          </Text>

          <HorizontalStack gap="2">
            <Link url="/docs/authentication">Authentication Docs</Link>
            <Link url="/docs/web-components">Web Components</Link>
            <Link url="/docs/toasts">Toast Notifications</Link>
          </HorizontalStack>

          <CodeBlock language="tsx">
{`// Regular anchor tags work automatically
<Link url="/docs/authentication">Authentication</Link>
<a href="/docs/web-components">Web Components</a>`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Programmatic Navigation */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Programmatic Navigation</Text>
          <Text variant="bodyMd">
            Use <code>mantle.setPath()</code> to navigate programmatically. This updates both the
            iframe and parent URLs.
          </Text>

          <Button onClick={handleProgrammaticNavigation} disabled={!isReady}>
            Navigate Programmatically
          </Button>

          <CodeBlock language="tsx">
{`import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady } = useAppBridge();

  const navigateToPage = () => {
    if (!mantle || !isReady) return;
    mantle.setPath('/my-page');
  };

  return <button onClick={navigateToPage}>Go to Page</button>;
}`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Next.js useRouter Integration */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Next.js useRouter Integration</Text>
          <Text variant="bodyMd">
            Extend Next.js <code>useRouter</code> to automatically sync navigation with Mantle.
          </Text>

          <CodeBlock language="tsx">
{`// hooks/useMantleRouter.ts
import { useRouter as useNextRouter } from 'next/navigation';
import { useAppBridge } from '@heymantle/app-bridge-react';
import { useEffect } from 'react';

export function useMantleRouter() {
  const router = useNextRouter();
  const { mantle, isReady } = useAppBridge();

  const push = (href: string) => {
    router.push(href);
    if (mantle && isReady) {
      mantle.setPath(href);
    }
  };

  const replace = (href: string) => {
    router.replace(href);
    if (mantle && isReady) {
      mantle.setPath(href);
    }
  };

  return {
    ...router,
    push,
    replace,
  };
}

// Usage
import { useMantleRouter } from '@/hooks/useMantleRouter';

function MyComponent() {
  const router = useMantleRouter();
  
  return (
    <button onClick={() => router.push('/my-page')}>
      Navigate
    </button>
  );
}`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Navigation API */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Navigation API</Text>
          <Text variant="bodyMd">
            Mantle automatically tracks navigation events using the History API. You can also use
            the Navigation API for more control.
          </Text>

          <CodeBlock language="tsx">
{`// Mantle automatically tracks these:
history.pushState(null, '', '/new-path');
history.replaceState(null, '', '/new-path');

// For programmatic navigation, prefer mantle.setPath()
mantle.setPath('/new-path');`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Best Practices */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Best Practices</Text>
          <VerticalStack gap="2">
            <Text variant="bodyMd">
              • Use anchor tags for simple navigation - they work automatically
            </Text>
            <Text variant="bodyMd">
              • Use <code>mantle.setPath()</code> for programmatic navigation
            </Text>
            <Text variant="bodyMd">
              • Extend your router (Next.js, React Router, etc.) to sync with Mantle
            </Text>
            <Text variant="bodyMd">
              • Keep URLs clean and meaningful - they appear in the parent Mantle window
            </Text>
            <Text variant="bodyMd">
              • Avoid hash-based routing (#) - use path-based routing instead
            </Text>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}

