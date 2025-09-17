import { Organization } from "@prisma/client";
import console from "console";
import createClient from "openapi-fetch";
import { paths } from "./types/mantleApi";

const client = createClient<paths>({
  baseUrl:
    process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
    "https://api.heymantle.com/v1",
});

export const mantlePost = async (
  organization: Organization,
  path: keyof paths,
  params?: any
) => {
  try {
    const maybeParams = params ?? {};

    const { data, error } = await client.POST(path as any, {
      headers: {
        Authorization: `Bearer ${organization.accessToken}`,
      },
      ...maybeParams,
    });
    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error(`[mantlePost] No data returned from ${path}`);
  } catch (error: any) {
    console.error(`[mantlePost] Error posting to ${path}: ${error.message}`);
    throw error;
  }
};

export const mantleGet = async (
  organization: Organization,
  path: keyof paths,
  params?: any
) => {
  try {
    const maybeParams = params ?? {};

    console.log(`[mantleGet] Calling ${path} with params:`, maybeParams);

    // Try multiple approaches for passing query params
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${organization.accessToken}`,
      },
      params: {
        query: maybeParams.query || {},
      },
      // Also try passing query params directly as a fallback
      // ...(maybeParams.query && { query: maybeParams.query }),
    };

    console.log(`[mantleGet] Full request config:`, requestConfig);
    console.log(`[mantleGet] Query params specifically:`, maybeParams.query);

    const { data, error } = await client.GET(path as any, requestConfig);

    if (error) {
      console.error(`[mantleGet] API error for ${path}:`, error);
      throw error;
    }

    if (data) {
      console.log(`[mantleGet] Success response from ${path}:`, data);
      return data;
    }

    throw new Error(`[mantleGet] No data returned from ${path}`);
  } catch (error: any) {
    console.error(`[mantleGet] Error getting ${path}: ${error.message}`);
    throw error;
  }
};

export const mantlePut = async (
  organization: Organization,
  path: keyof paths,
  params?: any
) => {
  try {
    const maybeParams = params ?? {};

    const { data, error } = await client.PUT(path as any, {
      headers: {
        Authorization: `Bearer ${organization.accessToken}`,
      },
      ...maybeParams,
    });

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error(`[mantlePut] No data returned from ${path}`);
  } catch (error: any) {
    console.error(`[mantlePut] Error putting to ${path}: ${error.message}`);
    throw error;
  }
};

export const mantleDelete = async (
  organization: Organization,
  path: keyof paths,
  params?: any
) => {
  try {
    const maybeParams = params ?? {};

    const { data, error } = await client.DELETE(path as any, {
      headers: {
        Authorization: `Bearer ${organization.accessToken}`,
      },
      ...maybeParams,
    });

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    throw new Error(`[mantleDel] No data returned from ${path}`);
  } catch (error: any) {
    console.error(`[mantleDel] Error deleting ${path}: ${error.message}`);
    throw error;
  }
};
