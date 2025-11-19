import { Layout, Page, VerticalStack } from "@heymantle/litho";
import NavigationDocs from "@/components/docs/NavigationDocs";

export default function NavigationPage() {
  return (
    <Page title="Navigation" subtitle="Keep URLs synchronized with Mantle">
      <Layout>
        <VerticalStack gap="6">
          <NavigationDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

