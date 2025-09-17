"use client";

import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { useEffect, useRef, useState } from "react";

interface ClientOnlyModalProps {
  open: boolean;
  title?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  onHide?: () => void;
  onAction?: (event: CustomEvent) => void;
  children: React.ReactNode;
}

/**
 * A client-side modal that uses App Bridge ui-modal elements to send
 * postMessage events to the parent Mantle window for rendering.
 *
 * This component waits for the `ui-modal` custom element to be defined
 * before rendering to avoid a race condition with the App Bridge script.
 */
export function ClientOnlyModal({
  open,
  title,
  size,
  onHide,
  onAction,
  children,
}: ClientOnlyModalProps) {
  const { isConnected, appBridge } = useSharedMantleAppBridge();
  const modalRef = useRef<HTMLElement>(null);
  const [isElementDefined, setIsElementDefined] = useState(false);

  useEffect(() => {
    // Wait for the custom element to be defined before attempting to render it.
    // This avoids a race condition where React creates the element before
    // the App Bridge script has defined it.
    window.customElements.whenDefined("ui-modal").then(() => {
      setIsElementDefined(true);
    });
  }, []);

  useEffect(() => {
    // This effect attaches event listeners to the modal element when it's open.
    if (!open || !isElementDefined) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const handleHide = () => {
      if (onHide) onHide();
    };
    const handleAction = (e: Event) => onAction?.(e as CustomEvent);

    modalElement.addEventListener("modal:hide", handleHide);
    if (onAction) {
      modalElement.addEventListener("action", handleAction);
    }
    if (appBridge && onHide) {
      appBridge.on("closeModal", onHide);
    }

    return () => {
      // Cleanup event listeners when the modal closes or the component unmounts.
      modalElement.removeEventListener("modal:hide", handleHide);
      if (onAction) {
        modalElement.removeEventListener("action", handleAction);
      }
      if (appBridge && onHide) {
        appBridge.off("closeModal", onHide);
      }
    };
    // Re-run this effect if the modal is re-opened or handlers change.
  }, [open, isConnected, isElementDefined, appBridge, onHide, onAction]);

  // Render nothing until we're connected and the custom element is defined.
  if (!isConnected || !isElementDefined) {
    return null;
  }

  // Conditionally render the modal based on the `open` prop.
  // This ensures the element is added to/removed from the DOM,
  // triggering its connected/disconnected callbacks.
  return (
    <ui-modal title={title} size={size} open={open} onClose={onHide}>
      {children}
    </ui-modal>
  );
}
