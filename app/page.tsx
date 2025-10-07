import AppBridgeDebug from "@/components/AppBridgeDebug";
import CustomerList from "@/components/CustomerList";
// EmbeddedAuth is now handled in ClientAppProvider
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { Layout, Page, VerticalStack } from "@heymantle/litho";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams as required by Next.js
  const resolvedSearchParams = await searchParams;

  // Convert searchParams to URLSearchParams for easier manipulation
  const urlSearchParams = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value[0]);
    }
  });

  // Check if embedded in iframe
  const isEmbedded = urlSearchParams.get("embedded") === "1";

  // Server-side environment variable validation
  const requiredEnvVars = [
    "NEXT_PUBLIC_MANTLE_APP_ID",
    "NEXT_PUBLIC_MANTLE_ELEMENT_ID",
    "NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE",
    "MANTLE_APP_API_KEY",
    "MANTLE_ELEMENT_SECRET",
    "AUTH_SECRET",
  ];

  const setup = requiredEnvVars.every((varName) => {
    const value = process.env[varName];
    return value !== undefined && value !== "";
  });

  // If setup is not complete, redirect to setup page
  if (!setup) {
    redirect("/setup");
  }

  // OAuth redirect logic
  let needsOAuthRedirect = false;
  let organizationId: string | undefined = undefined;

  // Check for organizationId parameter and determine if OAuth redirect is needed
  const requestOrganizationId = urlSearchParams.get("organizationId");

  if (requestOrganizationId) {
    const organization = await prisma.organization.findUnique({
      where: { mantleId: requestOrganizationId },
    });

    // Determine OAuth redirect based on organization existence and iframe status
    if (organization) {
      // Organization exists - check if we need OAuth redirect
      // If not in iframe (direct access to install URL), always kick off OAuth
      // to ensure the session is still valid in Mantle
      if (!isEmbedded) {
        console.log(
          "🏠 Home: Organization exists but not in iframe, OAuth redirect needed"
        );
        needsOAuthRedirect = true;
        organizationId = requestOrganizationId;
      } else {
        console.log(
          "🏠 Home: Organization exists and in iframe, no OAuth redirect needed"
        );
        // Still need to pass organizationId to client components even if not redirecting
        organizationId = requestOrganizationId;
      }
    } else {
      // Organization doesn't exist - always need OAuth redirect
      needsOAuthRedirect = true;
      organizationId = requestOrganizationId;
    }
  }

  return (
    <Page title="" subtitle="" fullWidth>
      <Layout>
        <VerticalStack gap="6">
          <PageHeader />
          <CustomerList />
        </VerticalStack>
      </Layout>
      <AppBridgeDebug />
    </Page>
  );
}
