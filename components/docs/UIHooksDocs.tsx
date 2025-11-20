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
          UI Hooks allow you to add custom actions and links to Mantle pages. They provide a way
          to extend Mantle's interface with your own functionality and integrate your Element into
          Mantle's workflow.
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

      {/* Hook Types */}
      <Card title="Hook Types" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <VerticalStack gap="4">
            <Text variant="bodySm" color="subdued">
              UI Hooks can be registered for different contexts in Mantle. Common hook types include actions, links, and custom UI elements that appear on resource pages.
            </Text>
          </VerticalStack>
          <VerticalStack gap="4">
            <CodeBlock language="javascript">
{`// Example hook types
// ticket.actions - Actions that appear on ticket pages
// customer.actions - Actions that appear on customer pages
// ticket.links - Links that appear in ticket navigation
// customer.links - Links that appear in customer navigation`}
            </CodeBlock>
          </VerticalStack>
        </div>
      </Card>

      {/* Best Practices */}
      <Card title="Best Practices" padded>
        <VerticalStack gap="2">
          <Text variant="bodyMd">
            • Define required scopes for UI Hooks to ensure proper permissions
          </Text>
          <Text variant="bodyMd">
            • Keep hook context functions fast - they run on every hook render
          </Text>
          <Text variant="bodyMd">
            • Cache expensive operations in your context functions
          </Text>
          <Text variant="bodyMd">
            • Use descriptive hook names that clearly indicate their purpose
          </Text>
          <Text variant="bodyMd">
            • Consider performance implications when fetching data in context functions
          </Text>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
