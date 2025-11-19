import { Page } from "@heymantle/litho";
import ToastDocs from "@/components/docs/ToastDocs";

export default function ToastPage() {
  return (
    <Page title="Toast Notifications" subtitle="Show success and error messages" fullWidth>
      <ToastDocs />
    </Page>
  );
}

