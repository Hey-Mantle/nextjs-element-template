import { Page } from "@heymantle/litho";
import TitleBarDocs from "@/components/docs/TitleBarDocs";

export default function TitleBarPage() {
  return (
    <Page title="ui-title-bar" subtitle="Page title bars with actions" fullWidth>
      <TitleBarDocs />
    </Page>
  );
}

