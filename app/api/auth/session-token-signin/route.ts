import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for session token authentication
 * This endpoint allows users to authenticate using a session token from the main platform
 *
 * Usage:
 * - POST /api/auth/session-token-signin
 * - Body: { sessionToken: string, callbackUrl?: string }
 * - Or as URL params: ?sessionToken=xxx&callbackUrl=xxx
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken, callbackUrl } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Use NextAuth's signIn - this creates the session and sets cookies
    const result = await signIn("session-token", {
      sessionToken,
      redirect: false,
    });

    console.log("SignIn result:", result);

    if (result?.error) {
      console.error("Session token signin error:", result.error);
      return NextResponse.json(
        { error: "Authentication failed", details: result.error },
        { status: 401 }
      );
    }

    // Return success - NextAuth has set the session cookies
    // The client should then call /api/auth/session or use useSession() to get the session data
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      callbackUrl: callbackUrl || "/",
    });
  } catch (error) {
    console.error("Session token signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
