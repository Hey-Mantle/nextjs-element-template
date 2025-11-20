"use client";

import { usePathname } from "next/navigation";

export default function DocsNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <ui-nav-menu id="docs-nav">
      <a href="/" rel="home">
        Dashboard
      </a>
      <a
        href="/docs/authentication"
        {...(isActive("/docs/authentication") && { active: "" })}
      >
        Authentication
      </a>
      <a
        href="/docs/web-components/modal"
        {...(isActive("/docs/web-components/modal") && { active: "" })}
      >
        ui-modal
      </a>
      <a
        href="/docs/web-components/title-bar"
        {...(isActive("/docs/web-components/title-bar") && { active: "" })}
      >
        ui-title-bar
      </a>
      <a
        href="/docs/web-components/save-bar"
        {...(isActive("/docs/web-components/save-bar") && { active: "" })}
      >
        ui-save-bar
      </a>
      <a
        href="/docs/web-components/nav-menu"
        {...(isActive("/docs/web-components/nav-menu") && { active: "" })}
      >
        ui-nav-menu
      </a>
      <a
        href="/docs/navigation"
        {...(isActive("/docs/navigation") && { active: "" })}
      >
        Navigation
      </a>
      <a href="/docs/toasts" {...(isActive("/docs/toasts") && { active: "" })}>
        Toast Notifications
      </a>
      <a
        href="/docs/ui-hooks"
        {...(isActive("/docs/ui-hooks") && { active: "" })}
      >
        UI Hooks
      </a>
      <a
        href="/docs/custom-data"
        {...(isActive("/docs/custom-data") && { active: "" })}
      >
        Custom Data
      </a>
      <a
        href="/docs/api-reference"
        {...(isActive("/docs/api-reference") && { active: "" })}
      >
        App Bridge API Reference
      </a>
      <a
        href="https://coreapi.heymantle.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Core API Reference
      </a>
    </ui-nav-menu>
  );
}
