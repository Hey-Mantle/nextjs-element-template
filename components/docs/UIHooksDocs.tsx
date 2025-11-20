"use client";

import CodeBlock from "@/components/CodeBlock";
import { Card, Stack, Text } from "@heymantle/litho";

export default function UIHooksDocs() {
  return (
    <Stack gap="6" className="w-full">
      {/* Configuration Block */}
      <Card title="UI Hooks Configuration" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              UI Hooks are configured in your Element's configuration JSON. Each
              hook defines when and how it appears in Mantle's UI. Hooks can be
              actions (modals) or links, and can include conditions based on
              custom data or resource properties.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="json">
              {`{
  "ui_hooks": [
    {
      "hook": "ticket.actions",
      "type": "action",
      "config": {
        "src": "/modal-new-issue?ticketId={{ ticket.id }}",
        "size": "large",
        "label": "Create Github Issue",
        "title": "Create Github Issue"
      },
      "condition": "ticket.customData.github.issueUrl == null"
    },
    {
      "hook": "ticket.actions",
      "type": "link",
      "config": {
        "url": "{{ ticket.customData.github.issueUrl }}",
        "label": "View Github Issue"
      },
      "condition": "ticket.customData.github.issueUrl != null"
    }
  ]
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Hook Types */}
      <Card title="Hook Types" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              UI Hooks support two types: <strong>action</strong> (opens a
              modal) and <strong>link</strong> (navigates to a URL). Actions can
              specify modal size and title, while links can open in new tabs or
              navigate in place.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="json">
              {`// Action hook - opens a modal
{
  "hook": "ticket.actions",
  "type": "action",
  "config": {
    "src": "/modal-page?ticketId={{ ticket.id }}",
    "size": "large",  // "small", "medium", "large", or "full"
    "label": "Button Label",
    "title": "Modal Title"
  }
}

// Link hook - navigates to a URL
{
  "hook": "ticket.actions",
  "type": "link",
  "config": {
    "url": "{{ ticket.customData.github.issueUrl }}",
    "label": "View Issue",
    "external": true  // Optional: open in new tab
  }
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Hook Context and Template Variables */}
      <Card title="Template Variables" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Use template variables in your hook configuration to access
              resource data. Variables use double curly braces and can reference
              properties from the hook context, including custom data.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="json">
              {`// Access resource properties
"src": "/page?ticketId={{ ticket.id }}"
"url": "{{ customer.email }}"

// Access custom data
"url": "{{ ticket.customData.github.issueUrl }}"
"condition": "ticket.customData.github.issueUrl != null"

// Access nested properties
"src": "/page?customerId={{ ticket.customer.id }}"

// Common template variables:
// - ticket.id, ticket.customData.*
// - customer.id, customer.email, customer.name
// - organization.id`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Conditions */}
      <Card title="Conditions" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Conditions control when hooks are displayed. Use comparison
              operators (==, !=, &lt;, &gt;) and logical operators (&&, ||) to
              create conditional logic based on resource properties or custom
              data values.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="json">
              {`// Show hook only when custom data doesn't exist
{
  "condition": "ticket.customData.github.issueUrl == null"
}

// Show hook only when custom data exists
{
  "condition": "ticket.customData.github.issueUrl != null"
}

// Multiple conditions
{
  "condition": "ticket.status == 'open' && ticket.priority == 'high'"
}

// No condition - always show
{
  // Omit "condition" property
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Using UI Hooks in Your Element */}
      <Card title="Using UI Hooks in Your Element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              In your Element, you can access hook context via URL params. When
              Mantle opens your Element from a hook, it passes resourceId,
              resourceType, and organizationId.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="tsx">
              {`// In your Element, you can access hook context via URL params
// When Mantle opens your Element from a hook, it passes:
// - resourceId: The ID of the resource (ticket, customer, etc.)
// - resourceType: The type of resource
// - organizationId: The organization ID

export default function HookPage({ searchParams }) {
  const resourceId = searchParams.get('resourceId');
  const resourceType = searchParams.get('resourceType');
  const organizationId = searchParams.get('organizationId');

  // Use these to fetch and display relevant data
  return (
    <div>
      <h1>Hook Page</h1>
      <p>Resource ID: {resourceId}</p>
      <p>Resource Type: {resourceType}</p>
    </div>
  );
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>
    </Stack>
  );
}
