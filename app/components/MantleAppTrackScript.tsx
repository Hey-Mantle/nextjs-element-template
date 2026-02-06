"use client";
import { useMantle } from "@heymantle/react";
import { useEffect } from "react";

declare global {
  interface Window {
    MantleAppTrack?: {
      getInstance: () => {
        startTracking: (options: {
          appToken: string;
          customerId: string;
          identifyUserContact?: boolean;
        }) => void;
      };
    };
  }
}

export const MantleAppTrackScript = () => {
  const { customer } = useMantle();
  const appToken = process.env.NEXT_PUBLIC_MANTLE_APP_TOKEN;
  const mantleApiUrl =
    process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
    "https://appapi.heymantle.com";

  useEffect(() => {
    if (!appToken || !customer?.id) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="mantle_apptrack.js"]'
    );
    if (existingScript) {
      if (window.MantleAppTrack) {
        window.MantleAppTrack.getInstance().startTracking({
          appToken,
          customerId: customer.id,
          identifyUserContact: false,
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `${mantleApiUrl}/js/mantle_apptrack.js?skipStart=1`;
    script.async = true;
    script.onload = () => {
      if (window.MantleAppTrack) {
        window.MantleAppTrack.getInstance().startTracking({
          appToken,
          customerId: customer.id,
          identifyUserContact: false,
        });
      }
    };
    document.head.appendChild(script);
  }, [appToken, customer?.id, mantleApiUrl]);

  if (!appToken) {
    console.warn(
      "NEXT_PUBLIC_MANTLE_APP_TOKEN is not set. Mantle tracking will be disabled."
    );
  }

  return null;
};
