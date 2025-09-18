import createClient from "openapi-fetch";
import {
  PathsWithMethod,
  ResponseObjectMap,
  SuccessResponse,
} from "openapi-typescript-helpers";
import { paths } from "./types/mantleApi";

const baseUrl =
  process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL || "https://api.heymantle.com/v1";

// Base client for traditional OAuth (server-side)
const client = createClient<paths>({
  baseUrl,
});

export const mantlePost = async <Path extends PathsWithMethod<paths, "post">>(
  accessTokenOrFetch:
    | string
    | ((input: Request | string, init?: RequestInit) => Promise<Response>),
  path: Path,
  ...params: any[]
): Promise<
  SuccessResponse<ResponseObjectMap<paths[Path]["post"]>, "application/json">
> => {
  try {
    const maybeParams = params[0] ?? {};

    // Determine if we're using accessToken or custom fetch
    const isAccessToken = typeof accessTokenOrFetch === "string";
    const apiClient = isAccessToken
      ? client
      : createClient<paths>({ baseUrl, fetch: accessTokenOrFetch });

    console.log(
      `[mantlePost] Using ${isAccessToken ? "access token" : "custom fetch"}`
    );

    const requestConfig = isAccessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessTokenOrFetch}`,
          },
          ...maybeParams,
        }
      : maybeParams;

    const { data, error } = await apiClient.POST(path, requestConfig);

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

export const mantleGet = async <Path extends PathsWithMethod<paths, "get">>(
  accessTokenOrFetch:
    | string
    | ((input: Request | string, init?: RequestInit) => Promise<Response>),
  path: Path,
  ...params: any[]
): Promise<
  SuccessResponse<ResponseObjectMap<paths[Path]["get"]>, "application/json">
> => {
  try {
    const maybeParams = params[0] ?? {};

    console.log(`[mantleGet] Calling ${path} with params:`, maybeParams);

    // Determine if we're using accessToken or custom fetch
    const isAccessToken = typeof accessTokenOrFetch === "string";
    const apiClient = isAccessToken
      ? client
      : createClient<paths>({ baseUrl, fetch: accessTokenOrFetch });

    console.log(
      `[mantleGet] Using ${isAccessToken ? "access token" : "custom fetch"}`
    );

    const requestConfig = isAccessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessTokenOrFetch}`,
          },
          ...maybeParams,
        }
      : maybeParams;

    console.log(`[mantleGet] Full request config:`, requestConfig);

    const { data, error } = await apiClient.GET(path, requestConfig);

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

export const mantlePut = async <Path extends PathsWithMethod<paths, "put">>(
  accessTokenOrFetch:
    | string
    | ((input: Request | string, init?: RequestInit) => Promise<Response>),
  path: Path,
  ...params: any[]
): Promise<
  SuccessResponse<ResponseObjectMap<paths[Path]["put"]>, "application/json">
> => {
  try {
    const maybeParams = params[0] ?? {};

    // Determine if we're using accessToken or custom fetch
    const isAccessToken = typeof accessTokenOrFetch === "string";
    const apiClient = isAccessToken
      ? client
      : createClient<paths>({ baseUrl, fetch: accessTokenOrFetch });

    console.log(
      `[mantlePut] Using ${isAccessToken ? "access token" : "custom fetch"}`
    );

    const requestConfig = isAccessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessTokenOrFetch}`,
          },
          ...maybeParams,
        }
      : maybeParams;

    const { data, error } = await apiClient.PUT(path, requestConfig);

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

export const mantleDelete = async <
  Path extends PathsWithMethod<paths, "delete">
>(
  accessTokenOrFetch:
    | string
    | ((input: Request | string, init?: RequestInit) => Promise<Response>),
  path: Path,
  ...params: any[]
): Promise<
  SuccessResponse<ResponseObjectMap<paths[Path]["delete"]>, "application/json">
> => {
  try {
    const maybeParams = params[0] ?? {};

    // Determine if we're using accessToken or custom fetch
    const isAccessToken = typeof accessTokenOrFetch === "string";
    const apiClient = isAccessToken
      ? client
      : createClient<paths>({ baseUrl, fetch: accessTokenOrFetch });

    console.log(
      `[mantleDelete] Using ${isAccessToken ? "access token" : "custom fetch"}`
    );

    const requestConfig = isAccessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessTokenOrFetch}`,
          },
          ...maybeParams,
        }
      : maybeParams;

    const { data, error } = await apiClient.DELETE(path, requestConfig);

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
