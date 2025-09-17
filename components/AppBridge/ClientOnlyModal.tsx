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
  const { isConnected } = useSharedMantleAppBridge();

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
    if (!isClient || !isConnected) return;

    if (open && !modalRef.current) {
      // --- Create the modal imperatively ---
      console.log("[ClientOnlyModal] Creating modal element imperatively.");

      // Check if custom elements are defined
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
      // Ensure the proxy element is not visible in the iframe
      modal.style.display = "none";

      // Create a container for the React children
      const contentDiv = document.createElement("div");

      // Add a title bar if needed
      if (title) {
        const UITitleBarClass = window.customElements.get(
          "ui-title-bar"
        ) as any;
        if (UITitleBarClass) {
          const titleBar = new UITitleBarClass();
          titleBar.setAttribute("title", title);
          modal.appendChild(titleBar);
        }
      }

      modal.appendChild(contentDiv);
      document.body.appendChild(modal);

      // --- Attach listeners and call show() ---
      if (onHide) {
        modal.addEventListener("hide", onHide);
      }
      if (onAction) {
        modal.addEventListener("action", onAction as EventListener);
      }

      modalRef.current = modal;
      setPortalContainer(contentDiv); // Set the portal target

      // Call show() to message the parent window
      if (typeof modal.show === "function") {
        // Use a timeout to ensure the event loop has a chance to clear
        // This can help with timing issues where the parent window listener for postMessage
        // may not be ready immediately after the element is created.
        setTimeout(() => {
          modal.show();
          console.log("[ClientOnlyModal] modal.show() called via timeout.");
        }, 0);
      } else {
        console.error("[ClientOnlyModal] modal.show() is not a function.");
      }
    } else if (!open && modalRef.current) {
      // --- Clean up the modal ---
      const modal = modalRef.current;
      console.log("[ClientOnlyModal] Cleaning up modal element.");

      // Call hide() to message the parent
      if (typeof modal.hide === "function") {
        modal.hide();
        console.log("[ClientOnlyModal] modal.hide() called.");
      }

      // Clean up event listeners
      if (onHide) {
        modal.removeEventListener("hide", onHide);
      }
      if (onAction) {
        modal.removeEventListener("action", onAction as EventListener);
      }

      // Remove from DOM
      document.body.removeChild(modal);
      modalRef.current = null;
      setPortalContainer(null);
    }

    // Final cleanup on component unmount
    return () => {
      if (modalRef.current) {
        document.body.removeChild(modalRef.current);
        modalRef.current = null;
      }
    };
  }, [open, isClient, isConnected, title, size, onHide, onAction]);

  // Use a portal to render children into the imperatively created container
  if (isClient && portalContainer) {
    return createPortal(children, portalContainer);
  }

  // Render nothing otherwise
  return null;
}
