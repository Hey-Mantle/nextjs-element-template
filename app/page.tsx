import { Page, Text, VerticalStack } from "@heymantle/litho";
import { redirect } from "next/navigation";

export default function Home() {
  // Server-side environment variable validation
  const requiredEnvVars = [
    "NEXT_PUBLIC_MANTLE_APP_ID",
    "NEXT_PUBLIC_MANTLE_API_URL",
    "MANTLE_APP_API_KEY",
    "MANTLE_ELEMENT_ID",
    "MANTLE_ELEMENT_SECRET",
  ];

  const setup = requiredEnvVars.every((varName) => {
    const value = process.env[varName];
    return value !== undefined && value !== "";
  });

  // If setup is not complete, redirect to setup page
  if (!setup) {
    redirect("/setup");
  }

  // If setup is complete, render the main application
  return (
    <Page title="Typography Test" subtitle="Testing Litho typography variants">
      <VerticalStack gap="6">
        <div className="text-center">
          <Text variant="headingXl" className="mb-4">
            Typography Test
          </Text>
          <Text variant="bodyLg" color="subdued">
            Testing different Litho typography variants
          </Text>
        </div>

        <VerticalStack gap="4">
          <Text variant="headingXl">Heading XL - This should be large</Text>
          <Text variant="headingLg">
            Heading LG - This should be medium-large
          </Text>
          <Text variant="headingMd">Heading MD - This should be medium</Text>
          <Text variant="bodyLg">Body LG - This should be medium</Text>
          <Text variant="bodyMd">Body MD - This should be base size</Text>
          <Text variant="bodySm">Body SM - This should be small</Text>
        </VerticalStack>
      </VerticalStack>
    </Page>
  );
}
