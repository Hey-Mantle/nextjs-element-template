"use client";

import CodeBlock from "@/components/CodeBlock";
import { useAppBridge } from "@heymantle/app-bridge-react";
import { Button, Card, Stack, Text } from "@heymantle/litho";

export default function ToastDocs() {
  const { mantle, isReady } = useAppBridge();

  const showSuccessToast = () => {
    if (!mantle || !isReady) return;
    mantle.showSuccess("Operation completed successfully!");
  };

  const showErrorToast = () => {
    if (!mantle || !isReady) return;
    mantle.showError("Something went wrong. Please try again.");
  };

  const showCustomToast = () => {
    if (!mantle || !isReady) return;
    mantle.showToast("Custom message", "success");
  };

  return (
    <Stack gap="6" className="w-full">
      {/* Success Toast */}
      <Card title="Success Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showSuccess()</code> to display success messages.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`import { useAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady } = useAppBridge();

  const handleSave = async () => {
    try {
      await saveData();
      if (mantle && isReady) {
        mantle.showSuccess('Data saved successfully!');
      }
    } catch (error) {
      if (mantle && isReady) {
        mantle.showError('Failed to save data');
      }
    }
  };

  return <button onClick={handleSave}>Save</button>;
}`}
            </CodeBlock>
            <Button onClick={showSuccessToast} disabled={!isReady}>
              Show Success Toast
            </Button>
          </Stack>
        </div>
      </Card>

      {/* Error Toast */}
      <Card title="Error Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showError()</code> to display error messages.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`const handleDelete = async () => {
  try {
    await deleteItem();
    mantle.showSuccess('Item deleted');
  } catch (error) {
    mantle.showError('Failed to delete item');
  }
};`}
            </CodeBlock>
            <Button onClick={showErrorToast} disabled={!isReady}>
              Show Error Toast
            </Button>
          </Stack>
        </div>
      </Card>

      {/* Custom Toast */}
      <Card title="Custom Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showToast()</code> with a status parameter for
              more control.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`// Show toast with custom status
mantle.showToast('Custom message', 'success');
mantle.showToast('Custom message', 'error');

// Convenience methods
mantle.showSuccess('Success message');
mantle.showError('Error message');`}
            </CodeBlock>
            <Button onClick={showCustomToast} disabled={!isReady}>
              Show Custom Toast
            </Button>
          </Stack>
        </div>
      </Card>
    </Stack>
  );
}
