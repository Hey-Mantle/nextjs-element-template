"use client";

import EmbeddedAuth from "@/components/EmbeddedAuth";
import { MantleAppBridgeProvider } from "@/lib/mantle-app-bridge-context";
import { SessionProvider } from "next-auth/react";

interface ClientPageWrapperProps {
  children: React.ReactNode;
  hmacVerificationStatus: any;
}

/**
 * Simple wrapper for embedded iframe apps.
 * Handles authentication via app bridge session tokens.
 */
export default function ClientPageWrapper({
  children,
  hmacVerificationStatus,
}: ClientPageWrapperProps) {
  return (
    <SessionProvider>
      <MantleAppBridgeProvider>
        <EmbeddedAuth>{children}</EmbeddedAuth>
      </MantleAppBridgeProvider>
    </SessionProvider>
  );
}
