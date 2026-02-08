import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { prisma } from "@/lib/prisma";
import {
  buildTokenUpdateData,
  exchangeSessionTokenForAccessToken,
} from "@/lib/token-exchange";
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

    const updatedOrganization = await prisma.organization.update({
      where: { id: organization.id },
      data: buildTokenUpdateData(tokenExchangeResult),
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
