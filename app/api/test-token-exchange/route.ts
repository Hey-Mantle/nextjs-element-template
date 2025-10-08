import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user and organization data from JWT
    const { user: jwtUser, organization: jwtOrg } =
      getAuthenticatedUserFromPayload(request);

    console.log("JWT debug:", {
      hasUser: !!jwtUser,
      hasOrganization: !!jwtOrg,
      userEmail: jwtUser?.email,
      orgName: jwtOrg?.name,
      userId: jwtUser?.id,
      organizationId: jwtOrg?.id,
    });

    if (!jwtUser || !jwtOrg) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = jwtUser.id;
    const organizationId = jwtOrg.id;

    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization ID found in session" },
        { status: 400 }
      );
    }

    // Get the organization from the database
    const organization = await prisma.organization.findUnique({
      where: { mantleId: organizationId },
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

    // Check if we already have a valid offline access token
    let accessToken = await prisma.userAccessToken.findUnique({
      where: {
        userId_organizationId_tokenType: {
          userId: user.id,
          organizationId: organization.id,
          tokenType: "offline",
        },
      },
    });

    // If no offline token exists, perform token exchange
    if (!accessToken) {
      // Use the external Mantle OAuth endpoint
      const mantleBaseUrl =
        process.env.NEXT_PUBLIC_MANTLE_URL || "https://app.heymantle.com";
      const tokenExchangePayload = {
        client_id: process.env.NEXT_PUBLIC_MANTLE_ELEMENT_ID,
        client_secret: process.env.MANTLE_ELEMENT_SECRET,
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token: sessionToken, // Use the JWT token from the Authorization header
        subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
        requested_token_type:
          "urn:mantle:params:oauth:token-type:offline-access-token",
      };

      console.log("Token exchange request payload:", {
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
        console.error("Token exchange failed:", {
          status: tokenExchangeResponse.status,
          statusText: tokenExchangeResponse.statusText,
          error: errorText,
        });
        return NextResponse.json(
          {
            error: "Token exchange failed",
            details: errorText,
            status: tokenExchangeResponse.status,
            statusText: tokenExchangeResponse.statusText,
          },
          { status: 400 }
        );
      }

      const tokenData = await tokenExchangeResponse.json();
      console.log("Token exchange successful:", {
        hasAccessToken: !!tokenData.access_token,
        scope: tokenData.scope,
        tokenType: tokenData.token_type,
      });

      // Store the new access token in the database
      accessToken = await prisma.userAccessToken.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          accessToken: tokenData.access_token,
          tokenType: "offline",
          scope: tokenData.scope || "read:apps,read:customers,write:customers",
          expiresAt: null, // Offline tokens don't expire
          refreshToken: null, // Offline tokens don't have refresh tokens
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Token exchange completed successfully",
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
          id: organization.mantleId, // Return mantleId for consistency
          name: organization.name,
        },
      },
    });
  } catch (error) {
    console.error("Token exchange test error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
