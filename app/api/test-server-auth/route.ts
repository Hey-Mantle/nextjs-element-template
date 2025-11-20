import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint for server-side JWT authentication and Core API proxying
 *
 * This route demonstrates how to:
 * 1. Extract headers from the client request
 * 2. Proxy the request to Mantle Core API
 * 3. Forward both Authorization and X-Mantle-Session-Token-Auth headers
 *
 * This is a cloneable example for other developers to follow.
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Get headers from the client request
    const authHeader = request.headers.get("authorization");
    const sessionTokenAuthHeader = request.headers.get(
      "x-mantle-session-token-auth"
    );

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "No Authorization header found. Expected format: 'Bearer <token>'",
          step: "1. Check Authorization header",
        },
        { status: 401 }
      );
    }

    // Step 2: Get Core API URL from environment
    const baseUrl =
      process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
      "https://api.heymantle.com/v1";
    const url = `${baseUrl}/customers`;

    // Step 3: Proxy the request to Mantle Core API
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
          step: "3. Proxy request to Core API",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Step 4: Return the proxied response
    return NextResponse.json({
      success: true,
      message: "Server-side authentication and Core API proxy successful",
      data: data,
      timestamp: new Date().toISOString(),
      proxiedHeaders: {
        authorization: authHeader ? "Bearer [REDACTED]" : "missing",
        "x-mantle-session-token-auth": sessionTokenAuthHeader
          ? "[REDACTED]"
          : "not provided",
      },
      notes: [
        "Headers were extracted from the client request",
        "Both Authorization and X-Mantle-Session-Token-Auth headers were forwarded to Core API",
        "This is the pattern you should use for proxying requests to Mantle Core API",
        "The server acts as a proxy, forwarding authenticated requests to the Core API",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
