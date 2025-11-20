"use client";

import AppPage from "@/components/AppPage";
import ToastDocs from "@/components/docs/ToastDocs";
import { useRouter } from "next/navigation";

export default function ToastPage() {
  const router = useRouter();

  return (
    <AppPage
      title="Toast Notifications"
      subtitle="Show success and error messages"
      backAction={() => router.push("/")}
      fullWidth
    >
      <ToastDocs />
    </AppPage>
  );
}
