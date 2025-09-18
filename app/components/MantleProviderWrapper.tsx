"use client";

import { MantleProvider } from "@heymantle/react";

interface MantleProviderWrapperProps {
  children: React.ReactNode;
}

export default function MantleProviderWrapper({
  children,
}: MantleProviderWrapperProps) {
  // Check if required environment variables are set
  const appId = process.env.NEXT_PUBLIC_MANTLE_APP_ID;
  // If environment variables are not set, render children without MantleProvider
  // This prevents the "MantleClient appId is required" error
  if (!appId) {
    return <>{children}</>;
  }

  return (
    <MantleProvider
      appId={appId}
      apiUrl={
        process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
        "https://appapi.heymantle.com/v1"
      }
      customerApiToken="" // Will be set after OAuth completion
    >
      {children}
    </MantleProvider>
  );
}
