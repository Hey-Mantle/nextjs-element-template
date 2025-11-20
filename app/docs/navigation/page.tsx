"use client";

import AppPage from "@/components/AppPage";
import NavigationDocs from "@/components/docs/NavigationDocs";
import { useRouter } from "next/navigation";

export default function NavigationPage() {
  const router = useRouter();

  return (
    <AppPage
      title="Navigation"
      subtitle="Keep URLs synchronized with Mantle"
      backAction={() => router.push("/")}
      fullWidth
    >
      <NavigationDocs />
    </AppPage>
  );
}
