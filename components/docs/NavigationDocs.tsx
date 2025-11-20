"use client";

import CodeBlock from "@/components/CodeBlock";
import { useAppBridge } from "@heymantle/app-bridge-react";
import { Card, Stack, Text } from "@heymantle/litho";

export default function NavigationDocs() {
  const { mantle, isReady } = useAppBridge();

  return (
    <Stack gap="6" className="w-full">
      {/* Anchor Tags */}
      <Card title="Anchor Tags" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Regular anchor tags work automatically. Mantle intercepts clicks
              and updates both the iframe URL and the parent URL.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`// Regular anchor tags work automatically
<Link url="/docs/authentication">Authentication</Link>
<a href="/docs/web-components">Web Components</a>`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Programmatic Navigation */}
      <Card title="Programmatic Navigation" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.setPath()</code> to navigate programmatically.
              This updates both the iframe and parent URLs.
            </Text>
          </Stack>
          <Stack gap="4">
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
          </Stack>
        </div>
      </Card>

      {/* Next.js useRouter Integration */}
      <Card title="Next.js useRouter Integration" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Extend Next.js <code>useRouter</code> to automatically sync
              navigation with Mantle. This ensures URLs stay synchronized when
              using Next.js router methods.
            </Text>
          </Stack>
          <Stack gap="4">
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
          </Stack>
        </div>
      </Card>

      {/* Navigation API */}
      <Card title="Navigation API" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Mantle automatically tracks navigation events using the History
              API. You can also use the Navigation API for more control.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`// Mantle automatically tracks these:
history.pushState(null, '', '/new-path');
history.replaceState(null, '', '/new-path');

// For programmatic navigation, prefer mantle.setPath()
mantle.setPath('/new-path');`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>
    </Stack>
  );
}
