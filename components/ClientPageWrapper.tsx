"use client";

import AppBridgeAuth from "@/components/AppBridgeAuth";
import { MantleAppBridgeProvider } from "@/lib/mantle-app-bridge-context";
import { Page, VerticalStack } from "@heymantle/litho";
import { SessionProvider } from "next-auth/react";

interface ClientPageWrapperProps {
  children: React.ReactNode;
  hmacVerificationStatus: any;
}

export default function ClientPageWrapper({
  children,
  hmacVerificationStatus,
}: ClientPageWrapperProps) {
  return (
    <SessionProvider>
      <MantleAppBridgeProvider>
        <AppBridgeAuth
          onAuthSuccess={() => null}
          onAuthError={(error) =>
            console.error("App bridge authentication failed:", error)
          }
          fallback={
            <Page
              title="Access Restricted"
              subtitle="This page is only accessible through Mantle"
            >
              <VerticalStack gap="4">
                <div className="text-center p-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Direct Access Not Allowed
                  </h2>
                  <p className="text-gray-600 mb-4">
                    This page is designed to be accessed through Mantle's
                    platform only.
                  </p>
                  <p className="text-sm text-gray-500">
                    Please access this application through your Mantle
                    dashboard.
                  </p>
                </div>
              </VerticalStack>
            </Page>
          }
        >
          {children}
        </AppBridgeAuth>
      </MantleAppBridgeProvider>
    </SessionProvider>
  );
}
