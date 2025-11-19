"use client";

import {
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function TitleBarDocs() {
  return (
    <VerticalStack gap="6" className="w-full">
      {/* ui-title-bar element */}
      <Card title="ui-title-bar element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-title-bar</code> element is available for use in your app. It configures a title bar to display in the Mantle interface.
            </Text>
            <Text variant="bodyMd">
              Title bars appear at the top of pages in Mantle. They can include a title, subtitle, back action, and action buttons.
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
                  Button elements are rendered as actions in the title bar. Use <code>variant="primary"</code> for primary actions.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  title
                </Text>
                <Text variant="bodySm" color="subdued">
                  string
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  The title of the title bar. Can also be set via <code>document.title</code>.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  subtitle
                </Text>
                <Text variant="bodySm" color="subdued">
                  string (optional)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  The subtitle of the title bar. Provides additional context about the page.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  backAction
                </Text>
                <Text variant="bodySm" color="subdued">
                  Function | string (optional)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Function or string for back button. If provided, a back button will appear in the title bar. Can be a function callback or a URL string.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-title-bar title="My Page">
  <button variant="primary">Save</button>
  <button>Cancel</button>
</ui-title-bar>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* ui-title-bar instance */}
      <Card title="ui-title-bar instance" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-title-bar</code> element provides instance methods to control the title bar.
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  setTitle(title)
                </Text>
                <Text variant="bodySm" color="subdued">
                  (title: string) =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Set the title of the title bar programmatically.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  setSubtitle(subtitle)
                </Text>
                <Text variant="bodySm" color="subdued">
                  (subtitle: string) =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Set the subtitle of the title bar programmatically.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`import { useRef } from 'react';

const titleBarRef = useRef<HTMLUITitleBarElement>(null);

titleBarRef.current?.setTitle('New Title');
titleBarRef.current?.setSubtitle('New Subtitle');

<ui-title-bar ref={titleBarRef} title="My Page">
  <button variant="primary">Save</button>
</ui-title-bar>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Title Bar with Subtitle */}
      <Card title="Title Bar with Subtitle" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Add a subtitle to provide additional context about the page.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-title-bar title="My Page" subtitle="Page description">
  <button variant="primary">Action</button>
</ui-title-bar>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Title Bar with Back Action */}
      <Card title="Title Bar with Back Action" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Add a back button by providing a <code>backAction</code> prop. This can be a function or a URL string.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`<ui-title-bar 
  title="Detail Page" 
  backAction={() => router.back()}
>
  <button variant="primary">Save</button>
</ui-title-bar>`}
            </CodeBlock>
          </VerticalStack>
        </div>
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
