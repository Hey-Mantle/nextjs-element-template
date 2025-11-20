"use client";

import CodeBlock from "@/components/CodeBlock";
import { Card, Text, VerticalStack } from "@heymantle/litho";

export default function NavMenuDocs() {
  return (
    <VerticalStack gap="6" className="w-full">
      {/* ui-nav-menu element */}
      <Card title="ui-nav-menu element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-nav-menu</code> element is available for use in your
              app. It configures a navigation menu to display in the Mantle
              interface.
            </Text>
            <Text variant="bodyMd">
              Navigation menus provide sidebar navigation in Mantle. They
              automatically sync with your app's routing.
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
                  Anchor tags (<code>&lt;a&gt;</code>) are rendered as menu
                  items. Use <code>href</code> for navigation.
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
              When using anchor tags as children of <code>ui-nav-menu</code>,
              you can use these attributes:
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
                  Navigation URL. The menu item will navigate to this URL when
                  clicked.
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
                  Mark item as active. This highlights the current page in the
                  navigation menu.
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
                  Mark as home item. Home items are not rendered as links but
                  still appear in the navigation.
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

      {/* Example: Active State Management */}
      <Card title="Example: Active State Management" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              This app uses <code>ui-nav-menu</code> to display the
              documentation navigation. The active state is managed by checking
              the current pathname and conditionally setting the{" "}
              <code>active</code> attribute.
            </Text>
            <Text variant="bodySm" color="subdued">
              See <code>components/DocsNavigation.tsx</code> for the full
              implementation.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`import { usePathname } from "next/navigation";

export default function DocsNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <ui-nav-menu id="docs-nav">
      <a href="/" rel="home">Dashboard</a>
      <a
        href="/docs/authentication"
        {...(isActive("/docs/authentication") && { active: "" })}
      >
        Authentication
      </a>
      <a
        href="/docs/web-components"
        {...(isActive("/docs/web-components") && { active: "" })}
      >
        Web Components
      </a>
    </ui-nav-menu>
  );
}`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Mantle Relative URLs */}
      <Card title="Mantle Relative URLs" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              You can link to Mantle pages using the <code>mantle://</code>{" "}
              protocol. This allows navigation to Mantle's built-in pages like
              customers, reports, settings, etc.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`<ui-nav-menu>
  <a href="/customers">My App Customers</a>
  <a href="mantle://customers">Mantle Customers</a>
  <a href="mantle://reports">Mantle Reports</a>
  <a href="mantle://settings">Mantle Settings</a>
</ui-nav-menu>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>
    </VerticalStack>
  );
}
