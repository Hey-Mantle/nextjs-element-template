import { Layout, Page, VerticalStack } from "@heymantle/litho";
import ModalDocs from "@/components/docs/ModalDocs";

export default function ModalPage() {
  return (
    <Page title="ui-modal" subtitle="Display modals and dialogs">
      <Layout>
        <VerticalStack gap="6">
          <ModalDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

