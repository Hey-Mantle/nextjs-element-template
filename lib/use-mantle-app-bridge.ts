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
  session: MantleSession | string | null;
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
  const [session, setSession] = useState<MantleSession | string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState<MantleUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // App Bridge instance
  const [appBridge, setAppBridge] = useState<MantleAppBridge | null>(null);

  // Connect to App Bridge
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const bridge = await waitForMantleAppBridge();
      setAppBridge(bridge);

      // Flag to track if ready event was received
      let readyEventReceived = false;

      // Set up event listeners using App Bridge's event system
      const handleReady = (data: {
        session?: MantleSession | string;
        organizationId?: string;
      }) => {
        readyEventReceived = true;
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);

        // Initialize with session data if provided
        if (data.session) {
          setSession(data.session);
          setSessionError(null);
        }
      };

      const handleSession = (data: {
        session: MantleSession | string;
        organizationId?: string;
      }) => {
        setSession(data.session);
        setSessionError(null);
        setIsSessionLoading(false);
      };

      const handleSessionError = (error: string) => {
        setSessionError(error);
        setSession(null);
        setIsSessionLoading(false);
      };

      const handleUser = (userData: MantleUser) => {
        setUser(userData);
        setUserError(null);
        setIsUserLoading(false);
      };

      const handleConnectionError = (error: any) => {
        setConnectionError("App Bridge connection failed");
        setIsConnected(false);
        setIsConnecting(false);
      };

      // Register event listeners using App Bridge API
      bridge.on("ready", handleReady);
      bridge.on("session", handleSession);
      bridge.on("sessionError", handleSessionError);
      bridge.on("user", handleUser);
      bridge.on("error", handleConnectionError);

      // Set a timeout to handle cases where the ready event never fires
      const timeout = setTimeout(() => {
        if (!readyEventReceived) {
          setConnectionError(
            "App Bridge ready event not received. Make sure the app is running in an iframe within the Mantle platform."
          );
          setIsConnected(false);
          setIsConnecting(false);
        }
      }, 5000);

      // Store cleanup function for later use
      (bridge as any)._cleanup = () => {
        clearTimeout(timeout);
        bridge.off("ready", handleReady);
        bridge.off("session", handleSession);
        bridge.off("sessionError", handleSessionError);
        bridge.off("user", handleUser);
        bridge.off("error", handleConnectionError);
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect to App Bridge";
      console.error("App Bridge connection error:", errorMessage);
      setConnectionError(errorMessage);
      setIsConnected(false);
      setAppBridge(null);
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!appBridge || !isConnected) return;

    setIsSessionLoading(true);
    setSessionError(null);

    try {
      // Use App Bridge's requestSession method
      appBridge.requestSession();
      // Response will be handled by the 'session' or 'sessionError' event listeners
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
      // Use App Bridge's requestUser method
      appBridge.requestUser();
      // Response will be handled by the 'user' event listener
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

  // Auto-fetch session and user when connected (only if we don't have them yet)
  useEffect(() => {
    if (isConnected && appBridge && !session && !isSessionLoading) {
      refreshSession();
      refreshUser();
    }
  }, [
    isConnected,
    appBridge,
    session,
    isSessionLoading,
    refreshSession,
    refreshUser,
  ]);

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
