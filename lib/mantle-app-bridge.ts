// TypeScript types for Mantle App Bridge API
// Based on the example at https://app.heymantle.com/app-bridge/example.html

export interface MantleAppBridge {
  // Connection status
  isConnected: boolean;

  // Session management
  getSession(): Promise<MantleSession | null>;

  // User management
  getUser(): Promise<MantleUser | null>;

  // PostMessage-based session and user requests
  requestSession(): void;
  requestUser(): void;

  // Navigation APIs
  navigate(url: string): void;
  openTab(url: string): void;
  openWindow(url: string, features?: string): void;

  // Toast notifications
  showToast(message: string, type?: "success" | "error"): void;

  // Loading states
  setLoading(loading: boolean): void;

  // Environment detection
  isEmbedded(): boolean;

  // Event listeners
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;

  // Organization ID and session getters (from app-bridge.js)
  currentOrganizationId: string | null;
  currentSession: MantleSession | string | null;
  currentUser: MantleUser | null;
  ready: boolean;
}

export interface MantleSession {
  id: string;
  userId: string;
  organizationId: string;
  accessToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface MantleUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  avatar?: string;
  role?: string;
}

export interface MantleAppBridgeConfig {
  appId: string;
  apiUrl?: string;
  debug?: boolean;
}

// Global window interface extension
declare global {
  interface Window {
    MantleAppBridge?: MantleAppBridge | (new () => MantleAppBridge);
  }
}

// Utility function to get the App Bridge instance
export function getMantleAppBridge(): MantleAppBridge | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.MantleAppBridge) {
    return null;
  }

  // Check if MantleAppBridge is a class constructor that needs to be instantiated
  if (
    typeof window.MantleAppBridge === "function" &&
    "prototype" in window.MantleAppBridge
  ) {
    try {
      return new (window.MantleAppBridge as new () => MantleAppBridge)();
    } catch (error) {
      // If instantiation fails, return null
      return null;
    }
  }

  return window.MantleAppBridge as MantleAppBridge;
}

// Utility function to check if the app is running in an iframe
export function isRunningInIframe(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const isInIframe = window.self !== window.top;
    return isInIframe;
  } catch (error) {
    // If we can't access window.top, we're likely in an iframe with cross-origin restrictions
    return true;
  }
}

// Utility function to wait for App Bridge to be available
export function waitForMantleAppBridge(timeout = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available"));
      return;
    }

    if (window.MantleAppBridge) {
      // Check if MantleAppBridge is a class constructor that needs to be instantiated
      if (
        typeof window.MantleAppBridge === "function" &&
        "prototype" in window.MantleAppBridge
      ) {
        try {
          const instance =
            new (window.MantleAppBridge as new () => MantleAppBridge)();
          resolve(instance);
        } catch (error) {
          // If instantiation fails, reject with error
          reject(new Error("Failed to instantiate MantleAppBridge"));
        }
      } else {
        resolve(window.MantleAppBridge as MantleAppBridge);
      }
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (window.MantleAppBridge) {
        clearInterval(checkInterval);
        // Check if MantleAppBridge is a class constructor that needs to be instantiated
        if (
          typeof window.MantleAppBridge === "function" &&
          "prototype" in window.MantleAppBridge
        ) {
          try {
            const instance =
              new (window.MantleAppBridge as new () => MantleAppBridge)();
            resolve(instance);
          } catch (error) {
            // If instantiation fails, reject with error
            reject(new Error("Failed to instantiate MantleAppBridge"));
          }
        } else {
          resolve(window.MantleAppBridge as MantleAppBridge);
        }
      } else if (elapsed > timeout) {
        clearInterval(checkInterval);
        reject(new Error("Mantle App Bridge not available after timeout"));
      }
    }, 100);
  });
}
