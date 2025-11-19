"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * AppBridgeNavigation Component
 *
 * Handles navigation events from Mantle App Bridge and syncs them
 * with Next.js App Router. This allows links to work correctly within
 * the iframe without causing page reloads.
 *
 * This component centralizes navigation handling for the entire app:
 * - Listens for Redirect.Action.APP events from parent window and navigates within iframe
 * - Syncs Next.js router navigation changes to parent window
 */
export default function AppBridgeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { mantle, isReady } = useAppBridge();
  const previousPathnameRef = useRef<string | null>(null);
  // Track if navigation is coming from parent to prevent feedback loop
  const isNavigatingFromParentRef = useRef(false);
  // Debounce timer for pathname sync
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle incoming navigation from parent window (Redirect.Action.APP)
  useEffect(() => {
    if (!mantle || !isReady) return;

    const handleRedirectAction = (data: {
      path: string;
      method: string;
      fullUrl?: string;
    }) => {
      // Normalize path (remove query string and hash for comparison)
      const normalizedPath = data.path?.split("?")[0].split("#")[0];
      const currentPath = pathname || window.location.pathname;

      // Only navigate if path is actually different
      if (normalizedPath && normalizedPath !== currentPath) {
        // Set flag to prevent syncing this navigation back to parent
        isNavigatingFromParentRef.current = true;

        try {
          router.push(data.path);
          // Clear flag after a short delay to allow Next.js to update
          setTimeout(() => {
            isNavigatingFromParentRef.current = false;
          }, 100);
        } catch (error) {
          console.error(
            `[AppBridgeNavigation] Error calling router.push():`,
            error
          );
          isNavigatingFromParentRef.current = false;
        }
      }
    };

    // Subscribe to Redirect.Action.APP via app-bridge.js API
    mantle.subscribeToRedirect(handleRedirectAction);

    // No cleanup needed since we don't have an unsubscribe method
    // The callback will be replaced on next mount
  }, [router, pathname, mantle, isReady]);

  // Listen for mantle:app-bridge:navigate events from app-bridge.js
  // This handles anchor clicks that app-bridge.js intercepts
  useEffect(() => {
    const handleMantleNavigate = (event: CustomEvent) => {
      const { path, method } = event.detail || {};

      if (!path) return;

      // Normalize path for comparison
      const normalizedPath = path.split("?")[0].split("#")[0];
      const currentPath = pathname || window.location.pathname;

      // Only navigate if path is different and not from parent
      if (
        normalizedPath !== currentPath &&
        !isNavigatingFromParentRef.current
      ) {
        // Prevent default to signal to app-bridge.js that we're handling it
        event.preventDefault();

        // Set flag to prevent syncing this navigation back to parent
        isNavigatingFromParentRef.current = true;

        try {
          router.push(path);
          // Clear flag after a short delay
          setTimeout(() => {
            isNavigatingFromParentRef.current = false;
          }, 100);
        } catch (error) {
          console.error(
            `[AppBridgeNavigation] Error handling mantle navigate event:`,
            error
          );
          isNavigatingFromParentRef.current = false;
        }
      }
    };

    window.addEventListener(
      "mantle:app-bridge:navigate",
      handleMantleNavigate as EventListener
    );

    return () => {
      window.removeEventListener(
        "mantle:app-bridge:navigate",
        handleMantleNavigate as EventListener
      );
    };
  }, [router, pathname]);

  // Sync Next.js router navigation to parent window
  useEffect(() => {
    // Don't sync if mantle isn't ready
    if (!mantle || !isReady) {
      // Still track pathname for when mantle becomes ready
      if (previousPathnameRef.current === null) {
        previousPathnameRef.current = pathname;
      }
      return;
    }

    // Skip initial mount
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }

    // Don't sync if navigation came from parent (prevents feedback loop)
    if (isNavigatingFromParentRef.current) {
      previousPathnameRef.current = pathname;
      return;
    }

    // If pathname changed, sync to parent (with debouncing)
    if (pathname !== previousPathnameRef.current) {
      // Clear any pending sync
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Debounce sync to prevent rapid-fire updates
      syncTimeoutRef.current = setTimeout(() => {
        if (mantle && mantle.setPath) {
          mantle.setPath(pathname);
        }
        previousPathnameRef.current = pathname;
      }, 50); // 50ms debounce
    }

    // Cleanup timeout on unmount or pathname change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, [pathname, mantle, isReady]);

  // This component doesn't render anything visible
  return null;
}

