import AppBridgeSessionUser from "@/components/AppBridgeSessionUser";
import ClientPageWrapper from "@/components/ClientPageWrapper";
import CustomAuthTestComponent from "@/components/CustomAuthTestComponent";
import HmacVerificationStatus from "@/components/HmacVerificationStatus";
import { Page, VerticalStack } from "@heymantle/litho";
import crypto from "crypto";
import { redirect } from "next/navigation";

interface HmacVerificationResult {
  isValid: boolean;
  isHmacValid: boolean;
  isTimestampValid: boolean;
  timestampAge?: number;
  errorMessage?: string;
}

/**
 * Verify HMAC signature for Mantle installation requests
 * Based on Shopify's HMAC verification process
 */
async function verifyMantleRequest(
  searchParams: URLSearchParams
): Promise<HmacVerificationResult> {
  try {
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
        errorMessage:
          "MANTLE_ELEMENT_SECRET not found in environment variables",
      };
    }

    // Remove hmac parameter from the query string
    const paramsWithoutHmac = new URLSearchParams(searchParams);
    paramsWithoutHmac.delete("hmac");

    console.log(
      "All parameters before sorting:",
      Array.from(paramsWithoutHmac.entries())
    );

    // Sort parameters alphabetically and create query string
    const sortedParams = Array.from(paramsWithoutHmac.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    console.log("Parameters for HMAC verification:", sortedParams);
    console.log("Client secret length:", clientSecret.length);
    console.log(
      "Client secret (first 10 chars):",
      clientSecret.substring(0, 10) + "..."
    );

    // Create the message to sign: timestamp.sortedParams (matching server-side format)
    const messageToSign = `${timestamp}.${sortedParams}`;
    console.log("Message to sign:", messageToSign);

    // Create HMAC-SHA256 hash
    const calculatedHmac = crypto
      .createHmac("sha256", clientSecret)
      .update(messageToSign)
      .digest("hex");

    console.log("Calculated HMAC:", calculatedHmac);
    console.log("Received HMAC:", hmac);
    console.log(
      "HMAC lengths - Calculated:",
      calculatedHmac.length,
      "Received:",
      hmac.length
    );

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
  } catch (error) {
    console.error("Error in HMAC verification:", error);
    return {
      isValid: false,
      isHmacValid: false,
      isTimestampValid: false,
      errorMessage: `Verification error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
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

  if (hmac) {
    try {
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
        console.error("Invalid HMAC request from Mantle");
        console.error("HMAC valid:", verificationResult.isHmacValid);
        console.error("Timestamp valid:", verificationResult.isTimestampValid);
        console.error("Timestamp age (ms):", verificationResult.timestampAge);
        console.error(
          "Request parameters:",
          Object.fromEntries(urlSearchParams.entries())
        );
        // You might want to redirect to an error page or return an error response
        // For now, we'll continue but log the issue
      } else {
        console.log("Valid Mantle installation request received");
        console.log(
          "Request parameters:",
          Object.fromEntries(urlSearchParams.entries())
        );

        const requestOrganizationId = urlSearchParams.get("organizationId");

        console.log(
          "Valid HMAC request for organization:",
          requestOrganizationId
        );

        // For embedded requests, let the client-side handle authentication
        if (isEmbedded) {
          console.log("Embedded request - will authenticate via app bridge");
        } else {
          // For non-embedded requests (initial install), redirect to OAuth
          console.log("Initial install request - redirecting to OAuth");
          const initiateUrl = `/api/auth/initiate?organizationId=${encodeURIComponent(
            requestOrganizationId || ""
          )}`;
          redirect(initiateUrl);
        }
      }
    } catch (error) {
      // Check if this is a NEXT_REDIRECT error (expected behavior)
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // Re-throw to let Next.js handle the redirect properly
        throw error;
      }

      console.error("Error during HMAC verification:", error);
      hmacVerificationStatus.errorMessage = `Verification error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      // Continue with normal flow if verification fails
    }
  }

  // Render the embedded app (handles authentication internally)
  return (
    <ClientPageWrapper hmacVerificationStatus={hmacVerificationStatus}>
      <Page title="Your Mantle Element" subtitle="Build it out!">
        <VerticalStack gap="4">
          <HmacVerificationStatus {...hmacVerificationStatus} />
          <CustomAuthTestComponent />
          <AppBridgeSessionUser />
        </VerticalStack>
      </Page>
    </ClientPageWrapper>
  );
}
