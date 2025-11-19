import { Layout, Page, VerticalStack } from "@heymantle/litho";
import TitleBarDocs from "@/components/docs/TitleBarDocs";

export default function TitleBarPage() {
  return (
    <Page title="ui-title-bar" subtitle="Page title bars with actions">
      <Layout>
        <VerticalStack gap="6">
          <TitleBarDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

