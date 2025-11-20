"use client";

import AppPage from "@/components/AppPage";
import ModalDocs from "@/components/docs/ModalDocs";
import { useRouter } from "next/navigation";

export default function ModalPage() {
  const router = useRouter();

  return (
    <AppPage
      title="ui-modal"
      subtitle="Display modals and dialogs"
      backAction={() => router.push("/")}
      fullWidth
    >
      <ModalDocs />
    </AppPage>
  );
}
