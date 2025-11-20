"use client";

import CodeBlock from "@/components/CodeBlock";
import { Card, Stack, Text } from "@heymantle/litho";

export default function CustomDataDocs() {
  return (
    <Stack gap="6" className="w-full">
      {/* Configuration Block */}
      <Card title="Custom Data Definitions Configuration" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Define your custom data schema in your Element's configuration
              JSON. Each definition specifies the key, type, namespace, and
              which resource type it applies to. These definitions help Mantle
              understand and validate your custom data structure.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="json">
              {`{
  "custom_data_definitions": [
    {
      "key": "issueUrl",
      "name": "GitHub Issue URL",
      "type": "url",
      "namespace": "github",
      "ownerType": "ticket",
      "description": "The GitHub issue URL for this support thread"
    }
  ]
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Data Types */}
      <Card title="Data Types" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Custom data supports multiple data types including strings,
              booleans, numbers, dates, and JSON. Choose the appropriate type
              for your data.
            </Text>
          </Stack>
          <Stack gap="4">
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
          </Stack>
        </div>
      </Card>

      {/* Creating Custom Data */}
      <Card title="Storing Custom Data via Core API" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Store custom data values on Mantle resources using the Core API
              PUT endpoint. The key must be in "namespace.key" format (e.g.,
              "github.issueUrl"). The API automatically determines the data type
              from the value you provide.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="typescript">
              {`// Store custom data on a ticket using Core API
const response = await mantle.authenticatedFetch('/api/core/v1/custom_data', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resourceId: ticketId,
    resourceType: 'ticket',
    key: 'github.issueUrl',  // namespace.key format
    value: 'https://github.com/owner/repo/issues/123'
  }),
});

// Response format
{
  "customData": {
    "resourceId": "ticket-id",
    "resourceType": "ticket",
    "key": "github.issueUrl",
    "value": "https://github.com/owner/repo/issues/123"
  }
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Retrieving Custom Data via API */}
      <Card title="Retrieving Custom Data via Core API" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="4">
            <Text variant="bodySm" color="subdued">
              Retrieve custom data values using the Core API GET endpoint. You
              can filter by namespace, or by both namespace and key. All custom
              data for a resource is returned if no filters are provided.
            </Text>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="typescript">
              {`// Get all custom data for a resource
const response = await mantle.authenticatedFetch(
  '/api/core/v1/custom_data?resourceId=ticket-id&resourceType=ticket'
);

// Get custom data filtered by namespace
const response = await mantle.authenticatedFetch(
  '/api/core/v1/custom_data?resourceId=ticket-id&resourceType=ticket&namespace=github'
);

// Get specific custom data value
const response = await mantle.authenticatedFetch(
  '/api/core/v1/custom_data?resourceId=ticket-id&resourceType=ticket&namespace=github&key=issueUrl'
);

// Response format
{
  "customData": [
    {
      "resourceId": "ticket-id",
      "resourceType": "ticket",
      "key": "github.issueUrl",
      "value": "https://github.com/owner/repo/issues/123"
    }
  ]
}`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>
    </Stack>
  );
}
