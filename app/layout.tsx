import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppBridgeNavigation from "../components/AppBridgeNavigation";
import { SWRConfigProvider } from "../components/SWRConfigProvider";
import ConditionalModalWrapper from "./components/ConditionalModalWrapper";
import { MantleAppTrackScript } from "./components/MantleAppTrackScript";
import MantleProviderWrapper from "./components/MantleProviderWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mantle Element Starter",
  description: "Starter template for Mantle Elements",
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
                  var darkModeStorage = localStorage.getItem('Mantle--DarkMode');
                  var isDarkMode = false;

                  if (darkModeStorage === 'true') {
                    isDarkMode = true;
                  } else if (darkModeStorage === 'false') {
                    isDarkMode = false;
                  } else {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      isDarkMode = true;
                    }
                  }

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
      {/* suppressHydrationWarning: Script applies attributes/classes that may differ between server and client */}
      <body className={inter.className} suppressHydrationWarning>
        <MantleProviderWrapper>
          <SWRConfigProvider>
            <MantleAppTrackScript />
            <AppBridgeNavigation />
            <ConditionalModalWrapper>{children}</ConditionalModalWrapper>
          </SWRConfigProvider>
        </MantleProviderWrapper>
      </body>
    </html>
  );
}
