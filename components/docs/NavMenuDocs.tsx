"use client";

import {
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function NavMenuDocs() {
  return (
    <VerticalStack gap="6" className="w-full">
      {/* ui-nav-menu element */}
      <Card title="ui-nav-menu element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-nav-menu</code> element is available for use in your app. It configures a navigation menu to display in the Mantle interface.
            </Text>
            <Text variant="bodyMd">
              Navigation menus provide sidebar navigation in Mantle. They automatically sync with your app's routing.
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  children
                </Text>
                <Text variant="bodySm" color="subdued">
                  HTMLCollection
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Anchor tags (<code>&lt;a&gt;</code>) are rendered as menu items. Use <code>href</code> for navigation.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication">Authentication</a>
  <a href="/docs/web-components">Web Components</a>
  <a href="/docs/navigation">Navigation</a>
  <a href="/docs/toasts">Toast Notifications</a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Anchor tag attributes */}
      <Card title="Anchor tag attributes" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              When using anchor tags as children of <code>ui-nav-menu</code>, you can use these attributes:
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  href
                </Text>
                <Text variant="bodySm" color="subdued">
                  string (required)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Navigation URL. The menu item will navigate to this URL when clicked.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  active
                </Text>
                <Text variant="bodySm" color="subdued">
                  boolean
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Mark item as active. This highlights the current page in the navigation menu.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  data-action
                </Text>
                <Text variant="bodySm" color="subdued">
                  string (optional)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Action type. Allows custom behavior when clicking menu items.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  rel="home"
                </Text>
                <Text variant="bodySm" color="subdued">
                  string (optional)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Mark as home item. Home items are not rendered as links but still appear in the navigation.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication" active>Authentication</a>
  <a href="/docs/web-components">Web Components</a>
  <a href="/docs/navigation">Navigation</a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* ui-nav-menu instance */}
      <Card title="ui-nav-menu instance" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-nav-menu</code> element provides instance methods to control the navigation menu.
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  show()
                </Text>
                <Text variant="bodySm" color="subdued">
                  () =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Programmatically show the nav menu.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  hide()
                </Text>
                <Text variant="bodySm" color="subdued">
                  () =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Programmatically hide the nav menu.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`import { useRef } from 'react';

const navMenuRef = useRef<HTMLUINavMenuElement>(null);

navMenuRef.current?.show();
navMenuRef.current?.hide();

<ui-nav-menu ref={navMenuRef}>
  <a href="/docs/authentication">Authentication</a>
  <a href="/docs/web-components">Web Components</a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Active State */}
      <Card title="Active State" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Mark menu items as active to highlight the current page in the navigation menu.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication" active>Authentication</a>
  <a href="/docs/web-components">Web Components</a>
  <a href="/docs/navigation">Navigation</a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Menu Items with Actions */}
      <Card title="Menu Items with Actions" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>data-action</code> attribute to add custom behavior when clicking menu items.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication" data-action="navigate">
    Authentication
  </a>
  <a href="/docs/web-components" data-action="navigate">
    Web Components
  </a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Live Example */}
      <ui-nav-menu>
        <a href="/docs/authentication">Authentication</a>
        <a href="/docs/web-components">Web Components</a>
        <a href="/docs/navigation">Navigation</a>
        <a href="/docs/toasts">Toast Notifications</a>
      </ui-nav-menu>
    </VerticalStack>
  );
}
