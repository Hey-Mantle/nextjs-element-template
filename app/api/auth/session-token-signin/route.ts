import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
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

    console.log("Session token signin - received request:", {
      hasSessionToken: !!sessionToken,
      tokenLength: sessionToken?.length,
      tokenPreview: sessionToken?.substring(0, 50) + "...",
      callbackUrl,
    });

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    console.log(
      "Session token signin - calling signIn with session-token provider"
    );
    // Use NextAuth's signIn with our custom session-token provider
    const result = await signIn("session-token", {
      sessionToken,
      redirect: false,
    });

    console.log("Session token signin - signIn result:", {
      hasResult: !!result,
      error: result?.error,
      ok: result?.ok,
      status: result?.status,
      url: result?.url,
    });

    if (result?.error) {
      console.error("Session token signin error:", result.error);
      return NextResponse.json(
        { error: "Authentication failed", details: result.error },
        { status: 401 }
      );
    }

    console.log("Session token signin - authentication successful");
    // If successful, return success response
    // The client can then redirect or handle as needed
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

/**
 * GET handler for URL-based session token authentication
 * This allows for direct URL-based authentication like:
 * /api/auth/session-token-signin?sessionToken=xxx&callbackUrl=/dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    if (!sessionToken) {
      // Redirect to error page with message
      return redirect(`/auth/error?error=MissingSessionToken`);
    }

    // Use NextAuth's signIn with our custom session-token provider
    const result = await signIn("session-token", {
      sessionToken,
      redirectTo: callbackUrl,
    });

    // If we reach here, signIn didn't redirect (which it should for successful auth)
    // This likely means there was an error
    return redirect(`/auth/error?error=AuthenticationFailed`);
  } catch (error) {
    console.error("Session token signin error:", error);
    return redirect(`/auth/error?error=InternalError`);
  }
}
