"use client";

import {
  Card,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function CustomDataDocs() {
  return (
    <VerticalStack gap="6" className="w-full">
      {/* Overview */}
      <Card title="Overview" padded>
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
              Fetch custom data from the database and build a nested lookup object for easy access in your Element or UI Hooks.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="typescript">
{`// Fetch custom data records
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

      {/* Using Custom Data in UI Hooks */}
      <Card title="Using Custom Data in UI Hooks" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Include custom data in your UI Hook context to make it available in your Element pages.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="typescript">
{`// In your UI Hook context function
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
};`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Using Custom Data in Elements */}
      <Card title="Using Custom Data in Elements" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              Access custom data in your Element pages through the hook context or by fetching it directly from your API.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="tsx">
{`// In your Element, access custom data from hook context
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
            • Choose appropriate data types for your custom data values
          </Text>
          <Text variant="bodyMd">
            • Cache custom data lookups for performance
          </Text>
          <Text variant="bodyMd">
            • Use consistent naming conventions for keys within namespaces
          </Text>
          <Text variant="bodyMd">
            • Consider data retention policies for custom data
          </Text>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}

