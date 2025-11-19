"use client";

import {
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function UIHooksDocs() {
  return (
    <VerticalStack gap="6" className="w-full">
      {/* Overview */}
      <Card title="Overview" padded>
        <Text variant="bodyMd">
          UI Hooks allow you to add custom actions and links to Mantle pages. Custom Data
          Definitions let you store and retrieve custom data on Mantle resources (like tickets or
          customers).
        </Text>
      </Card>

      {/* Hook Definition Example */}
      <Card title="Hook Definition Example" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Define hooks in your Mantle app configuration. Each hook requires a scope and a context function that returns data for the hook.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
          </VerticalStack>
        </div>
      </Card>

      {/* Using UI Hooks in Your Element */}
      <Card title="Using UI Hooks in Your Element" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              In your Element, you can access hook context via URL params. When Mantle opens your Element from a hook, it passes resourceId, resourceType, and organizationId.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
        </div>
      </Card>

      {/* Custom Data Definitions */}
      <Card title="Custom Data Definitions" padded>
        <Text variant="bodyMd">
          Custom Data Definitions allow you to store structured data on Mantle resources. This
          data can be used in UI Hooks, reports, or your own Element pages.
        </Text>
      </Card>

      {/* Data Types */}
      <Card title="Data Types" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Custom data supports multiple data types including strings, booleans, numbers, dates, and JSON. Choose the appropriate type for your data.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
          </VerticalStack>
        </div>
      </Card>

      {/* Creating Custom Data */}
      <Card title="Creating Custom Data" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Store custom data on Mantle resources using authenticated API requests. Use namespaces to organize your data and prevent conflicts.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
          </VerticalStack>
        </div>
      </Card>

      {/* Retrieving Custom Data */}
      <Card title="Retrieving Custom Data" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              In your UI Hook context function, fetch custom data from the database and build a nested lookup object for easy access in your Element.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
        </div>
      </Card>

      {/* Integration Example */}
      <Card title="Complete Integration Example" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Here's how UI Hooks and Custom Data work together. Define a hook that includes custom data in its context, then use that data in your Element.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
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
        </div>
      </Card>

      {/* Best Practices */}
      <Card title="Best Practices" padded>
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
      </Card>
    </VerticalStack>
  );
}
