"use client";

import { useUser } from "@heymantle/app-bridge-react";

export const MantleAppTrackScript = () => {
  const { user } = useUser();

  // For now, we'll use the user ID as a fallback since we can't access customer data
  // due to CORS issues with the customer API token approach
  const customerId = user?.id;

  return customerId ? (
    <script
      async
      src={`${
        process.env.NEXT_PUBLIC_MANTLE_URL ?? "https://app.heymantle.com"
      }/js/mantle_apptrack.js?appToken=${
        process.env.NEXT_PUBLIC_MANTLE_APP_TOKEN
      }&customerId=${customerId}`}
    />
  ) : null;
};
