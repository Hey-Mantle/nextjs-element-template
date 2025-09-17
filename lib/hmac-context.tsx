"use client";

import { createContext, ReactNode, useContext } from "react";

interface HmacVerificationStatus {
  isVerified: boolean;
  hasHmac: boolean;
  isHmacValid: boolean;
  isTimestampValid: boolean;
  timestampAge?: number;
  errorMessage?: string;
  requestParams?: Record<string, string>;
}

interface HmacContextType {
  hmacVerificationStatus: HmacVerificationStatus;
}

const HmacContext = createContext<HmacContextType | undefined>(undefined);

interface HmacProviderProps {
  children: ReactNode;
  hmacVerificationStatus: HmacVerificationStatus;
}

export function HmacProvider({
  children,
  hmacVerificationStatus,
}: HmacProviderProps) {
  return (
    <HmacContext.Provider value={{ hmacVerificationStatus }}>
      {children}
    </HmacContext.Provider>
  );
}

export function useHmac() {
  const context = useContext(HmacContext);
  if (context === undefined) {
    throw new Error("useHmac must be used within a HmacProvider");
  }
  return context;
}
