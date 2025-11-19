import { Layout, Page, VerticalStack } from "@heymantle/litho";
import WebComponentsDocs from "@/components/docs/WebComponentsDocs";

export default function WebComponentsPage() {
  return (
    <Page title="Web Components" subtitle="UI components for Mantle Elements">
      <Layout>
        <VerticalStack gap="6">
          <WebComponentsDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

