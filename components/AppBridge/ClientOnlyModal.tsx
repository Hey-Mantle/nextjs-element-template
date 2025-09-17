"use client";

import { useSharedMantleAppBridge } from "@/lib/mantle-app-bridge-context";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Define the type for our custom element with imperative methods
type UIModalElement = HTMLElement & {
  show: () => void;
  hide: () => void;
};

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
 */
export function ClientOnlyModal({
  open,
  title,
  size,
  onHide,
  onAction,
  children,
}: ClientOnlyModalProps) {
  const [isClient, setIsClient] = useState(false);
  const { isConnected, appBridge } = useSharedMantleAppBridge();

  // This ref will hold the actual modal DOM element once we create it
  const modalRef = useRef<UIModalElement | null>(null);
  // This state will hold the container element for our React children
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  console.log(
    `[ClientOnlyModal] Render. open=${open}, isClient=${isClient}, isConnected=${isConnected}`
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // If we're not on the client, not connected to the bridge, or the modal shouldn't be open, do nothing.
    if (!isClient || !isConnected || !open) {
      return;
    }

    // --- Create the modal imperatively ---
    console.log("[ClientOnlyModal] Creating modal element imperatively.");

    const UIModalClass = window.customElements.get("ui-modal") as any;
    if (!UIModalClass) {
      console.error(
        "[ClientOnlyModal] Cannot create modal: ui-modal custom element is not defined."
      );
      return;
    }

    const modal = new UIModalClass() as UIModalElement;
    if (title) modal.setAttribute("title", title);
    if (size) modal.setAttribute("size", size);
    modal.style.display = "none";

    const contentDiv = document.createElement("div");

    if (title) {
      const UITitleBarClass = window.customElements.get("ui-title-bar") as any;
      if (UITitleBarClass) {
        const titleBar = new UITitleBarClass();
        titleBar.setAttribute("title", title);
        modal.appendChild(titleBar);
      }
    }

    modal.appendChild(contentDiv);
    document.body.appendChild(modal);

    // --- Create stable handlers for events ---
    const handleHide = () => {
      console.log(
        "[ClientOnlyModal] 'hide' event received from modal element."
      );
      if (onHide) {
        onHide();
      }
    };
    const handleAction = onAction as EventListener;

    // --- Attach listeners and show() ---
    modal.addEventListener("modal:hide", handleHide);
    if (onAction) modal.addEventListener("action", handleAction);

    // Listen for the global closeModal event from the app bridge
    if (appBridge && onHide) {
      // The app-bridge.js code fires a global 'closeModal' event
      // when the parent window closes the modal. We hook into that here
      // to ensure our React state is updated correctly.
      appBridge.on("closeModal", onHide);
    }

    modalRef.current = modal;
    setPortalContainer(contentDiv);

    if (typeof modal.show === "function") {
      setTimeout(() => {
        modal.show();
        console.log("[ClientOnlyModal] modal.show() called via timeout.");
      }, 0);
    } else {
      console.error("[ClientOnlyModal] modal.show() is not a function.");
    }

    // --- Return cleanup function ---
    // This will run when `open` becomes false or the component unmounts.
    return () => {
      console.log("[ClientOnlyModal] Cleaning up modal element.");

      // Remove the app bridge listener
      if (appBridge && onHide) {
        appBridge.off("closeModal", onHide);
      }

      if (typeof modal.hide === "function") {
        modal.hide();
        console.log("[ClientOnlyModal] modal.hide() called during cleanup.");
      }

      // Clean up event listeners
      modal.removeEventListener("modal:hide", handleHide);
      if (onAction) modal.removeEventListener("action", handleAction);

      // Remove from DOM
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      modalRef.current = null;
      setPortalContainer(null);
    };
  }, [open, isClient, isConnected, title, size, onHide, onAction]);

  // Use a portal to render children into the imperatively created container
  if (isClient && portalContainer) {
    return createPortal(children, portalContainer);
  }

  // Render nothing otherwise
  return null;
}
