"use client";

import AppPage from "@/components/AppPage";
import AuthenticationDocs from "@/components/docs/AuthenticationDocs";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const router = useRouter();

  return (
    <AppPage
      title="Authentication"
      subtitle="Learn how to authenticate requests with Mantle"
      backAction={() => router.push("/")}
      fullWidth
    >
      <AuthenticationDocs />
    </AppPage>
  );
}
