"use client";
import { useMantle } from "@heymantle/react";

export const MantleAppTrackScript = () => {
  const { customer } = useMantle();
  const appToken = process.env.NEXT_PUBLIC_MANTLE_APP_TOKEN;

  // Don't render the script if appToken is missing
  if (!appToken) {
    console.warn(
      "NEXT_PUBLIC_MANTLE_APP_TOKEN is not set. Mantle tracking will be disabled."
    );
    return null;
  }

  return customer?.id ? (
    <script
      async
      src={`${
        process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com"
      }/js/mantle_apptrack.js?appToken=${appToken}&customerId=${customer.id}`}
    />
  ) : null;
};
