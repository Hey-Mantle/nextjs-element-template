"use client";

import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";
import { useState } from "react";

export default function ModalDocs() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [maxModalOpen, setMaxModalOpen] = useState(false);
  const [srcModalOpen, setSrcModalOpen] = useState(false);

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
                  • <code>id</code> (required): Unique identifier for the modal
                </Text>
                <Text variant="bodySm">
                  • <code>open</code>: Boolean to control visibility
                </Text>
                <Text variant="bodySm">
                  • <code>variant</code>: "small" | "base" | "large" | "max" (default: "base")
                </Text>
                <Text variant="bodySm">
                  • <code>src</code>: URL to load content from (optional)
                </Text>
              </VerticalStack>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Methods
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>show()</code>: Programmatically show the modal
                </Text>
                <Text variant="bodySm">
                  • <code>hide()</code>: Programmatically hide the modal
                </Text>
                <Text variant="bodySm">
                  • <code>toggle()</code>: Toggle modal visibility
                </Text>
              </VerticalStack>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Events
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>onClose</code>: Callback when modal is closed
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
            {/* Basic Modal */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Basic Modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  A simple modal with content and a title bar. Click the button to open it.
                </Text>
                <Button onClick={() => setBasicModalOpen(true)}>Open Basic Modal</Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`const [open, setOpen] = useState(false);

<ui-modal id="basic-modal" open={open}>
  <div>
    <p>This is modal content</p>
  </div>
  <ui-title-bar title="Modal Title">
    <button onClick={() => setOpen(false)}>Close</button>
  </ui-title-bar>
</ui-modal>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Large Modal */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Large Modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  Use the <code>variant</code> attribute to control modal size: small, base, large, or max.
                </Text>
                <Button onClick={() => setLargeModalOpen(true)}>Open Large Modal</Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-modal id="large-modal" variant="large" open={open}>
  <div>
    <p>Large modal content</p>
  </div>
  <ui-title-bar title="Large Modal">
    <button onClick={() => setOpen(false)}>Close</button>
  </ui-title-bar>
</ui-modal>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Max Modal */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Max Size Modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  Max variant modals take up most of the screen, perfect for complex forms or detailed views.
                </Text>
                <Button onClick={() => setMaxModalOpen(true)}>Open Max Modal</Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-modal id="max-modal" variant="max" open={open}>
  <div>
    <p>Max size modal content</p>
  </div>
  <ui-title-bar title="Max Modal">
    <button variant="primary">Save</button>
    <button onClick={() => setOpen(false)}>Cancel</button>
  </ui-title-bar>
</ui-modal>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Modal with src */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Modal with src URL
                </Text>
                <Text variant="bodySm" color="subdued">
                  Load content from a URL using the <code>src</code> attribute. The content loads in an iframe.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`<ui-modal id="src-modal" src="/my-modal-content" variant="max" open={open}>
  <ui-title-bar title="Modal Title">
    <button variant="primary">Save</button>
    <button onClick={() => setOpen(false)}>Close</button>
  </ui-title-bar>
</ui-modal>`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Live Examples */}
      <ui-modal id="basic-modal" open={basicModalOpen}>
        <div>
          <p>This is modal content</p>
        </div>
        <ui-title-bar title="Modal Title">
          <button onClick={() => setBasicModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal id="large-modal" variant="large" open={largeModalOpen}>
        <div>
          <p>Large modal content</p>
        </div>
        <ui-title-bar title="Large Modal">
          <button onClick={() => setLargeModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal id="max-modal" variant="max" open={maxModalOpen}>
        <div>
          <p>Max size modal content</p>
        </div>
        <ui-title-bar title="Max Modal">
          <button variant="primary">Save</button>
          <button onClick={() => setMaxModalOpen(false)}>Cancel</button>
        </ui-title-bar>
      </ui-modal>
    </VerticalStack>
  );
}
