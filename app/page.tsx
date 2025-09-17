import ClientPageWrapper from "@/components/ClientPageWrapper";
import CustomerList from "@/components/CustomerList";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { Layout, Page, Spinner, Text, VerticalStack } from "@heymantle/litho";
import crypto from "crypto";
import { redirect } from "next/navigation";

interface HmacVerificationResult {
  isValid: boolean;
  isHmacValid: boolean;
  isTimestampValid: boolean;
  timestampAge?: number;
  errorMessage?: string;
}

async function verifyMantleRequest(
  searchParams: URLSearchParams
): Promise<HmacVerificationResult> {
  const hmac = searchParams.get("hmac");
  const timestamp = searchParams.get("timestamp");

  if (!hmac || !timestamp) {
    console.error("Missing required parameters: hmac or timestamp");
    return {
      isValid: false,
      isHmacValid: false,
      isTimestampValid: false,
      errorMessage: "Missing required parameters: hmac or timestamp",
    };
  }

  // Validate timestamp (optional: check if request is not too old)
  const requestTime = parseInt(timestamp, 10);
  const currentTime = Date.now();
  const timeDifference = Math.abs(currentTime - requestTime);
  const isTimestampValid = timeDifference <= 300000; // 5 minutes

  // Get the client secret from environment variables
  const clientSecret = process.env.MANTLE_ELEMENT_SECRET;
  if (!clientSecret) {
    console.error("MANTLE_ELEMENT_SECRET not found in environment variables");
    return {
      isValid: false,
      isHmacValid: false,
      isTimestampValid: false,
      errorMessage: "MANTLE_ELEMENT_SECRET not found in environment variables",
    };
  }

  // Remove hmac parameter from the query string
  const paramsWithoutHmac = new URLSearchParams(searchParams);
  paramsWithoutHmac.delete("hmac");

  // Sort parameters alphabetically and create query string
  const sortedParams = Array.from(paramsWithoutHmac.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // Create the message to sign: timestamp.sortedParams (matching server-side format)
  const messageToSign = `${timestamp}.${sortedParams}`;

  // Create HMAC-SHA256 hash
  const calculatedHmac = crypto
    .createHmac("sha256", clientSecret)
    .update(messageToSign)
    .digest("hex");

  // Use secure comparison to prevent timing attacks
  const isHmacValid = crypto.timingSafeEqual(
    Buffer.from(hmac, "hex"),
    Buffer.from(calculatedHmac, "hex")
  );

  // Overall validity: both HMAC and timestamp must be valid
  const isValid = isHmacValid && isTimestampValid;

  return {
    isValid,
    isHmacValid,
    isTimestampValid,
    timestampAge: timeDifference,
    errorMessage: !isHmacValid
      ? "HMAC signature verification failed"
      : !isTimestampValid
      ? "Request timestamp is too old"
      : undefined,
  };
}

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

  // Check for HMAC parameter - indicates an initial install request from Mantle
  const hmac = urlSearchParams.get("hmac");
  // Note: We'll let the client-side determine if we're actually in an iframe using appBridge.isInIframe()
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

  // Track HMAC verification status for UI display
  let hmacVerificationStatus = {
    isVerified: false,
    hasHmac: !!hmac,
    isHmacValid: false,
    isTimestampValid: false,
    timestampAge: undefined as number | undefined,
    errorMessage: undefined as string | undefined,
    requestParams: Object.fromEntries(urlSearchParams.entries()),
  };

  // Separate OAuth redirect logic
  let needsOAuthRedirect = false;
  let organizationId: string | undefined = undefined;

  // Handle HMAC verification and redirects
  let shouldRedirect = false;
  let redirectUrl = "";

  if (hmac) {
    // Verify HMAC signature
    const verificationResult = await verifyMantleRequest(urlSearchParams);

    // Update verification status with detailed results
    hmacVerificationStatus.isVerified = verificationResult.isValid;
    hmacVerificationStatus.isHmacValid = verificationResult.isHmacValid;
    hmacVerificationStatus.isTimestampValid =
      verificationResult.isTimestampValid;
    hmacVerificationStatus.timestampAge = verificationResult.timestampAge;
    hmacVerificationStatus.errorMessage = verificationResult.errorMessage;

    if (!verificationResult.isValid) {
      // You might want to redirect to an error page or return an error response
      // For now, we'll continue but log the issue
    } else {
      const requestOrganizationId = urlSearchParams.get("organizationId");
      const organization = await prisma.organization.findUnique({
        where: { mantleId: requestOrganizationId || "" },
      });

      // Determine OAuth redirect based on organization existence and iframe status
      if (organization) {
        // Organization exists - check if we need OAuth redirect
        // If not in iframe (direct access to install URL), always kick off OAuth
        // to ensure the session is still valid in Mantle
        if (!isEmbedded) {
          needsOAuthRedirect = true;
          organizationId = requestOrganizationId || "";
        } else {
          // Still need to pass organizationId to client components even if not redirecting
          organizationId = requestOrganizationId || "";
        }
      } else {
        // Organization doesn't exist - always need OAuth redirect
        needsOAuthRedirect = true;
        organizationId = requestOrganizationId || "";
      }
    }
  }

  // Perform redirect outside of try-catch to avoid catching NEXT_REDIRECT
  if (shouldRedirect) {
    redirect(redirectUrl);
  }

  // If we have a valid HMAC request and should have redirected at server level, we should have redirected by now
  // Only render the client components if we don't have a server-level redirect-worthy HMAC request
  if (hmac && hmacVerificationStatus.isVerified && shouldRedirect) {
    // This should not happen - we should have redirected
    // But if it does, show a loading state
    return (
      <Page title="Redirecting" subtitle="Please wait...">
        <VerticalStack gap="4" align="center">
          <Spinner size="large" />
          <Text variant="bodyMd" color="subdued">
            Redirecting...
          </Text>
        </VerticalStack>
      </Page>
    );
  }

  // If we have an HMAC request but verification failed, also don't render client components
  if (hmac && !hmacVerificationStatus.isVerified) {
    return (
      <Page title="Invalid Request" subtitle="Verification failed">
        <VerticalStack gap="4" align="center">
          <Text variant="headingLg" color="critical">
            Invalid Request
          </Text>
          <Text variant="bodyMd" color="subdued">
            The request could not be verified. Please try again.
          </Text>
        </VerticalStack>
      </Page>
    );
  }

  return (
    <ClientPageWrapper
      hmacVerificationStatus={hmacVerificationStatus}
      needsOAuthRedirect={needsOAuthRedirect}
      organizationId={organizationId}
    >
      <Page title="" subtitle="" fullWidth>
        <Layout>
          <VerticalStack gap="6">
            <PageHeader />
            <CustomerList />
          </VerticalStack>
        </Layout>
      </Page>
    </ClientPageWrapper>
  );
}
