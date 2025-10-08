import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
      return NextResponse.json({
        tokenInfo: null,
      });
    }

    return NextResponse.json({
      tokenInfo: {
        id: accessToken.id,
        tokenType: accessToken.tokenType,
        scope: accessToken.scope,
        createdAt: accessToken.createdAt,
        updatedAt: accessToken.updatedAt,
        expiresAt: accessToken.expiresAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        organization: {
          id: organization.id,
          name: organization.name,
        },
      },
    });
  } catch (error) {
    console.error("Access token status error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
