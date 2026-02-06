"use client";
import { createContext, useContext, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
  isLoading,
  error,
  refetch,
}: {
  children: ReactNode;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}) {
  return (
    <UserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
