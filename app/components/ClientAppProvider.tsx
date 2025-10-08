"use client";

import { AppProvider } from "@heymantle/litho";
import { MantleAppTrackScript } from "./MantleAppTrackScript";

export default function ClientAppProvider({
  children,
  mantleUrl,
}: {
  children: React.ReactNode;
  mantleUrl: string;
}) {
  // Check if all required environment variables are set
  const requiredEnvVars = [
    "NEXT_PUBLIC_MANTLE_APP_ID",
    "NEXT_PUBLIC_MANTLE_ELEMENT_ID",
    "NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE",
    "MANTLE_APP_API_KEY",
    "MANTLE_ELEMENT_SECRET",
    "AUTH_SECRET",
  ];

  const isSetupComplete = requiredEnvVars.every((varName) => {
    const value = process.env[varName];
    return value !== undefined && value !== "";
  });

  // If setup is not complete, render children without AppBridge providers
  // This prevents the context error on the setup page
  if (!isSetupComplete) {
    return (
      <AppProvider
        darkModeAvailable
        darkModeStorageKey="nextjs-litho-dark-mode"
        embedded={true}
        onDarkModeChange={() => {}}
      >
        {children}
      </AppProvider>
    );
  }

  return (
    <AppProvider
      darkModeAvailable
      darkModeStorageKey="nextjs-litho-dark-mode"
      embedded={true}
      onDarkModeChange={() => {}}
    >
      <MantleAppTrackScript />
      {children}
    </AppProvider>
  );
}
