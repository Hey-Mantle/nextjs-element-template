"use client";

import AppPage from "@/components/AppPage";
import CustomDataDocs from "@/components/docs/CustomDataDocs";
import { useRouter } from "next/navigation";

export default function CustomDataPage() {
  const router = useRouter();

  return (
    <AppPage
      title="Custom Data"
      subtitle="Store and retrieve custom data on Mantle resources"
      backAction={() => router.push("/")}
      fullWidth
    >
      <CustomDataDocs />
    </AppPage>
  );
}
