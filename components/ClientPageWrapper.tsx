"use client";

import EmbeddedAuth from "@/components/EmbeddedAuth";
import { MantleAppBridgeProvider } from "@/lib/mantle-app-bridge-context";

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
  needsOAuthRedirect = false,
  organizationId,
}: ClientPageWrapperProps) {
  return (
    <MantleAppBridgeProvider>
      <EmbeddedAuth
        needsOAuthRedirect={needsOAuthRedirect}
        organizationId={organizationId}
      >
        {children}
      </EmbeddedAuth>
    </MantleAppBridgeProvider>
  );
}
