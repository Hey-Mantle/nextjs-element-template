"use client";

import EmbeddedAuth from "@/components/EmbeddedAuth";
import { HmacProvider } from "@/lib/hmac-context";
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
  hmacVerificationStatus,
  needsOAuthRedirect = false,
  organizationId,
}: ClientPageWrapperProps) {
  return (
    <MantleAppBridgeProvider>
      <HmacProvider hmacVerificationStatus={hmacVerificationStatus}>
        <EmbeddedAuth
          needsOAuthRedirect={needsOAuthRedirect}
          organizationId={organizationId}
        >
          {children}
        </EmbeddedAuth>
      </HmacProvider>
    </MantleAppBridgeProvider>
  );
}
