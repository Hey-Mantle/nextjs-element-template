"use client";

import CodeBlock from "@/components/CodeBlock";
import { Button, Card, Text, VerticalStack } from "@heymantle/litho";
import { useEffect, useRef, useState } from "react";

export default function ModalDocs() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [maxModalOpen, setMaxModalOpen] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [srcModalOpen, setSrcModalOpen] = useState(false);

  // Refs for modal elements to manually sync state
  const basicModalRef = useRef<HTMLElement>(null);
  const largeModalRef = useRef<HTMLElement>(null);
  const sizeModalRef = useRef<HTMLElement>(null);
  const maxModalRef = useRef<HTMLElement>(null);
  const formModalRef = useRef<HTMLElement>(null);
  const titleModalRef = useRef<HTMLElement>(null);
  const actionsModalRef = useRef<HTMLElement>(null);
  const srcModalRef = useRef<HTMLElement>(null);

  // Sync React state to custom element attributes
  useEffect(() => {
    const modal =
      basicModalRef.current || document.getElementById("basic-modal");
    if (modal) {
      if (basicModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!basicModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [basicModalOpen]);

  useEffect(() => {
    const modal =
      largeModalRef.current || document.getElementById("large-modal");
    if (modal) {
      if (largeModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!largeModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [largeModalOpen]);

  useEffect(() => {
    const modal = sizeModalRef.current || document.getElementById("size-modal");
    if (modal) {
      if (sizeModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!sizeModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [sizeModalOpen]);

  useEffect(() => {
    const modal = maxModalRef.current || document.getElementById("max-modal");
    if (modal) {
      if (maxModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!maxModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [maxModalOpen]);

  useEffect(() => {
    const modal = formModalRef.current || document.getElementById("form-modal");
    if (modal) {
      if (formModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!formModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [formModalOpen]);

  useEffect(() => {
    const modal =
      titleModalRef.current || document.getElementById("title-modal");
    if (modal) {
      if (titleModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!titleModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [titleModalOpen]);

  useEffect(() => {
    const modal =
      actionsModalRef.current || document.getElementById("actions-modal");
    if (modal) {
      if (actionsModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!actionsModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [actionsModalOpen]);

  useEffect(() => {
    const modal = srcModalRef.current || document.getElementById("src-modal");
    if (modal) {
      if (srcModalOpen && !modal.hasAttribute("open")) {
        modal.setAttribute("open", "");
      } else if (!srcModalOpen && modal.hasAttribute("open")) {
        modal.removeAttribute("open");
      }
    }
  }, [srcModalOpen]);

  // Listen for modal hide events
  useEffect(() => {
    const handleModalHide = (e: Event) => {
      const target = e.target as HTMLElement;
      const modalId = target.id;

      if (modalId === "basic-modal") setBasicModalOpen(false);
      else if (modalId === "large-modal") setLargeModalOpen(false);
      else if (modalId === "size-modal") setSizeModalOpen(false);
      else if (modalId === "max-modal") setMaxModalOpen(false);
      else if (modalId === "form-modal") setFormModalOpen(false);
      else if (modalId === "title-modal") setTitleModalOpen(false);
      else if (modalId === "actions-modal") setActionsModalOpen(false);
      else if (modalId === "src-modal") setSrcModalOpen(false);
    };

    document.addEventListener("modal:hide", handleModalHide);
    return () => {
      document.removeEventListener("modal:hide", handleModalHide);
    };
  }, []);

  return (
    <VerticalStack gap="6" className="w-full">
      {/* ui-modal element section */}
      <Card title="ui-modal element" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-modal</code> element is available for use in your
              app. It configures a Modal to display in the Mantle interface.
            </Text>
            <Text variant="bodyMd">
              The content you provide can be simple HTML elements or a{" "}
              <code>src</code> URL that will be loaded. When adding custom
              content, you can only provide a single parent element (commonly a{" "}
              <code>div</code> or <code>form</code>).
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  children
                </Text>
                <Text variant="bodySm" color="subdued">
                  HTMLCollection & UITitleBarAttributes
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  The content to display within a Modal. You can provide a
                  single HTML element with children and the ui-title-bar element
                  to configure the Modal title bar.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  id
                </Text>
                <Text variant="bodySm" color="subdued">
                  string
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  A unique identifier for the Modal
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  src
                </Text>
                <Text variant="bodySm" color="subdued">
                  string
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  The URL of the content to display within a Modal. If provided,
                  the Modal will display the content from the provided URL and
                  any children other than the ui-title-bar and ui-save-bar
                  elements will be ignored.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  variant
                </Text>
                <Text variant="bodySm" color="subdued">
                  'small' | 'base' | 'large' | 'max'
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Default: "base"
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  The size of the modal. Before the Modal is shown, this can be
                  changed to any of the provided values. After the Modal is
                  shown, this can only be changed between <code>small</code>,{" "}
                  <code>base</code>, and <code>large</code>.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  open
                </Text>
                <Text variant="bodySm" color="subdued">
                  boolean
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Boolean to control visibility. Set to <code>true</code> to
                  show the modal, <code>false</code> to hide it. In React, use
                  state to control this property.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" open={open}>
  <p>Message</p>
  <ui-title-bar title="Title">
    <button variant="primary">Label</button>
    <button onClick={() => setOpen(false)}>Label</button>
  </ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setBasicModalOpen(true)}>
              Open Basic Modal
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* ui-modal instance section */}
      <Card title="ui-modal instance" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodyMd">
              The <code>ui-modal</code> element provides instance properties and
              methods to control the Modal.
            </Text>

            <VerticalStack gap="4" className="mt-4">
              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  show()
                </Text>
                <Text variant="bodySm" color="subdued">
                  () =&gt; Promise&lt;void&gt;
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Shows the modal element
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  hide()
                </Text>
                <Text variant="bodySm" color="subdued">
                  () =&gt; Promise&lt;void&gt;
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Hides the modal element
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  toggle()
                </Text>
                <Text variant="bodySm" color="subdued">
                  () =&gt; Promise&lt;void&gt;
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Toggles the modal element between the showing and hidden
                  states
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  content
                </Text>
                <Text variant="bodySm" color="subdued">
                  HTMLElement
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  A getter/setter that is used to get the DOM content of the
                  modal element and update the content after the modal has been
                  opened.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  contentWindow
                </Text>
                <Text variant="bodySm" color="subdued">
                  Window | null
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  A getter that is used to get the Window object of the modal
                  iframe when the modal is used with a <code>src</code>{" "}
                  attribute. This can only be accessed when the modal is open,
                  so it is recommended to use <code>await modal.show()</code>{" "}
                  before accessing this property.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  addEventListener
                </Text>
                <Text variant="bodySm" color="subdued">
                  (type: "show" | "hide", listener:
                  EventListenerOrEventListenerObject) =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Add 'show' | 'hide' event listeners.
                </Text>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold" className="mb-2">
                  removeEventListener
                </Text>
                <Text variant="bodySm" color="subdued">
                  (type: "show" | "hide", listener:
                  EventListenerOrEventListenerObject) =&gt; void
                </Text>
                <Text variant="bodySm" color="subdued" className="mt-1">
                  Remove 'show' | 'hide' event listeners.
                </Text>
              </div>
            </VerticalStack>
          </VerticalStack>

          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`import { useRef } from 'react';

const modalRef = useRef<HTMLUIModalElement>(null);

const handleShow = async () => {
  await modalRef.current?.show();
};

const handleHide = async () => {
  await modalRef.current?.hide();
};

<ui-modal ref={modalRef} id="my-modal" variant="large">
  <p className="p-2 pl-4">Hello, World!</p>
</ui-modal>

<button onClick={handleShow}>Show Modal</button>
<button onClick={handleHide}>Hide Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setLargeModalOpen(true)}>Show Modal</Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Specifying a Modal size */}
      <Card title="Specifying a Modal size" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Use the <code>variant</code> attribute to control modal size:
              small, base, large, or max. The variant can be changed before the
              modal is shown, but after showing it can only be changed between
              small, base, and large.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" variant="large" open={open}>
  <p className="p-2 pl-4">Hello, World!</p>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setSizeModalOpen(true)}>
              Open Large Modal
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Opening a max size Modal */}
      <Card title="Opening a max size Modal" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Max variant modals take up most of the screen, perfect for complex
              forms or detailed views. Use <code>variant="max"</code> to create
              a full-screen modal experience.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" variant="max" open={open}>
  <div></div>
  <ui-title-bar>
    <button variant="primary">Primary action</button>
    <button onClick={() => setOpen(false)}>Secondary action</button>
  </ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setMaxModalOpen(true)}>
              Open Max Modal
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Using a form in a Modal */}
      <Card title="Using a form in a Modal" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Modals work great with forms. Use the <code>data-save-bar</code>{" "}
              attribute on your form to automatically integrate with the save
              bar component.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" variant="max" open={open}>
  <form data-save-bar>
    <label>
      Name:
      <input name="submitted-name" autocomplete="name" />
    </label>
    <button>Save</button>
  </form>
  <ui-title-bar>
    <button variant="primary">Save</button>
    <button onClick={() => setOpen(false)}>Cancel</button>
  </ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setFormModalOpen(true)}>
              Open Form Modal
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Specifying a title for the Modal */}
      <Card title="Specifying a title for the Modal" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Add a title bar to your modal using the <code>ui-title-bar</code>{" "}
              element. The title bar appears at the top of the modal and can
              include action buttons.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" open={open}>
  <p className="p-2 pl-4">Hello, World!</p>
  <ui-title-bar title="My Modal"></ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setTitleModalOpen(true)}>
              Open Modal with Title
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Adding primary and secondary actions */}
      <Card title="Adding primary and secondary actions to a Modal" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Add action buttons to the title bar. Use{" "}
              <code>variant="primary"</code> for the primary action button.
              Buttons can have onClick handlers or use the <code>onclick</code>{" "}
              attribute.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" open={open}>
  <p className="p-2 pl-4">Hello, World!</p>
  <ui-title-bar>
    <button variant="primary" onClick={() => console.log('Saving')}>Save</button>
    <button onClick={() => setOpen(false)}>Cancel</button>
  </ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setActionsModalOpen(true)}>
              Open Modal with Actions
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Using a src URL to load content */}
      <Card title="Using a src URL to load content" padded>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Load content from a URL using the <code>src</code> attribute. The
              content loads in an iframe. When using <code>src</code>, any
              children other than ui-title-bar and ui-save-bar are ignored.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
              {`const [open, setOpen] = useState(false);

<ui-modal id="my-modal" src="/my-route" variant="max" open={open}>
  <ui-title-bar title="Title">
    <button variant="primary">Label</button>
    <button onClick={() => setOpen(false)}>Label</button>
  </ui-title-bar>
</ui-modal>

<button onClick={() => setOpen(true)}>Open Modal</button>`}
            </CodeBlock>
            <Button onClick={() => setSrcModalOpen(true)}>
              Open Modal with src
            </Button>
          </VerticalStack>
        </div>
      </Card>

      {/* Live Examples */}
      <ui-modal ref={basicModalRef} id="basic-modal" open={basicModalOpen}>
        <div>
          <p className="p-2 pl-4">This is modal content</p>
        </div>
        <ui-title-bar title="Modal Title">
          <button variant="primary">Label</button>
          <button onClick={() => setBasicModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal ref={largeModalRef} id="large-modal" open={largeModalOpen}>
        <div>
          <p className="p-2 pl-4">Hello, World!</p>
        </div>
        <ui-title-bar title="Large Modal">
          <button onClick={() => setLargeModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal
        ref={sizeModalRef}
        id="size-modal"
        variant="large"
        open={sizeModalOpen}
      >
        <div>
          <p className="p-2 pl-4">Hello, World!</p>
        </div>
        <ui-title-bar title="Large Modal">
          <button onClick={() => setSizeModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal
        ref={maxModalRef}
        id="max-modal"
        variant="max"
        open={maxModalOpen}
      >
        <div>
          <p>
            Max variant modals take up most of the screen, perfect for complex
            forms or detailed views.
          </p>
        </div>
        <ui-title-bar title="Max Modal">
          <button variant="primary">Primary action</button>
          <button onClick={() => setMaxModalOpen(false)}>
            Secondary action
          </button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal
        ref={formModalRef}
        id="form-modal"
        variant="max"
        open={formModalOpen}
      >
        <form data-save-bar>
          <div style={{ padding: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Name:
              <input
                name="submitted-name"
                autoComplete="name"
                style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
              />
            </label>
            <button type="submit" style={{ marginTop: "1rem" }}>
              Save
            </button>
          </div>
        </form>
        <ui-title-bar title="Form Modal">
          <button variant="primary">Save</button>
          <button onClick={() => setFormModalOpen(false)}>Cancel</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal ref={titleModalRef} id="title-modal" open={titleModalOpen}>
        <div>
          <p className="p-2 pl-4">Hello, World!</p>
        </div>
        <ui-title-bar title="My Modal"></ui-title-bar>
      </ui-modal>

      <ui-modal
        ref={actionsModalRef}
        id="actions-modal"
        open={actionsModalOpen}
      >
        <div>
          <p className="p-2 pl-4">Hello, World!</p>
        </div>
        <ui-title-bar title="Modal with Actions">
          <button variant="primary" onClick={() => console.log("Saving")}>
            Save
          </button>
          <button onClick={() => setActionsModalOpen(false)}>Cancel</button>
        </ui-title-bar>
      </ui-modal>

      <ui-modal
        ref={srcModalRef}
        id="src-modal"
        src="/docs/web-components/modal"
        variant="max"
        open={srcModalOpen}
      >
        <ui-title-bar title="Modal with src">
          <button variant="primary">Label</button>
          <button onClick={() => setSrcModalOpen(false)}>Close</button>
        </ui-title-bar>
      </ui-modal>
    </VerticalStack>
  );
}
