import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to verify that the custom auth middleware is working
 * This demonstrates the custom JWT auth flow where:
 * 1. Middleware verifies JWT tokens and sets user context
 * 2. This endpoint reads the user context from headers
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from our custom auth context
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          error: "No authenticated user found",
          message:
            "Please provide a valid session token via Authorization header, x-session-token header, cookie, or query parameter",
        },
        { status: 401 }
      );
    }

    // Return detailed user information
    return NextResponse.json({
      success: true,
      message: "User authenticated via custom middleware",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userId: user.userId,
        organizationId: user.organizationId,
        organizationName: user.organizationName,
      },
      authMethod: "custom-jwt-middleware",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve user context",
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint that also tests auth but with additional request body handling
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          error: "No authenticated user found",
          message:
            "Please provide a valid session token via Authorization header, x-session-token header, cookie, or query parameter",
        },
        { status: 401 }
      );
    }

    // Parse request body if provided
    let requestData = null;
    try {
      requestData = await request.json();
    } catch {
      // No body or invalid JSON, that's fine
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated request processed successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userId: user.userId,
        organization: {
          id: user.organizationId,
          name: user.organizationName,
        },
      },
      requestData,
      authMethod: "custom-jwt-middleware",
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing authenticated request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process authenticated request",
      },
      { status: 500 }
    );
  }
}
