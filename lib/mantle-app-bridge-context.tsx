"use client";

import React, { createContext, useContext } from "react";
import {
  useMantleAppBridge,
  UseMantleAppBridgeReturn,
} from "./use-mantle-app-bridge";

interface MantleAppBridgeContextType extends UseMantleAppBridgeReturn {}

const MantleAppBridgeContext = createContext<MantleAppBridgeContextType | null>(
  null
);

interface MantleAppBridgeProviderProps {
  children: React.ReactNode;
}

export function MantleAppBridgeProvider({
  children,
}: MantleAppBridgeProviderProps) {
  const appBridge = useMantleAppBridge();

  return (
    <MantleAppBridgeContext.Provider value={appBridge}>
      {children}
    </MantleAppBridgeContext.Provider>
  );
}

export function useSharedMantleAppBridge(): MantleAppBridgeContextType {
  const context = useContext(MantleAppBridgeContext);
  if (!context) {
    throw new Error(
      "useSharedMantleAppBridge must be used within a MantleAppBridgeProvider"
    );
  }
  return context;
}
