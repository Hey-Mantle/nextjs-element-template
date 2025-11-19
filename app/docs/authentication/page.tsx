import { Layout, Page, VerticalStack } from "@heymantle/litho";
import AuthenticationDocs from "@/components/docs/AuthenticationDocs";

export default function AuthenticationPage() {
  return (
    <Page title="Authentication" subtitle="Learn how to authenticate requests with Mantle">
      <Layout>
        <VerticalStack gap="6">
          <AuthenticationDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

