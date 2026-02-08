import { MantleClient } from "@heymantle/client";

export interface MantleIdentifyParams {
  platform: "mantle";
  platformId: string;
  name: string;
  email: string;
  customFields?: Record<string, any>;
}

export async function identifyCustomer(params: MantleIdentifyParams) {
  const appId = process.env.NEXT_PUBLIC_MANTLE_APP_ID;
  const apiKey = process.env.MANTLE_APP_API_KEY;

  if (!appId || !apiKey) {
    return {
      customerApiToken: null,
      success: false,
      error: "Mantle client not initialized - environment variables missing",
    };
  }

  const client = new MantleClient({
    appId,
    apiKey,
    apiUrl:
      process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
      "https://appapi.heymantle.com/v1",
  });

  const response = await client.identify(params);
  if ("apiToken" in response) {
    return { customerApiToken: response.apiToken, success: true };
  } else {
    return { customerApiToken: null, success: false, error: response };
  }
}
