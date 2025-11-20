"use client";

import AppPage from "@/components/AppPage";
import APIReferenceDocs from "@/components/docs/APIReferenceDocs";
import { useRouter } from "next/navigation";

export default function APIReferencePage() {
  const router = useRouter();

  return (
    <AppPage
      title="API Reference"
      subtitle="Complete reference for all App Bridge methods"
      backAction={() => router.push("/")}
      fullWidth
    >
      <APIReferenceDocs />
    </AppPage>
  );
}
