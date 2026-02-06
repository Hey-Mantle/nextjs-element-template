"use client";
import { createContext, useContext, ReactNode } from "react";

export interface Organization {
  id: string;
  mantleId: string;
  name: string;
  accessToken: string;
  apiToken: string | null;
}

interface OrganizationContextType {
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
  organization,
  isLoading,
  error,
}: {
  children: ReactNode;
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <OrganizationContext.Provider value={{ organization, isLoading, error }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
