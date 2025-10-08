import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user and organization data from JWT
    const { user: jwtUser, organization: jwtOrg } =
      getAuthenticatedUserFromPayload(request);

    if (!jwtUser || !jwtOrg) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the user in the database by email
    const user = await prisma.user.findUnique({
      where: { email: jwtUser.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Get the organization from the database
    const organization = await prisma.organization.findUnique({
      where: { mantleId: jwtOrg.id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Get the JWT token from the Authorization header for token exchange
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No valid authorization header" },
        { status: 401 }
      );
    }
    const sessionToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Check if we have an existing offline access token
    const existingToken = await prisma.userAccessToken.findUnique({
      where: {
        userId_organizationId_tokenType: {
          userId: user.id,
          organizationId: organization.id,
          tokenType: "offline",
        },
      },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: "No access token found to refresh" },
        { status: 404 }
      );
    }

    // Perform token exchange to get a new access token
    const mantleBaseUrl =
      process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com";
    const tokenExchangePayload = {
      client_id: process.env.NEXT_PUBLIC_MANTLE_ELEMENT_ID,
      client_secret: process.env.MANTLE_ELEMENT_SECRET,
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token: sessionToken,
      subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
      requested_token_type:
        "urn:mantle:params:oauth:token-type:offline-access-token",
    };

    console.log("Refreshing access token:", {
      ...tokenExchangePayload,
      client_secret: tokenExchangePayload.client_secret
        ? "[REDACTED]"
        : "MISSING",
      subject_token: tokenExchangePayload.subject_token
        ? "[REDACTED]"
        : "MISSING",
      mantleBaseUrl,
    });

    const tokenExchangeResponse = await fetch(
      `${mantleBaseUrl}/api/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenExchangePayload),
      }
    );

    if (!tokenExchangeResponse.ok) {
      const errorText = await tokenExchangeResponse.text();
      console.error("Token refresh failed:", {
        status: tokenExchangeResponse.status,
        statusText: tokenExchangeResponse.statusText,
        error: errorText,
      });
      return NextResponse.json(
        {
          error: "Token refresh failed",
          details: errorText,
          status: tokenExchangeResponse.status,
          statusText: tokenExchangeResponse.statusText,
        },
        { status: 400 }
      );
    }

    const tokenData = await tokenExchangeResponse.json();
    console.log("Token refresh successful:", {
      hasAccessToken: !!tokenData.access_token,
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    });

    // Update the existing access token in the database
    const updatedToken = await prisma.userAccessToken.update({
      where: { id: existingToken.id },
      data: {
        accessToken: tokenData.access_token,
        scope: tokenData.scope || existingToken.scope,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Access token refreshed successfully",
      tokenInfo: {
        id: updatedToken.id,
        tokenType: updatedToken.tokenType,
        scope: updatedToken.scope,
        createdAt: updatedToken.createdAt,
        updatedAt: updatedToken.updatedAt,
        expiresAt: updatedToken.expiresAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        organization: {
          id: organization.mantleId, // Return mantleId for consistency
          name: organization.name,
        },
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
