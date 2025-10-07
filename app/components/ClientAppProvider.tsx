"use client";

import EmbeddedAuth from "@/components/EmbeddedAuth";
import { AppBridgeProvider } from "@heymantle/app-bridge-react";
import { AppProvider } from "@heymantle/litho";
import { MantleAppTrackScript } from "./MantleAppTrackScript";

export default function ClientAppProvider({
  children,
  mantleUrl,
}: {
  children: React.ReactNode;
  mantleUrl: string;
}) {
  return (
    <AppProvider
      darkModeAvailable
      darkModeStorageKey="nextjs-litho-dark-mode"
      embedded={true}
      onDarkModeChange={() => {}}
    >
      <AppBridgeProvider
        config={
          {
            appId:
              process.env.NEXT_PUBLIC_MANTLE_APP_ID || "mantle-element-starter",
            apiUrl:
              process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
              "https://appapi.heymantle.com/v1",
            mantleUrl: mantleUrl,
          } as any
        }
      >
        <MantleAppTrackScript />
        <EmbeddedAuth>{children}</EmbeddedAuth>
      </AppBridgeProvider>
    </AppProvider>
  );
}
