import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
