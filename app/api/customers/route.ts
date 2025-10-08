import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Try access token authentication first, fall back to JWT if no access token
  try {
    const accessTokenResult = await handleAccessTokenRequest(request);
    return accessTokenResult;
  } catch (error) {
    // If access token fails, fall back to JWT authentication
    return handleJWTRequest(request);
  }
}

async function handleAccessTokenRequest(request: NextRequest) {
  // Get the Authorization header from the client request
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new Error("No authorization header");
  }

  // Extract the JWT from the Authorization header to get user/org info
  const { user: jwtUser, organization: jwtOrg } =
    getAuthenticatedUserFromPayload(request);

  if (!jwtUser || !jwtOrg) {
    throw new Error("Authentication required");
  }

  // Find the user and organization in the database
  const user = await prisma.user.findUnique({
    where: { email: jwtUser.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const organization = await prisma.organization.findUnique({
    where: { mantleId: jwtOrg.id },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  // Get the access token from the database
  const accessToken = await prisma.userAccessToken.findUnique({
    where: {
      userId_organizationId_tokenType: {
        userId: user.id,
        organizationId: organization.id,
        tokenType: "offline",
      },
    },
  });

  if (!accessToken) {
    throw new Error("No access token found");
  }

  // Build query parameters for Mantle API
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const take = searchParams.get("take") || "10";

  const params = new URLSearchParams();
  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page);
  params.set("take", Math.min(parseInt(take, 10), 10).toString());

  // Use the same base URL as the client-side
  const baseUrl =
    process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
    "https://api.heymantle.com/v1";
  const url = `${baseUrl}/customers?${params.toString()}`;

  // Forward the request to the Mantle API with the access token
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken.accessToken}`, // Use the access token
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `Mantle API call failed with status: ${response.status} - ${errorText}`,
      },
      { status: response.status }
    );
  }

  const customers = await response.json();
  return NextResponse.json(customers);
}

async function handleJWTRequest(request: NextRequest) {
  // Get the Authorization header from the client request
  const authHeader = request.headers.get("authorization");
  const sessionTokenAuthHeader = request.headers.get(
    "x-mantle-session-token-auth"
  );

  if (!authHeader) {
    return NextResponse.json(
      { error: "No authorization header" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const take = searchParams.get("take") || "10"; // Default to 10, max 10

  // Build query parameters for Mantle API
  const params = new URLSearchParams();
  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page);
  params.set("take", Math.min(parseInt(take, 10), 10).toString());

  // Use the same base URL as the client-side - this should be mantle-kristian.ngrok.io
  const baseUrl =
    process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
    "https://api.heymantle.com/v1";
  const url = `${baseUrl}/customers?${params.toString()}`;

  // Forward the request to the Mantle API with the same headers
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: authHeader, // Forward the JWT as-is
      "Content-Type": "application/json",
      ...(sessionTokenAuthHeader && {
        "X-Mantle-Session-Token-Auth": sessionTokenAuthHeader,
      }), // Forward the session token auth header
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `Mantle API call failed with status: ${response.status} - ${errorText}`,
      },
      { status: response.status }
    );
  }

  const customers = await response.json();

  return NextResponse.json(customers);
}
