"use client";

import {
  useSharedAuth,
  useSharedMantleAppBridge,
} from "@heymantle/app-bridge-react";
import { useEffect, useState } from "react";

export default function AppBridgeDebug() {
  const appBridge = useSharedMantleAppBridge();
  const { user, isLoading, error } = useSharedAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      // App Bridge info
      appBridgeReady: appBridge?.ready,
      appBridgeConnected: appBridge?.isConnected,
      currentSession: appBridge?.currentSession,
      currentUser: appBridge?.currentUser,
      currentOrganizationId: appBridge?.currentOrganizationId,

      // Auth info
      authUser: user,
      authLoading: isLoading,
      authError: error,

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
  }, [appBridge, user, isLoading, error]);

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
