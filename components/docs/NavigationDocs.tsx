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
    <VerticalStack gap="6" className="w-full">
      {/* Overview */}
      <Card title="Overview" padded>
        <Text variant="bodyMd">
          Mantle automatically tracks navigation within your Element to keep URLs synchronized.
          When users navigate in your app, Mantle updates the parent URL to reflect the current
          location.
        </Text>
      </Card>

      {/* Anchor Tags */}
      <Card title="Anchor Tags" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Regular anchor tags work automatically. Mantle intercepts clicks and updates both the
              iframe URL and the parent URL.
            </Text>
            <HorizontalStack gap="2">
              <Link url="/docs/authentication">Authentication Docs</Link>
              <Link url="/docs/web-components">Web Components</Link>
              <Link url="/docs/toasts">Toast Notifications</Link>
            </HorizontalStack>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`// Regular anchor tags work automatically
<Link url="/docs/authentication">Authentication</Link>
<a href="/docs/web-components">Web Components</a>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Programmatic Navigation */}
      <Card title="Programmatic Navigation" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.setPath()</code> to navigate programmatically. This updates both the
              iframe and parent URLs.
            </Text>
            <Button onClick={handleProgrammaticNavigation} disabled={!isReady}>
              Navigate Programmatically
            </Button>
          </VerticalStack>
          <VerticalStack gap="4">
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
        </div>
      </Card>

      {/* Next.js useRouter Integration */}
      <Card title="Next.js useRouter Integration" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Extend Next.js <code>useRouter</code> to automatically sync navigation with Mantle.
              This ensures URLs stay synchronized when using Next.js router methods.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
        </div>
      </Card>

      {/* Navigation API */}
      <Card title="Navigation API" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Mantle automatically tracks navigation events using the History API. You can also use
              the Navigation API for more control.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`// Mantle automatically tracks these:
history.pushState(null, '', '/new-path');
history.replaceState(null, '', '/new-path');

// For programmatic navigation, prefer mantle.setPath()
mantle.setPath('/new-path');`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Best Practices */}
      <Card title="Best Practices" padded>
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
      </Card>
    </VerticalStack>
  );
}
