"use client";

import AppPage from "@/components/AppPage";
import TitleBarDocs from "@/components/docs/TitleBarDocs";
import { useRouter } from "next/navigation";

export default function TitleBarPage() {
  const router = useRouter();

  return (
    <AppPage
      title="ui-title-bar"
      subtitle="Page title bars with actions"
      backAction={() => router.push("/")}
      fullWidth
    >
      <TitleBarDocs />
    </AppPage>
  );
}
