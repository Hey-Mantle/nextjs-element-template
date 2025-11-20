"use client";

import AppPage from "@/components/AppPage";
import UIHooksDocs from "@/components/docs/UIHooksDocs";
import { useRouter } from "next/navigation";

export default function UIHooksPage() {
  const router = useRouter();

  return (
    <AppPage
      title="UI Hooks"
      subtitle="Add custom actions and links to Mantle pages"
      backAction={() => router.push("/")}
      fullWidth
    >
      <UIHooksDocs />
    </AppPage>
  );
}
