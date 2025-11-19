import { Layout, Page, VerticalStack } from "@heymantle/litho";
import NavMenuDocs from "@/components/docs/NavMenuDocs";

export default function NavMenuPage() {
  return (
    <Page title="ui-nav-menu" subtitle="Navigation menus">
      <Layout>
        <VerticalStack gap="6">
          <NavMenuDocs />
        </VerticalStack>
      </Layout>
    </Page>
  );
}

