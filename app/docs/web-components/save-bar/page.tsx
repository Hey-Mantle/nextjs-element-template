"use client";

import AppPage from "@/components/AppPage";
import SaveBarDocs from "@/components/docs/SaveBarDocs";
import { useRouter } from "next/navigation";

export default function SaveBarPage() {
  const router = useRouter();

  return (
    <AppPage
      title="ui-save-bar"
      subtitle="Unsaved changes indicator"
      backAction={() => router.push("/")}
      fullWidth
    >
      <SaveBarDocs />
    </AppPage>
  );
}
