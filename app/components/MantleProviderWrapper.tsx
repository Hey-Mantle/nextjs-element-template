"use client";

import { MantleProvider } from "@heymantle/react";

interface MantleProviderWrapperProps {
  children: React.ReactNode;
}

export default function MantleProviderWrapper({
  children,
}: MantleProviderWrapperProps) {
  return (
    <MantleProvider
      appId={process.env.NEXT_PUBLIC_MANTLE_APP_ID!}
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
