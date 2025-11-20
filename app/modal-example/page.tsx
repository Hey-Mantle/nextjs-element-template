"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import { Card, Stack, Text } from "@heymantle/litho";
import { useEffect, useRef, useState } from "react";

export default function ModalExamplePage() {
  const { mantle, isReady } = useAppBridge();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isInIframe, setIsInIframe] = useState(false);

  // Check if we're in an iframe
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  // Automatically report content size changes to parent window using native DOM API
  // App Bridge is guaranteed to be initialized when this component renders
  useEffect(() => {
    if (!mantle || !isReady || !contentRef.current) {
      return;
    }

    // Use native observeContentSize from app-bridge.js
    // Type assertion needed as TypeScript definitions may not include all methods
    const mantleWithMethods = mantle as any;
    if (mantleWithMethods.observeContentSize) {
      const cleanup = mantleWithMethods.observeContentSize(contentRef.current, {
        debounceMs: 150,
      });
      return cleanup;
    }
  }, [mantle, isReady]);

  const handleCloseModal = () => {
    if (mantle) {
      // Type assertion needed as TypeScript definitions may not include all methods
      const mantleWithMethods = mantle as any;
      if (mantleWithMethods.closeModal) {
        mantleWithMethods.closeModal();
      } else {
        // Fallback for direct access (not in iframe)
        window.history.back();
      }
    } else {
      // Fallback for direct access (not in iframe)
      window.history.back();
    }
  };

  const handlePrimaryActionClick = () => {
    alert("Primary action clicked");
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-white">
      <ui-title-bar title="Modal Example - Iframe Demo">
        <button onClick={handleCloseModal}>Close</button>
        <button
          {...({ variant: "primary" } as any)}
          onClick={handlePrimaryActionClick}
        >
          Primary Action
        </button>
      </ui-title-bar>

      <div className="p-6">
        <Stack gap="4">
          <Card>
            <Card.Section>
              <Stack gap="3">
                <Text variant="headingMd" fontWeight="bold">
                  This is a rendered iframe src
                </Text>
                <Text variant="bodyMd" color="subdued">
                  This modal page demonstrates the <code>ui-title-bar</code>{" "}
                  component within an iframe context. The app bridge script tag
                  is loaded via the layout, enabling communication between the
                  iframe and the parent Mantle application. A{" "}
                  <code>ui-title-bar</code> element is used to control the title
                  and actions of the modal
                </Text>
                <Text variant="bodySm" color="subdued">
                  Current URL:{" "}
                  {typeof window !== "undefined" ? window.location.href : ""}
                </Text>
                <Text variant="bodySm" color="subdued">
                  In iframe: {isInIframe ? "Yes" : "No"}
                </Text>
                <Text variant="bodySm" color="subdued">
                  App Bridge ready: {isReady ? "Yes" : "No"}
                </Text>
                {!isInIframe && (
                  <Text variant="bodySm" color="warning">
                    Note: This page is designed to be opened as a modal within
                    Mantle. When accessed directly, some features may not work
                    as expected.
                  </Text>
                )}
              </Stack>
            </Card.Section>
          </Card>
        </Stack>
      </div>
    </div>
  );
}
