"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

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
    <VerticalStack gap="6" className="w-full">
      {/* API Reference */}
      <Card title="API Reference" padded>
        <VerticalStack gap="2">
          <Text variant="bodyMd">
            • <code>mantle.showSuccess(message: string)</code> - Show success toast
          </Text>
          <Text variant="bodyMd">
            • <code>mantle.showError(message: string)</code> - Show error toast
          </Text>
          <Text variant="bodyMd">
            • <code>mantle.showToast(message: string, status?: 'success' | 'error')</code> - Show
            toast with custom status
          </Text>
        </VerticalStack>
      </Card>

      {/* Overview */}
      <Card title="Overview" padded>
        <Text variant="bodyMd">
          Toast notifications provide user feedback for actions and errors. They appear at the
          top of the Mantle interface and automatically dismiss after a few seconds.
        </Text>
      </Card>

      {/* Success Toast */}
      <Card title="Success Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showSuccess()</code> to display success messages.
            </Text>
            <Button onClick={showSuccessToast} disabled={!isReady}>
              Show Success Toast
            </Button>
          </VerticalStack>
          <VerticalStack gap="4">
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
          </VerticalStack>
        </div>
      </Card>

      {/* Error Toast */}
      <Card title="Error Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showError()</code> to display error messages.
            </Text>
            <Button onClick={showErrorToast} disabled={!isReady}>
              Show Error Toast
            </Button>
          </VerticalStack>
          <VerticalStack gap="4">
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
          </VerticalStack>
        </div>
      </Card>

      {/* Custom Toast */}
      <Card title="Custom Toast" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use <code>mantle.showToast()</code> with a status parameter for more control.
            </Text>
            <Button onClick={showCustomToast} disabled={!isReady}>
              Show Custom Toast
            </Button>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`// Show toast with custom status
mantle.showToast('Custom message', 'success');
mantle.showToast('Custom message', 'error');

// Convenience methods
mantle.showSuccess('Success message');
mantle.showError('Error message');`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Real-World Example */}
      <Card title="Real-World Example" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Here's a complete example showing toast usage in a form submission with proper error handling.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`import { useAppBridge } from '@heymantle/app-bridge-react';
import { useState } from 'react';

function ContactForm() {
  const { mantle, isReady } = useAppBridge();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mantle || !isReady) return;

    setLoading(true);
    try {
      const response = await mantle.authenticatedFetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create contact');
      }

      mantle.showSuccess('Contact created successfully!');
      // Reset form or navigate away
    } catch (error) {
      mantle.showError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>
    </VerticalStack>
  );
}
