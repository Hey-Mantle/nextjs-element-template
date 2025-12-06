import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantleAppTrackScript } from "./components/MantleAppTrackScript";
import MantleProviderWrapper from "./components/MantleProviderWrapper";
import DocsNavigation from "@/components/DocsNavigation";
import AppBridgeNavigation from "@/components/AppBridgeNavigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mantle Element Documentation",
  description: "Live documentation and examples for Mantle Elements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mantleUrl =
    process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com";
  const appBridgeScriptUrl = `${mantleUrl}/app-bridge.js`;

  return (
    /* suppressHydrationWarning: App Bridge applies CSS variables to <html> on the client
       during initialization (before React hydrates). This is intentional and expected. */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script to apply dark mode immediately before React renders */}
        {/* This prevents FOUC (Flash of Unstyled Content) by applying theme state from localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check localStorage for dark mode preference (same key as parent app)
                  var darkModeStorage = localStorage.getItem('Mantle--DarkMode');
                  var isDarkMode = false;
                  
                  if (darkModeStorage === 'true') {
                    isDarkMode = true;
                  } else if (darkModeStorage === 'false') {
                    isDarkMode = false;
                  } else {
                    // Fallback to system preference if no stored preference
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      isDarkMode = true;
                    }
                  }
                  
                  // Apply dark mode immediately before React renders
                  if (isDarkMode) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.removeAttribute('data-theme');
                  }
                } catch (e) {
                  // Silently fail if localStorage is not available
                }
              })();
            `,
          }}
        />
        <script src={appBridgeScriptUrl} async defer />
      </head>
      <body className={inter.className}>
        <MantleProviderWrapper>
          <MantleAppTrackScript />
          <AppBridgeNavigation />
          <DocsNavigation />
          {children}
        </MantleProviderWrapper>
      </body>
    </html>
  );
}
