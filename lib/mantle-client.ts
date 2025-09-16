import { MantleClient } from "@heymantle/client";

// Create a configured Mantle client instance
export const mantleClient = new MantleClient({
  appId: process.env.NEXT_PUBLIC_MANTLE_APP_ID!,
  apiKey: process.env.MANTLE_APP_API_KEY!,
  apiUrl:
    process.env.NEXT_PUBLIC_MANTLE_APP_API_URL ??
    "https://appapi.heymantle.com/v1",
});

export interface MantleIdentifyParams {
  platform: "mantle";
  platformId: string;
  name: string;
  email: string;
  customFields?: Record<string, any>;
}

export async function identifyCustomer(params: MantleIdentifyParams) {
  const response = await mantleClient.identify(params);
  if ("apiToken" in response) {
    return { customerApiToken: response.apiToken, success: true };
  } else {
    return { customerApiToken: null, success: false, error: response };
  }
}

export { mantleClient as default };
