import { NextRequest, NextResponse } from "next/server";

/**
 * Simple endpoint to set a session token cookie for testing
 * This replaces the complex NextAuth flow with a simple cookie setter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: "Session token set successfully",
      note: "Token is now available as a cookie for subsequent requests",
    });

    // Set the session token as a cookie
    response.cookies.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error setting session token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Clear the session token cookie
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Session token cleared",
  });

  // Clear the session token cookie
  response.cookies.set("session-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
