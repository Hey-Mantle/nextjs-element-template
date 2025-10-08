"use client";

import AccessTokenManager from "@/components/AccessTokenManager";
import CustomerList from "@/components/CustomerList";
import { useState } from "react";

export default function HomePageContent() {
  const [hasAccessToken, setHasAccessToken] = useState<boolean>(false);

  const handleTokenStatusChange = (hasToken: boolean) => {
    setHasAccessToken(hasToken);
  };

  return (
    <>
      <AccessTokenManager onTokenStatusChange={handleTokenStatusChange} />
      <CustomerList hasAccessToken={hasAccessToken} />
    </>
  );
}
