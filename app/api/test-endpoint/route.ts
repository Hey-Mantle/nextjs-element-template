import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint for client-side authenticated requests
 * 
 * This route demonstrates how to proxy requests to Mantle Core API.
 * The authenticatedFetch automatically includes the session token in the
 * Authorization header, and we forward both Authorization and 
 * X-Mantle-Session-Token-Auth headers to the Core API.
 * 
 * This is a cloneable example for other developers to follow.
 */
export async function GET(request: NextRequest) {
  try {
    // Get headers from the client request
    const authHeader = request.headers.get("authorization");
    const sessionTokenAuthHeader = request.headers.get("x-mantle-session-token-auth");

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "No Authorization header found. This endpoint requires authentication.",
          hint: "Use mantle.authenticatedFetch() from the client to automatically include the token",
        },
        { status: 401 }
      );
    }

    // Get Core API URL from environment
    const baseUrl =
      process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
      "https://api.heymantle.com/v1";
    const url = `${baseUrl}/customers`;

    // Proxy the request to Mantle Core API
    // Forward both Authorization and X-Mantle-Session-Token-Auth headers
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader, // Forward JWT as-is
        "Content-Type": "application/json",
        ...(sessionTokenAuthHeader && {
          "X-Mantle-Session-Token-Auth": sessionTokenAuthHeader,
        }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Core API call failed",
          message: `Status: ${response.status} - ${errorText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Client-side authenticated request to Core API successful",
      data: data,
      timestamp: new Date().toISOString(),
      method: "GET",
      proxiedHeaders: {
        authorization: authHeader ? "Bearer [REDACTED]" : "missing",
        "x-mantle-session-token-auth": sessionTokenAuthHeader
          ? "[REDACTED]"
          : "not provided",
      },
      notes: [
        "The App Bridge automatically included the session token in the Authorization header",
        "Both Authorization and X-Mantle-Session-Token-Auth headers were forwarded to Core API",
        "This is the pattern you should use for proxying requests to Mantle Core API",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

