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

export default function SaveBarDocs() {
  const [saveBarVisible, setSaveBarVisible] = useState(false);

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
                  • <code>visible</code>: Boolean to control visibility
                </Text>
                <Text variant="bodySm">
                  • <code>message</code>: Message to display (string, optional)
                </Text>
              </VerticalStack>
            </div>

            <div>
              <Text variant="bodyMd" fontWeight="semibold">
                Methods
              </Text>
              <VerticalStack gap="1">
                <Text variant="bodySm">
                  • <code>show()</code>: Programmatically show the save bar
                </Text>
                <Text variant="bodySm">
                  • <code>hide()</code>: Programmatically hide the save bar
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
            {/* Basic Save Bar */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Basic Save Bar
                </Text>
                <Text variant="bodySm" color="subdued">
                  The save bar appears at the bottom of the page when there are unsaved changes. It provides actions to save or discard changes.
                </Text>
                <Button onClick={() => setSaveBarVisible(true)}>Show Save Bar</Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`const [hasChanges, setHasChanges] = useState(false);

<ui-save-bar visible={hasChanges} message="You have unsaved changes">
  <button variant="primary" onClick={handleSave}>Save</button>
  <button onClick={handleDiscard}>Discard</button>
</ui-save-bar>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Save Bar with Form */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Save Bar with Form
                </Text>
                <Text variant="bodySm" color="subdued">
                  Use the save bar with forms. The save bar automatically appears when form fields change. Track form state and show/hide the save bar accordingly.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`function MyForm() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <>
      <form
        data-save-bar
        onChange={() => setHasChanges(true)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
          setHasChanges(false);
        }}
      >
        <input name="name" />
        <input name="email" />
      </form>

      <ui-save-bar visible={hasChanges}>
        <button variant="primary" type="submit">Save</button>
        <button onClick={() => setHasChanges(false)}>Discard</button>
      </ui-save-bar>
    </>
  );
}`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Live Example */}
      <ui-save-bar visible={saveBarVisible} message="You have unsaved changes">
        <button variant="primary" onClick={() => setSaveBarVisible(false)}>
          Save
        </button>
        <button onClick={() => setSaveBarVisible(false)}>Discard</button>
      </ui-save-bar>
    </VerticalStack>
  );
}
