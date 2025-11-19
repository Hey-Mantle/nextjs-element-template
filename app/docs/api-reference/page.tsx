import { Layout, Page, VerticalStack } from "@heymantle/litho";
import APIReferenceDocs from "@/components/docs/APIReferenceDocs";

export default function APIReferencePage() {
  return (
    <Page title="API Reference" subtitle="Complete reference for all App Bridge methods">
      <Layout>
        <VerticalStack gap="6">
          <APIReferenceDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

