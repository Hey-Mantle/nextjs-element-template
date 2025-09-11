import {
  Card,
  HorizontalStack,
  Page,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { redirect } from "next/navigation";

interface EnvVarStatus {
  name: string;
  ok: boolean;
  value?: string;
}

export default function SetupPage() {
  // Server-side environment variable validation
  const requiredEnvVars = [
    "NEXT_PUBLIC_MANTLE_APP_ID",
    "NEXT_PUBLIC_MANTLE_API_URL",
    "MANTLE_APP_API_KEY",
    "MANTLE_ELEMENT_ID",
    "MANTLE_ELEMENT_SECRET",
  ];

  const statuses: EnvVarStatus[] = requiredEnvVars.map((varName) => {
    const value = process.env[varName];
    const isSet = value !== undefined && value !== "";

    return {
      name: varName,
      ok: isSet,
    };
  });

  const setup = statuses.every((status) => status.ok);

  // If setup is complete, redirect to home page
  if (setup) {
    redirect("/");
  }

  return (
    <Page
      title="Environment Setup"
      subtitle="Configure your environment variables"
    >
      <VerticalStack gap="6">
        <div className="text-center">
          <Text variant="headingXl" className="mb-4">
            Environment Setup Required
          </Text>
          <Text variant="bodyLg" color="subdued">
            Please configure the following environment variables to continue
          </Text>
        </div>

        <Card>
          <VerticalStack gap="4">
            <Text variant="headingMd">Environment Variable Status</Text>

            <VerticalStack gap="3">
              {statuses.map((status) => (
                <EnvironmentVariableStatus key={status.name} status={status} />
              ))}
            </VerticalStack>
          </VerticalStack>
        </Card>
      </VerticalStack>
    </Page>
  );
}

function EnvironmentVariableStatus({ status }: { status: EnvVarStatus }) {
  return (
    <HorizontalStack gap="3" align="center">
      <div
        className={`w-3 h-3 rounded-full ${
          status.ok ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <div className="flex-1">
        <Text variant="bodyMd" fontWeight="medium">
          {status.name}
        </Text>
      </div>
      <Text variant="bodySm" color={status.ok ? "success" : "critical"}>
        {status.ok ? "Set" : "Missing"}
      </Text>
    </HorizontalStack>
  );
}
