"use client";

import {
  useAppBridge,
  useOrganization,
  useUser,
} from "@heymantle/app-bridge-react";
import { useEffect, useState } from "react";

export default function AppBridgeDebug() {
  const {
    mantle,
    isReady,
    isConnecting,
    error: appBridgeError,
  } = useAppBridge();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const {
    organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganization();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      // App Bridge connection
      appBridgeReady: isReady,
      appBridgeConnected: mantle?.isConnected,
      appBridgeError: appBridgeError,

      // Session data (from App Bridge)
      currentSession: mantle?.currentSession,
      currentOrganizationId: mantle?.currentOrganizationId,

      // User data (from hooks)
      user: user,
      userLoading: userLoading,
      userError: userError,

      // Organization data (from hooks)
      organization: organization,
      organizationLoading: orgLoading,
      organizationError: orgError,

      // Environment info
      isInIframe:
        typeof window !== "undefined" ? window.self !== window.top : false,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "N/A",

      // Global objects
      mantleAppBridgeGlobal:
        typeof window !== "undefined" ? !!window.MantleAppBridge : false,
    };

    setDebugInfo(info);
  }, [
    mantle,
    isReady,
    appBridgeError,
    user,
    userLoading,
    userError,
    organization,
    orgLoading,
    orgError,
  ]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        fontSize: "12px",
        overflow: "auto",
        zIndex: 9999,
      }}
    >
      <h3>App Bridge Debug</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}
