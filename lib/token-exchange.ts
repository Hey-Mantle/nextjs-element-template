/**
 * Token Exchange Service
 *
 * Exchanges session tokens for long-term offline access tokens
 * using the Core API token exchange endpoint (RFC 8693).
 */

const OFFLINE_TOKEN_TYPE =
  "urn:mantle:params:oauth:token-type:offline-access-token";

interface TokenExchangeResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  refresh_token_expires_at?: string; // ISO date string
  refresh_token_expires_in?: number; // Seconds until expiration
  expires_in?: number;
}

/**
 * Exchange a session token for an offline access token
 *
 * @param sessionToken - The session token to exchange
 * @returns Token exchange response with access token and refresh token
 */
export async function exchangeSessionTokenForAccessToken(
  sessionToken: string
): Promise<TokenExchangeResponse> {
  const clientId = process.env.NEXT_PUBLIC_MANTLE_ELEMENT_ID;
  const clientSecret = process.env.MANTLE_ELEMENT_SECRET;
  // OAuth token endpoint is at /api/oauth/token on the main app domain, not the Core API v1 path
  const tokenUrl =
    process.env.MANTLE_TOKEN_URL ||
    (process.env.NEXT_PUBLIC_MANTLE_URL
      ? `${process.env.NEXT_PUBLIC_MANTLE_URL}/api/oauth/token`
      : "https://app.heymantle.com/api/oauth/token");

  if (!clientId || !clientSecret) {
    throw new Error(
      "NEXT_PUBLIC_MANTLE_ELEMENT_ID and MANTLE_ELEMENT_SECRET environment variables are required"
    );
  }

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    client_id: clientId,
    client_secret: clientSecret,
    subject_token: sessionToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type: OFFLINE_TOKEN_TYPE,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Token exchange failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(
      `Token exchange error: ${data.error_description || data.error}`
    );
  }

  return data;
}
