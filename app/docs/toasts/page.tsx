import { Layout, Page, VerticalStack } from "@heymantle/litho";
import ToastDocs from "@/components/docs/ToastDocs";

export default function ToastPage() {
  return (
    <Page title="Toast Notifications" subtitle="Show success and error messages">
      <Layout>
        <VerticalStack gap="6">
          <ToastDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

