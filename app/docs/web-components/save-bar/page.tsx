import { Layout, Page, VerticalStack } from "@heymantle/litho";
import SaveBarDocs from "@/components/docs/SaveBarDocs";

export default function SaveBarPage() {
  return (
    <Page title="ui-save-bar" subtitle="Unsaved changes indicator">
      <Layout>
        <VerticalStack gap="6">
          <SaveBarDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

