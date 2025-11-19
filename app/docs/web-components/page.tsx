import { Page } from "@heymantle/litho";
import WebComponentsDocs from "@/components/docs/WebComponentsDocs";

export default function WebComponentsPage() {
  return (
    <Page title="Web Components" subtitle="UI components for Mantle Elements" fullWidth>
      <WebComponentsDocs />
    </Page>
  );
}

