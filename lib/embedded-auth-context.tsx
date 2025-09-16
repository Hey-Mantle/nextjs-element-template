"use client";

import { Organization, User } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";

interface EmbeddedAuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const EmbeddedAuthContext = createContext<EmbeddedAuthContextType | undefined>(
  undefined
);

interface EmbeddedAuthProviderProps {
  children: ReactNode;
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function EmbeddedAuthProvider({
  children,
  user,
  organization,
  isAuthenticated,
  isLoading,
  error,
}: EmbeddedAuthProviderProps) {
  const value: EmbeddedAuthContextType = {
    user,
    organization,
    isAuthenticated,
    isLoading,
    error,
  };

  return (
    <EmbeddedAuthContext.Provider value={value}>
      {children}
    </EmbeddedAuthContext.Provider>
  );
}

export function useEmbeddedAuth(): EmbeddedAuthContextType {
  const context = useContext(EmbeddedAuthContext);
  if (context === undefined) {
    throw new Error(
      "useEmbeddedAuth must be used within an EmbeddedAuthProvider"
    );
  }
  return context;
}
