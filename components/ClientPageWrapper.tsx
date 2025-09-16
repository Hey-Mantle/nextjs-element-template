"use client";

import EmbeddedAuth from "@/components/EmbeddedAuth";
import { MantleAppBridgeProvider } from "@/lib/mantle-app-bridge-context";
import { SessionProvider } from "next-auth/react";

interface ClientPageWrapperProps {
  children: React.ReactNode;
  hmacVerificationStatus: any;
  needsOAuthRedirect?: boolean;
  organizationId?: string;
}

/**
 * Simple wrapper for embedded iframe apps.
 * Handles authentication via app bridge session tokens.
 */
export default function ClientPageWrapper({
  children,
  hmacVerificationStatus,
  needsOAuthRedirect = false,
  organizationId,
}: ClientPageWrapperProps) {
  console.log(
    "ClientPageWrapper - hmacVerificationStatus:",
    hmacVerificationStatus
  );
  console.log("ClientPageWrapper - needsOAuthRedirect:", needsOAuthRedirect);
  console.log("ClientPageWrapper - organizationId:", organizationId);

  return (
    <SessionProvider>
      <MantleAppBridgeProvider>
        <EmbeddedAuth
          needsOAuthRedirect={needsOAuthRedirect}
          organizationId={organizationId}
        >
          {children}
        </EmbeddedAuth>
      </MantleAppBridgeProvider>
    </SessionProvider>
  );
}
