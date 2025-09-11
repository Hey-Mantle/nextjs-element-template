"use client";

import { AppProvider } from "@heymantle/litho";

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
      {children}
    </AppProvider>
  );
}
