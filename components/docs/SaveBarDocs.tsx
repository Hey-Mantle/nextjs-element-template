"use client";

import {
  Button,
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";
import { useState } from "react";

export default function SaveBarDocs() {
  const [saveBarVisible, setSaveBarVisible] = useState(false);

  return (
    <VerticalStack gap="6" className="w-full">
      {/* ui-save-bar element */}
      <Card title="ui-save-bar element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-save-bar</code> element is available for use in your app. It configures a save bar to display in the Mantle interface.
            </Text>
            <Text variant="bodyMd">
              The save bar appears at the bottom of the page when there are unsaved changes. It provides actions to save or discard changes.
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
                  Button elements are rendered as actions in the save bar. Typically includes a "Save" button and a "Discard" button.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  visible
                </Text>
                <Text variant="bodySm" color="subdued">
                  boolean
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Boolean to control visibility. Set to <code>true</code> when there are unsaved changes.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  message
                </Text>
                <Text variant="bodySm" color="subdued">
                  string (optional)
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Message to display in the save bar. Defaults to a standard unsaved changes message if not provided.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`const [hasChanges, setHasChanges] = useState(false);

<ui-save-bar visible={hasChanges} message="You have unsaved changes">
  <button variant="primary" onClick={handleSave}>Save</button>
  <button onClick={handleDiscard}>Discard</button>
</ui-save-bar>`}
            </CodeBlock>
            <Button onClick={() => setSaveBarVisible(true)} className="mt-2">
              Show Save Bar
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* ui-save-bar instance */}
      <Card title="ui-save-bar instance" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-save-bar</code> element provides instance methods to control the save bar.
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
                  Programmatically show the save bar.
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
                  Programmatically hide the save bar.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  setMessage(message)
                </Text>
                <Text variant="bodySm" color="subdued">
                  (message: string) =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Set the message displayed in the save bar.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`import { useRef } from 'react';

const saveBarRef = useRef<HTMLUISaveBarElement>(null);

saveBarRef.current?.show();
saveBarRef.current?.hide();
saveBarRef.current?.setMessage('Custom message');

<ui-save-bar ref={saveBarRef} visible={hasChanges}>
  <button variant="primary" onClick={handleSave}>Save</button>
  <button onClick={handleDiscard}>Discard</button>
</ui-save-bar>`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Save Bar with Form */}
      <Card title="Save Bar with Form" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use the save bar with forms to indicate unsaved changes. The save bar automatically appears when form values change.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`function MyForm() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <>
      <form
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
          </VerticalStack>
        </div>
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
