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
    <VerticalStack gap="6">
      {/* API Reference - Moved to top */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">API Reference</Text>
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
        </VerticalStack>
      </Card>

      {/* Overview */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Overview</Text>
          <Text variant="bodyMd">
            Toast notifications provide user feedback for actions and errors. They appear at the
            top of the Mantle interface and automatically dismiss after a few seconds.
          </Text>
        </VerticalStack>
      </Card>

      {/* Examples Section */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Examples</Text>
          <VerticalStack gap="6">
            {/* Success Toast */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Success Toast
                </Text>
                <Text variant="bodySm" color="subdued">
                  Use <code>mantle.showSuccess()</code> to display success messages.
                </Text>
                <Button onClick={showSuccessToast} disabled={!isReady}>
                  Show Success Toast
                </Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
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
              </div>
            </HorizontalStack>

            {/* Error Toast */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Error Toast
                </Text>
                <Text variant="bodySm" color="subdued">
                  Use <code>mantle.showError()</code> to display error messages.
                </Text>
                <Button onClick={showErrorToast} disabled={!isReady}>
                  Show Error Toast
                </Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
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
              </div>
            </HorizontalStack>

            {/* Custom Toast */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Custom Toast
                </Text>
                <Text variant="bodySm" color="subdued">
                  Use <code>mantle.showToast()</code> with a status parameter for more control.
                </Text>
                <Button onClick={showCustomToast} disabled={!isReady}>
                  Show Custom Toast
                </Button>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="tsx">
{`// Show toast with custom status
mantle.showToast('Custom message', 'success');
mantle.showToast('Custom message', 'error');

// Convenience methods
mantle.showSuccess('Success message');
mantle.showError('Error message');`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            {/* Real-World Example */}
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  Real-World Example
                </Text>
                <Text variant="bodySm" color="subdued">
                  Here's a complete example showing toast usage in a form submission with proper error handling.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
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
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
