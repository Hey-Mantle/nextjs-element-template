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
 */
export default function AppBridgeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { mantle } = useAppBridge();
  const previousPathnameRef = useRef<string | null>(null);
  const isNavigatingFromParentRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setupNavigation = () => {
      if ((window as any).mantle) {
        const handleRedirectAction = (data: {
          path: string;
          method: string;
          fullUrl?: string;
        }) => {
          const normalizedPath = data.path?.split("?")[0].split("#")[0];
          const currentPath = pathname || window.location.pathname;

          if (normalizedPath && normalizedPath !== currentPath) {
            isNavigatingFromParentRef.current = true;

            try {
              router.push(data.path);
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

        (window as any).mantle.subscribeToRedirect(handleRedirectAction);
        return true;
      }
      return false;
    };

    if (!setupNavigation()) {
      const checkForAppBridge = setInterval(() => {
        if (setupNavigation()) {
          clearInterval(checkForAppBridge);
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(checkForAppBridge);
      }, 10000);

      return () => {
        clearInterval(checkForAppBridge);
        clearTimeout(timeout);
      };
    }

    return () => {};
  }, [router, pathname]);

  useEffect(() => {
    const handleMantleNavigate = (event: CustomEvent) => {
      const { path } = event.detail || {};

      if (!path) return;

      const normalizedPath = path.split("?")[0].split("#")[0];
      const currentPath = pathname || window.location.pathname;

      if (
        normalizedPath !== currentPath &&
        !isNavigatingFromParentRef.current
      ) {
        event.preventDefault();

        isNavigatingFromParentRef.current = true;

        try {
          router.push(path);
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

  useEffect(() => {
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }

    if (isNavigatingFromParentRef.current) {
      previousPathnameRef.current = pathname;
      return;
    }

    if (pathname !== previousPathnameRef.current) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        const m = mantle as any;
        if (m && m.setPath && pathname) {
          m.setPath(pathname);
        }
        previousPathnameRef.current = pathname;
      }, 50);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, [pathname, mantle]);

  /* eslint-disable @next/next/no-html-link-for-pages */
  return (
    <ui-nav-menu id="default-nav">
      <a href="/" rel="home">
        Home
      </a>
      <a href="/settings">Settings</a>
    </ui-nav-menu>
  );
  /* eslint-enable @next/next/no-html-link-for-pages */
}
