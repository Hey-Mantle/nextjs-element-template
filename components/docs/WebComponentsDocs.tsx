"use client";

import {
  Card,
  HorizontalStack,
  Link,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function WebComponentsDocs() {
  return (
    <VerticalStack gap="6">
      {/* Overview */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Overview</Text>
          <Text variant="bodyMd">
            Mantle provides web components that integrate seamlessly with the Mantle UI. These
            components are invisible in your iframe but render in the parent Mantle window.
          </Text>
        </VerticalStack>
      </Card>

      {/* Component List */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Available Components</Text>
          <VerticalStack gap="3">
            <Link url="/docs/web-components/modal">
              <HorizontalStack gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  Display modals and dialogs
                </Text>
              </HorizontalStack>
            </Link>

            <Link url="/docs/web-components/title-bar">
              <HorizontalStack gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-title-bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  Page title bars with actions
                </Text>
              </HorizontalStack>
            </Link>

            <Link url="/docs/web-components/save-bar">
              <HorizontalStack gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-save-bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  Unsaved changes indicator
                </Text>
              </HorizontalStack>
            </Link>

            <Link url="/docs/web-components/nav-menu">
              <HorizontalStack gap="2" alignItems="center">
                <Text variant="bodyMd" fontWeight="semibold">
                  ui-nav-menu
                </Text>
                <Text variant="bodySm" color="subdued">
                  Navigation menus
                </Text>
              </HorizontalStack>
            </Link>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Basic Usage */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Basic Usage</Text>
          <Text variant="bodyMd">
            All web components work the same way: add them to your JSX and they automatically
            communicate with the parent Mantle window.
          </Text>

          <CodeBlock language="tsx">
{`import { useEffect, useState } from 'react';

export default function MyPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ui-title-bar title="My Page">
        <button variant="primary" onClick={() => setModalOpen(true)}>
          Open Modal
        </button>
      </ui-title-bar>

      <ui-modal id="my-modal" open={modalOpen}>
        <div>
          <p>Modal content here</p>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
        <ui-title-bar title="Modal Title">
          <button onClick={() => setModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>
    </>
  );
}`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* React Integration */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">React Integration</Text>
          <Text variant="bodyMd">
            Web components work seamlessly with React. Use state to control visibility and handle
            events with React handlers.
          </Text>

          <CodeBlock language="tsx">
{`// React state controls component visibility
const [isOpen, setIsOpen] = useState(false);

// Use React event handlers
<ui-modal 
  id="my-modal" 
  open={isOpen}
  onClose={() => setIsOpen(false)}
>
  <div>Content</div>
</ui-modal>`}
          </CodeBlock>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}

