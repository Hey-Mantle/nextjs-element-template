import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { identifyCustomer } from "@/lib/mantle-client";
import { prisma } from "@/lib/prisma";
import { exchangeSessionTokenForAccessToken } from "@/lib/token-exchange";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      user: payloadUser,
      organization: payloadOrg,
      sessionToken,
    } = getAuthenticatedUserFromPayload(request);

    if (!payloadUser || !payloadOrg || !sessionToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create or update organization
    let organization = await prisma.organization.findUnique({
      where: { mantleId: payloadOrg.id },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          mantleId: payloadOrg.id,
          name: payloadOrg.name,
          accessToken: sessionToken,
        },
      });
    } else {
      if (organization.name !== payloadOrg.name) {
        organization = await prisma.organization.update({
          where: { id: organization.id },
          data: { name: payloadOrg.name },
        });
      }
    }

    // Create or update user
    let user = await prisma.user.findFirst({
      where: { userId: payloadUser.id },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: payloadUser.email },
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: payloadUser.id,
          email: payloadUser.email,
          name: payloadUser.name || "",
        },
      });
    } else {
      const needsUpdate =
        user.name !== (payloadUser.name || "") ||
        user.userId !== payloadUser.id ||
        user.email !== payloadUser.email;

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            userId: payloadUser.id,
            name: payloadUser.name || "",
            email: payloadUser.email,
          },
        });
      }
    }

    // Ensure user-organization association
    const existingUserOrg = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
    });

    if (!existingUserOrg) {
      await prisma.userOrganization.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
      });
    }

    // Token exchange: if accessToken is missing, JWT-like, or near expiry
    let accessToken = organization.accessToken;
    let needsTokenExchange = !accessToken || accessToken.startsWith("eyJ");

    if (accessToken && organization.accessTokenExpiresAt) {
      const expiresAt = new Date(organization.accessTokenExpiresAt);
      const now = new Date();
      const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
      if (expiresAt.getTime() - now.getTime() <= bufferMs) {
        needsTokenExchange = true;
      }
    }

    if (needsTokenExchange && sessionToken) {
      try {
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

        organization = await prisma.organization.update({
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

        accessToken = tokenExchangeResult.access_token;
      } catch (error) {
        console.error("Failed to exchange session token:", error);
      }
    }

    // Identify customer if no apiToken
    let customerApiToken = organization.apiToken;

    if (!customerApiToken) {
      try {
        const identifyResult = await identifyCustomer({
          platform: "mantle" as const,
          platformId: organization.mantleId,
          name: organization.name || "",
          email: user.email,
        });

        if (identifyResult.success && identifyResult.customerApiToken) {
          customerApiToken = identifyResult.customerApiToken;
          organization = await prisma.organization.update({
            where: { id: organization.id },
            data: { apiToken: customerApiToken },
          });
        }
      } catch (err) {
        console.error("[sync-session] Error identifying customer:", err);
      }
    }

    return NextResponse.json({
      user,
      organization: {
        id: organization.id,
        mantleId: organization.mantleId,
        name: organization.name,
        accessToken: organization.accessToken,
        apiToken: organization.apiToken,
      },
      customerApiToken: customerApiToken || organization.accessToken,
    });
  } catch (error) {
    console.error("Error syncing session:", error);
    return NextResponse.json(
      { error: "Failed to sync session" },
      { status: 500 }
    );
  }
}
