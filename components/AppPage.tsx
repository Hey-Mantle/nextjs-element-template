"use client";

import { Page } from "@heymantle/litho";
import { ReactNode } from "react";

interface AppPageProps {
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  backAction?: (() => void) | string;
  children: ReactNode;
}

export default function AppPage({
  title = "",
  subtitle = "",
  fullWidth = false,
  backAction,
  children,
}: AppPageProps) {
  return (
    <Page title="" subtitle="" fullWidth={fullWidth} className="p-4">
      <ui-title-bar
        title={title}
        subtitle={subtitle}
        backAction={backAction}
      ></ui-title-bar>
      {children}
    </Page>
  );
}
