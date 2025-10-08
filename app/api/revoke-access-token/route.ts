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

    // Check if we have an offline access token
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
      return NextResponse.json(
        { error: "No access token found to revoke" },
        { status: 404 }
      );
    }

    // Call Mantle's revoke endpoint
    const mantleBaseUrl =
      process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com";

    const revokePayload = {
      token: accessToken.accessToken,
      token_type_hint: "access_token",
    };

    console.log("Revoking access token:", {
      token: accessToken.accessToken.substring(0, 10) + "...",
      token_type_hint: "access_token",
      mantleBaseUrl,
    });

    const revokeResponse = await fetch(`${mantleBaseUrl}/oauth/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(revokePayload),
    });

    // Note: RFC 7009 states that revoke endpoints should always return 200 OK
    // regardless of whether the token was valid or not
    console.log("Token revoke response:", {
      status: revokeResponse.status,
      statusText: revokeResponse.statusText,
    });

    // Delete the access token from our database
    await prisma.userAccessToken.delete({
      where: { id: accessToken.id },
    });

    console.log("Access token deleted from database:", accessToken.id);

    return NextResponse.json({
      success: true,
      message: "Access token revoked successfully",
    });
  } catch (error) {
    console.error("Token revoke error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
