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

      // Listen for events from the app bridge instance
      if (typeof window !== "undefined") {
        // Set a timeout to handle cases where the ready event never fires
        let timeoutCleared = false;
        const timeout = setTimeout(() => {
          if (!timeoutCleared) {
            setConnectionError(
              "App Bridge ready event not received. Make sure the app is running in an iframe within the Mantle platform."
            );
            setIsConnected(false);
            setIsConnecting(false);
          }
        }, 5000);

        // Listen for the mantle:app-bridge postMessage events
        const messageHandler = (event: MessageEvent) => {
          const { type, session, user, error, organizationId } =
            event.data || {};

          switch (type) {
            case "mantle:app-bridge:ready":
              // Clear the timeout immediately when ready event is received
              timeoutCleared = true;
              clearTimeout(timeout);

              // Initialize with the data sent from the parent frame
              if (session) {
                setSession(session);
                setSessionError(null);
                setIsSessionLoading(false);
              }

              handleAppBridgeReady();
              break;

            case "mantle:app-bridge:sessionResponse":
              if (error) {
                setSessionError(error);
                setSession(null);
              } else if (session) {
                setSession(session);
                setSessionError(null);
              }
              setIsSessionLoading(false);
              break;

            case "mantle:app-bridge:userResponse":
              if (error) {
                setUserError(error);
                setUser(null);
              } else if (user) {
                setUser(user);
                setUserError(null);
              }
              setIsUserLoading(false);
              break;

            case "mantle:app-bridge:error":
              handleAppBridgeError(event.data);
              break;
          }
        };

        window.addEventListener("message", messageHandler);

        // Clean up timeout when component unmounts or connection succeeds
        const cleanup = () => {
          timeoutCleared = true;
          clearTimeout(timeout);
          window.removeEventListener("message", messageHandler);
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
      if (typeof appBridge.requestSession === "function") {
        // Use the postMessage-based method
        appBridge.requestSession();
        // Response will be handled by the messageHandler
      } else {
        setSessionError("requestSession method not available");
        setSession(null);
        setIsSessionLoading(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request session";
      setSessionError(errorMessage);
      setSession(null);
      setIsSessionLoading(false);
    }
  }, [appBridge, isConnected]);

  // Refresh user
  const refreshUser = useCallback(async () => {
    if (!appBridge || !isConnected) return;

    setIsUserLoading(true);
    setUserError(null);

    try {
      if (typeof appBridge.requestUser === "function") {
        // Use the postMessage-based method
        appBridge.requestUser();
        // Response will be handled by the messageHandler
      } else {
        setUserError("requestUser method not available");
        setUser(null);
        setIsUserLoading(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request user";
      setUserError(errorMessage);
      setUser(null);
      setIsUserLoading(false);
    }
  }, [appBridge, isConnected]);

  // Auto-connect on mount (only in browser)
  useEffect(() => {
    if (typeof window !== "undefined") {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

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
