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
  description: string;
}

export default function SetupPage() {
  // Server-side environment variable validation
  const requiredEnvVars = [
    {
      name: "NEXT_PUBLIC_MANTLE_APP_ID",
      description:
        "Your Mantle App ID, found in your API Settings for the Mantle App",
    },
    {
      name: "NEXT_PUBLIC_MANTLE_ELEMENT_ID",
      description: "Your Mantle Element ID found in your Element settings",
    },
    {
      name: "NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE",
      description: "Your Mantle Element Handle found in your Element settings",
    },
    {
      name: "MANTLE_APP_API_KEY",
      description:
        "Your Mantle App API Key secret found in your API Settings for the Mantle App",
    },
    {
      name: "MANTLE_ELEMENT_SECRET",
      description: "Your Mantle Element Secret found in your Element settings",
    },
    {
      name: "AUTH_SECRET",
      description:
        "Generated for your environment by running `npx auth secret`",
    },
  ];

  const statuses: EnvVarStatus[] = requiredEnvVars.map((envVar) => {
    const value = process.env[envVar.name];
    const isSet = value !== undefined && value !== "";

    return {
      name: envVar.name,
      ok: isSet,
      description: envVar.description,
    };
  });

  const setup = statuses.every((status) => status.ok);

  // If setup is complete, redirect to home page
  if (setup) {
    redirect("/");
  }

  return (
    <Page
      title="Setup Required!"
      subtitle="Configure your environment variables to continue"
    >
      <VerticalStack gap="6">
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
    <VerticalStack gap="2">
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
      <div className="ml-6">
        <Text variant="bodySm" color="subdued">
          {status.description}
        </Text>
      </div>
    </VerticalStack>
  );
}
