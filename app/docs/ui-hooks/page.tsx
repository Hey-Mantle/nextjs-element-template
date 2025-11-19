import { Layout, Page, VerticalStack } from "@heymantle/litho";
import UIHooksDocs from "@/components/docs/UIHooksDocs";

export default function UIHooksPage() {
  return (
    <Page title="UI Hooks & Custom Data" subtitle="Extend Mantle pages with custom actions and data">
      <Layout>
        <VerticalStack gap="6">
          <UIHooksDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

