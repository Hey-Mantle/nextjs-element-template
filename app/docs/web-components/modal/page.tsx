import { Page } from "@heymantle/litho";
import ModalDocs from "@/components/docs/ModalDocs";

export default function ModalPage() {
  return (
    <Page title="ui-modal" subtitle="Display modals and dialogs" fullWidth>
      <ModalDocs />
    </Page>
  );
}
