"use client";

import {
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function NavMenuDocs() {
  return (
    <VerticalStack gap="6">
      {/* API Reference - Moved to top */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">API Reference</Text>
          <VerticalStack gap="3">
            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Children
              </Text>
              <Text variant="bodySm">
                Anchor tags (<code>&lt;a&gt;</code>) are rendered as menu items. Use{" "}
                <code>href</code> for navigation.
              </Text>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Attributes (on anchor tags)
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>href</code>: Navigation URL (required)
                </Text>
                <Text variant="bodySm">
                  • <code>active</code>: Mark item as active (boolean)
                </Text>
                <Text variant="bodySm">
                  • <code>data-action</code>: Action type (string, optional)
                </Text>
                <Text variant="bodySm">
                  • <code>rel="home"</code>: Mark as home item (doesn't render as link)
                </Text>
              </VerticalStack>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Methods
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>show()</code>: Programmatically show the nav menu
                </Text>
                <Text variant="bodySm">
                  • <code>hide()</code>: Programmatically hide the nav menu
                </Text>
              </VerticalStack>
            </div>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Examples Section */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Examples</Text>
          <VerticalStack gap="6">
            {/* Basic Nav Menu */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Basic Navigation Menu
                </Text>
                <Text variant="bodySm" color="subdued">
                  Navigation menus provide sidebar navigation in Mantle. They automatically sync with your app's routing.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication">Authentication</a>
  <a href="/docs/web-components">Web Components</a>
  <a href="/docs/navigation">Navigation</a>
  <a href="/docs/toasts">Toast Notifications</a>
</ui-nav-menu>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Active State */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Active State
                </Text>
                <Text variant="bodySm" color="subdued">
                  Mark active items using the <code>active</code> attribute or <code>active</code> class. This highlights the current page in the navigation.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-nav-menu>
  <a href="/docs/authentication" active>Authentication</a>
  <a href="/docs/web-components">Web Components</a>
  <a href="/docs/navigation">Navigation</a>
</ui-nav-menu>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Actions */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Menu Items with Actions
                </Text>
                <Text variant="bodySm" color="subdued">
                  You can add actions to menu items using the <code>data-action</code> attribute. This allows custom behavior when clicking menu items.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
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
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
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
