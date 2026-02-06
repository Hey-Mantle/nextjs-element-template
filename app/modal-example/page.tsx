"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import { Card, Checkbox, Stack, Text, TextField } from "@heymantle/litho";
import { useEffect, useRef, useState } from "react";

export default function ModalExamplePage() {
  const { mantle, isReady } = useAppBridge();
  const contentRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);

  // Auto-size modal to content
  useEffect(() => {
    if (!mantle || !isReady || !contentRef.current) {
      return;
    }

    const mantleWithMethods = mantle as any;
    if (mantleWithMethods.observeContentSize) {
      const cleanup = mantleWithMethods.observeContentSize(
        contentRef.current,
        { debounceMs: 150 }
      );
      return cleanup;
    }
  }, [mantle, isReady]);

  const handleCancel = () => {
    const mantleWithMethods = mantle as any;
    if (mantleWithMethods?.closeModal) {
      mantleWithMethods.closeModal();
    } else {
      window.history.back();
    }
  };

  const handleSave = () => {
    const mantleWithMethods = mantle as any;
    if (mantleWithMethods?.showToast) {
      mantleWithMethods.showToast("Changes saved!", "success");
    }
    if (mantleWithMethods?.closeModal) {
      mantleWithMethods.closeModal();
    }
  };

  return (
    <div ref={contentRef}>
      <ui-title-bar title="Modal Example">
        <button onClick={handleCancel}>Cancel</button>
        <button
          {...({ variant: "primary" } as any)}
          onClick={handleSave}
        >
          Save
        </button>
      </ui-title-bar>

      <Stack gap="4">
        <Card>
          <Card.Section>
            <Stack gap="3">
              <TextField
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Enter a name..."
              />
              <Checkbox
                label="Enable feature"
                checked={enabled}
                onChange={setEnabled}
              />
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack gap="2">
              <Text variant="headingSm" fontWeight="semibold">
                Modal App Bridge Methods
              </Text>
              <Text variant="bodyMd" color="subdued">
                <strong>observeContentSize(ref, options)</strong> &mdash;
                Watches a DOM element and reports size changes to the parent
                window so the modal resizes to fit content.
              </Text>
              <Text variant="bodyMd" color="subdued">
                <strong>closeModal()</strong> &mdash; Tells the parent window to
                close this modal.
              </Text>
              <Text variant="bodyMd" color="subdued">
                <strong>showToast(message, type)</strong> &mdash; Shows a toast
                notification in the parent window.
              </Text>
            </Stack>
          </Card.Section>
        </Card>
      </Stack>
    </div>
  );
}
