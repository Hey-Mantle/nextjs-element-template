"use client";

import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function TitleBarDocs() {
  return (
    <VerticalStack gap="6">
      {/* API Reference - Moved to top */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">API Reference</Text>
          <VerticalStack gap="3">
            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Attributes
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>title</code>: Page title (string)
                </Text>
                <Text variant="bodySm">
                  • <code>subtitle</code>: Page subtitle (string, optional)
                </Text>
                <Text variant="bodySm">
                  • <code>backAction</code>: Function or string for back button (optional)
                </Text>
              </VerticalStack>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Children
              </Text>
              <Text variant="bodySm">
                Button elements are rendered as actions in the title bar. Use{" "}
                <code>variant="primary"</code> for primary actions.
              </Text>
            </div>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Examples Section */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Examples</Text>
          <VerticalStack gap="6">
            {/* Basic Title Bar */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Basic Title Bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  Title bars appear at the top of pages in Mantle. They can include a title, subtitle, back action, and action buttons.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-title-bar title="My Page">
  <button variant="primary">Save</button>
  <button>Cancel</button>
</ui-title-bar>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Title Bar with Subtitle */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Title Bar with Subtitle
                </Text>
                <Text variant="bodySm" color="subdued">
                  Add a subtitle to provide additional context about the page.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-title-bar title="My Page" subtitle="Page description">
  <button variant="primary">Action</button>
</ui-title-bar>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Title Bar with Back Action */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Title Bar with Back Action
                </Text>
                <Text variant="bodySm" color="subdued">
                  Add a back button by providing a <code>backAction</code> prop. This can be a function or a string URL.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-title-bar 
  title="Detail Page" 
  backAction={() => router.back()}
>
  <button variant="primary">Save</button>
</ui-title-bar>`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Live Examples */}
      <ui-title-bar title="My Page">
        <button variant="primary">Save</button>
        <button>Cancel</button>
      </ui-title-bar>

      <ui-title-bar title="My Page" subtitle="Page description">
        <button variant="primary">Action</button>
      </ui-title-bar>
    </VerticalStack>
  );
}
