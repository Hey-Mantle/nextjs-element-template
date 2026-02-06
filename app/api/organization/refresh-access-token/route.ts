import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import { exchangeSessionTokenForAccessToken } from "@/lib/token-exchange";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user, organization, sessionToken } =
      await getAuthenticatedUser(request);

    if (!user || !organization || !sessionToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const tokenExchangeResult =
      await exchangeSessionTokenForAccessToken(sessionToken);

    let refreshTokenExpiresAt: Date | null = null;
    if (tokenExchangeResult.refresh_token) {
      if (tokenExchangeResult.refresh_token_expires_at) {
        refreshTokenExpiresAt = new Date(
          tokenExchangeResult.refresh_token_expires_at
        );
      } else if (tokenExchangeResult.refresh_token_expires_in) {
        refreshTokenExpiresAt = new Date(
          Date.now() + tokenExchangeResult.refresh_token_expires_in * 1000
        );
      } else {
        refreshTokenExpiresAt = new Date(
          Date.now() + 99 * 365 * 24 * 60 * 60 * 1000
        );
      }
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: organization.id },
      data: {
        accessToken: tokenExchangeResult.access_token,
        refreshToken: tokenExchangeResult.refresh_token || null,
        refreshTokenExpiresAt,
        accessTokenExpiresAt: tokenExchangeResult.expires_in
          ? new Date(Date.now() + tokenExchangeResult.expires_in * 1000)
          : null,
      },
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: updatedOrganization.id,
        mantleId: updatedOrganization.mantleId,
        name: updatedOrganization.name,
        hasAccessToken: !!updatedOrganization.accessToken,
      },
    });
  } catch (error: any) {
    console.error("Error refreshing access token:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh access token",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
