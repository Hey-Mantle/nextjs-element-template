import { MantleClient } from "@heymantle/client";

// Create a configured Mantle client instance
export const mantleClient = new MantleClient({
  appId: process.env.NEXT_PUBLIC_MANTLE_APP_ID!,
  apiKey: process.env.MANTLE_APP_API_KEY!,
});

// Identify wrapper function for OAuth completion
export interface ShopifyIdentifyParams {
  platform: "shopify";
  platformId: string;
  myshopifyDomain: string;
  accessToken: string;
  name: string;
  email: string;
  customFields?: Record<string, any>;
  defaultBillingProvider?: string;
}

export async function identifyCustomer(params: ShopifyIdentifyParams) {
  try {
    const response = await mantleClient.identify(params);
    if ("apiToken" in response) {
      return { customerApiToken: response.apiToken, success: true };
    } else {
      return { customerApiToken: null, success: false, error: response };
    }
  } catch (error) {
    console.error("Failed to identify customer with Mantle:", error);
    return { customerApiToken: null, success: false, error };
  }
}

// Export the client for other operations
export { mantleClient as default };
