"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MantleAppBridge,
  MantleSession,
  MantleUser,
  waitForMantleAppBridge,
} from "./mantle-app-bridge";

export interface UseMantleAppBridgeReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;

  // Session state
  session: MantleSession | null;
  isSessionLoading: boolean;
  sessionError: string | null;

  // User state
  user: MantleUser | null;

  isUserLoading: boolean;
  userError: string | null;

  // Actions
  refreshSession: () => Promise<void>;
  refreshUser: () => Promise<void>;
  connect: () => Promise<void>;

  // App Bridge instance
  appBridge: MantleAppBridge | null;
}

export function useMantleAppBridge(): UseMantleAppBridgeReturn {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Session state
  const [session, setSession] = useState<MantleSession | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState<MantleUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // App Bridge instance
  const [appBridge, setAppBridge] = useState<any | null>(null);

  // Connect to App Bridge
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const bridge = await waitForMantleAppBridge();
      setAppBridge(bridge);

      // Set up event listeners for App Bridge connection
      const handleAppBridgeReady = () => {
        setIsConnected(true);
        setConnectionError(null);
        setIsConnecting(false);
      };

      const handleAppBridgeError = (error: any) => {
        setConnectionError("App Bridge connection failed");
        setIsConnected(false);
        setIsConnecting(false);
      };

      // Listen for the mantle:app-bridge:ready event
      if (typeof window !== "undefined") {
        window.addEventListener(
          "mantle:app-bridge:ready",
          handleAppBridgeReady
        );
        window.addEventListener(
          "mantle:app-bridge:error",
          handleAppBridgeError
        );

        // Set a timeout to handle cases where the ready event never fires
        const timeout = setTimeout(() => {
          if (!isConnected) {
            setConnectionError(
              "App Bridge ready event not received. Make sure the app is running in an iframe within the Mantle platform."
            );
            setIsConnected(false);
            setIsConnecting(false);
          }
        }, 5000);

        // Clean up timeout when component unmounts or connection succeeds
        const cleanup = () => {
          clearTimeout(timeout);
          window.removeEventListener(
            "mantle:app-bridge:ready",
            handleAppBridgeReady
          );
          window.removeEventListener(
            "mantle:app-bridge:error",
            handleAppBridgeError
          );
        };

        // Store cleanup function for later use
        (bridge as any)._cleanup = cleanup;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to App Bridge";
      setConnectionError(errorMessage);
      setIsConnected(false);
      setAppBridge(null);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!appBridge || !isConnected) return;

    setIsSessionLoading(true);
    setSessionError(null);

    try {
      if (typeof appBridge.getSession === "function") {
        const sessionData = await appBridge.getSession();
        setSession(sessionData);
      } else {
        setSessionError("getSession method not available");
        setSession(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch session";
      setSessionError(errorMessage);
      setSession(null);
    } finally {
      setIsSessionLoading(false);
    }
  }, [appBridge, isConnected]);

  // Refresh user
  const refreshUser = useCallback(async () => {
    if (!appBridge || !isConnected) return;

    setIsUserLoading(true);
    setUserError(null);

    try {
      if (typeof appBridge.getUser === "function") {
        const userData = await appBridge.getUser();
        setUser(userData);
      } else {
        setUserError("getUser method not available");
        setUser(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      setUserError(errorMessage);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, [appBridge, isConnected]);

  // Auto-connect on mount (only in browser)
  useEffect(() => {
    if (typeof window !== "undefined") {
      connect();
    }
  }, [connect]);

  // Auto-fetch session and user when connected
  useEffect(() => {
    if (isConnected && appBridge) {
      refreshSession();
      refreshUser();
    }
  }, [isConnected, appBridge, refreshSession, refreshUser]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (appBridge && (appBridge as any)._cleanup) {
        (appBridge as any)._cleanup();
      }
    };
  }, [appBridge]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,

    // Session state
    session,
    isSessionLoading,
    sessionError,

    // User state
    user,
    isUserLoading,
    userError,

    // Actions
    refreshSession,
    refreshUser,
    connect,

    // App Bridge instance
    appBridge,
  };
}
