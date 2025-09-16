import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for verifying session token authentication
 * This endpoint allows client-side components to verify authentication status
 *
 * Usage:
 * - POST /api/auth/verify-session
 * - Body: { sessionToken: string }
 * - Returns: { user: AuthenticatedUser | null, error?: string }
 */
export async function POST(request: NextRequest) {
  // Check if request has a body
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 400 }
    );
  }

  // Get the raw text first to check if it's empty
  const rawBody = await request.text();
  if (!rawBody || rawBody.trim() === "") {
    return NextResponse.json(
      { error: "Request body is required" },
      { status: 400 }
    );
  }

  // Parse the JSON
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { sessionToken } = body;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session token is required" },
      { status: 400 }
    );
  }

  // Create a mock request with the session token in Authorization header
  const mockRequest = new NextRequest(request.url, {
    headers: {
      authorization: `Bearer ${sessionToken}`,
    },
  });

  const user = await getAuthenticatedUser(mockRequest);

  if (!user) {
    return NextResponse.json(
      { user: null, error: "Authentication failed" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
