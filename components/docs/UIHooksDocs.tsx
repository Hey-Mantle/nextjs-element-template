"use client";

import {
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function UIHooksDocs() {
  return (
    <VerticalStack gap="6">
      {/* Overview */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Overview</Text>
          <Text variant="bodyMd">
            UI Hooks allow you to add custom actions and links to Mantle pages. Custom Data
            Definitions let you store and retrieve custom data on Mantle resources (like tickets or
            customers).
          </Text>
        </VerticalStack>
      </Card>

      {/* UI Hooks */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">UI Hooks</Text>
          <Text variant="bodyMd">
            UI Hooks are defined in your Mantle app configuration and allow you to inject custom
            actions into Mantle pages. For example, you can add a button to ticket pages that opens
            your Element.
          </Text>

          <Text variant="bodyMd" fontWeight="semibold">
            Hook Definition Example
          </Text>

          <CodeBlock language="javascript">
{`// constants/ui_hooks.js
const HOOK_DEFINITIONS = {
  "ticket.actions": {
    requiredScope: "read:tickets",
    context: async (resourceId, organizationId, resourceType = "ticket") => {
      const { default: prisma } = await import("@/lib/prisma");
      
      const thread = await prisma.thread.findFirst({
        where: {
          id: resourceId,
          organizationId: organizationId,
          deletedAt: null,
        },
        select: {
          id: true,
          customData: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        ticket: thread,
        organization: { id: organizationId },
      };
    },
  },
};

module.exports = {
  HOOK_DEFINITIONS,
  getRequiredScopeForHook,
  getHookContextFunction,
  hasRequiredScopeForHook,
};`}
          </CodeBlock>

          <Text variant="bodyMd" fontWeight="semibold">
            Using UI Hooks in Your Element
          </Text>

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
        </VerticalStack>
      </Card>

      {/* Custom Data Definitions */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Custom Data Definitions</Text>
          <Text variant="bodyMd">
            Custom Data Definitions allow you to store structured data on Mantle resources. This
            data can be used in UI Hooks, reports, or your own Element pages.
          </Text>

          <Text variant="bodyMd" fontWeight="semibold">
            Data Types
          </Text>

          <CodeBlock language="javascript">
{`// constants/custom_data.js
const CustomDataTypeTypes = {
  STRING: "string",
  BOOLEAN: "boolean",
  URL: "url",
  DATE: "date",
  DATE_TIME: "date_time",
  JSON: "json",
  NUMBER_INTEGER: "number_integer",
  NUMBER_DECIMAL: "number_decimal",
};

const CustomDataOwnerTypes = {
  CUSTOMER: "customer",
  TICKET: "ticket",
};`}
          </CodeBlock>

          <Text variant="bodyMd" fontWeight="semibold">
            Creating Custom Data
          </Text>

          <CodeBlock language="typescript">
{`// Store custom data on a ticket
const response = await mantle.authenticatedFetch('/api/custom-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resourceId: ticketId,
    resourceType: 'ticket',
    namespace: 'my-app',
    key: 'priority-score',
    value: 85,
    dataType: 'number_integer',
  }),
});`}
          </CodeBlock>

          <Text variant="bodyMd" fontWeight="semibold">
            Retrieving Custom Data
          </Text>

          <CodeBlock language="typescript">
{`// In your UI Hook context function
const customDataRecords = await prisma.customData.findMany({
  where: {
    threadId: thread.id,
    organizationId: organizationId,
  },
  select: {
    customDataDefinition: {
      select: {
        namespace: true,
        key: true,
      },
    },
    valueString: true,
    valueBoolean: true,
    valueNumberInteger: true,
    // ... other value fields
  },
});

// Build nested lookup object
const customDataLookup = buildCustomDataLookup(customDataRecords);
// Returns: { 'my-app': { 'priority-score': 85 } }`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Integration Example */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Complete Integration Example</Text>
          <Text variant="bodyMd">
            Here's how UI Hooks and Custom Data work together:
          </Text>

          <CodeBlock language="typescript">
{`// 1. Define a UI Hook that uses custom data
const HOOK_DEFINITIONS = {
  "ticket.actions": {
    requiredScope: "read:tickets",
    context: async (resourceId, organizationId) => {
      // Fetch ticket
      const ticket = await getTicket(resourceId, organizationId);
      
      // Fetch custom data
      const customData = await getCustomData(ticket.id, organizationId);
      
      return {
        ticket: {
          ...ticket,
          customData: customData, // Include custom data in context
        },
        organization: { id: organizationId },
      };
    },
  },
};

// 2. In your Element, access the hook context
export default function TicketActions({ searchParams }) {
  const resourceId = searchParams.get('resourceId');
  
  // Fetch ticket with custom data from your API
  const { ticket } = useSWR(
    \`/api/tickets/\${resourceId}\`,
    fetcher
  );
  
  // Use custom data in your UI
  const priorityScore = ticket?.customData?.['my-app']?.['priority-score'];
  
  return (
    <div>
      <h1>Ticket Actions</h1>
      {priorityScore && (
        <p>Priority Score: {priorityScore}</p>
      )}
    </div>
  );
}`}
          </CodeBlock>
        </VerticalStack>
      </Card>

      {/* Best Practices */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Best Practices</Text>
          <VerticalStack gap="2">
            <Text variant="bodyMd">
              • Use namespaces to organize custom data (e.g., "my-app", "analytics")
            </Text>
            <Text variant="bodyMd">
              • Define required scopes for UI Hooks to ensure proper permissions
            </Text>
            <Text variant="bodyMd">
              • Cache custom data lookups for performance
            </Text>
            <Text variant="bodyMd">
              • Use appropriate data types for your custom data values
            </Text>
            <Text variant="bodyMd">
              • Keep hook context functions fast - they run on every hook render
            </Text>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}

