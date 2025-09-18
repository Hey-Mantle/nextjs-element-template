import { MantleClient } from "@heymantle/client";

// Create a configured Mantle client instance only if environment variables are available
let mantleClient: MantleClient | null = null;

function createMantleClient(): MantleClient | null {
  const appId = process.env.NEXT_PUBLIC_MANTLE_APP_ID;
  const apiKey = process.env.MANTLE_APP_API_KEY;

  if (!appId || !apiKey) {
    return null;
  }

  return new MantleClient({
    appId,
    apiKey,
    apiUrl:
      process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
      "https://appapi.heymantle.com/v1",
  });
}

// Initialize the client
mantleClient = createMantleClient();

export interface MantleIdentifyParams {
  platform: "mantle";
  platformId: string;
  name: string;
  email: string;
  customFields?: Record<string, any>;
}

export async function identifyCustomer(params: MantleIdentifyParams) {
  if (!mantleClient) {
    return {
      customerApiToken: null,
      success: false,
      error: "Mantle client not initialized - environment variables missing",
    };
  }

  const response = await mantleClient.identify(params);
  if ("apiToken" in response) {
    return { customerApiToken: response.apiToken, success: true };
  } else {
    return { customerApiToken: null, success: false, error: response };
  }
}

export { mantleClient as default };
