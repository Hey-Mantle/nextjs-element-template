"use client";

import { AppProvider } from "@heymantle/litho";
import { MantleAppTrackScript } from "./MantleAppTrackScript";

export default function ClientAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider
      darkModeAvailable
      darkModeStorageKey="nextjs-litho-dark-mode"
      embedded={false}
      onDarkModeChange={() => {}}
    >
      <MantleAppTrackScript />
      {children}
    </AppProvider>
  );
}
