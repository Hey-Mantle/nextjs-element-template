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
      <a href="/docs/authentication" active={isActive("/docs/authentication")}>
        Authentication
      </a>
      <a href="/docs/web-components" active={isActive("/docs/web-components")}>
        Web Components
      </a>
      <a href="/docs/web-components/modal" active={isActive("/docs/web-components/modal")}>
        • ui-modal
      </a>
      <a href="/docs/web-components/title-bar" active={isActive("/docs/web-components/title-bar")}>
        • ui-title-bar
      </a>
      <a href="/docs/web-components/save-bar" active={isActive("/docs/web-components/save-bar")}>
        • ui-save-bar
      </a>
      <a href="/docs/web-components/nav-menu" active={isActive("/docs/web-components/nav-menu")}>
        • ui-nav-menu
      </a>
      <a href="/docs/navigation" active={isActive("/docs/navigation")}>
        Navigation
      </a>
      <a href="/docs/toasts" active={isActive("/docs/toasts")}>
        Toast Notifications
      </a>
      <a href="/docs/ui-hooks" active={isActive("/docs/ui-hooks")}>
        UI Hooks & Custom Data
      </a>
      <a href="/docs/api-reference" active={isActive("/docs/api-reference")}>
        API Reference
      </a>
    </ui-nav-menu>
  );
}
