"use client";

import { AppProvider } from "@heymantle/litho";
import { MantleAppTrackScript } from "./MantleAppTrackScript";
import MantleProviderWrapper from "./MantleProviderWrapper";

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
      <MantleProviderWrapper>
        <MantleAppTrackScript />
        {children}
      </MantleProviderWrapper>
    </AppProvider>
  );
}
