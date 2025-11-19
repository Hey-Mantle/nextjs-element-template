import { Page } from "@heymantle/litho";
import SaveBarDocs from "@/components/docs/SaveBarDocs";

export default function SaveBarPage() {
  return (
    <Page title="ui-save-bar" subtitle="Unsaved changes indicator" fullWidth>
      <SaveBarDocs />
    </Page>
  );
}

