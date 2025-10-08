import { getAuthenticatedUserFromPayload } from "@/lib/jwt-auth";
import { identifyCustomer } from "@/lib/mantle-client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("sync-session endpoint called");

  try {
    // Get authenticated user and organization data from JWT
    const { user: jwtUser, organization: jwtOrg } =
      getAuthenticatedUserFromPayload(request);

    console.log("sync-session: Got JWT data", {
      hasUser: !!jwtUser,
      hasOrganization: !!jwtOrg,
      userEmail: jwtUser?.email,
      orgName: jwtOrg?.name,
    });

    if (!jwtUser || !jwtOrg) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if organization exists in database
    let organization = await prisma.organization.findUnique({
      where: { mantleId: jwtOrg.id },
    });

    console.log({ organization });

    // If organization doesn't exist, create it
    if (!organization) {
      // First, identify the customer to get the API token
      const identifyResult = await identifyCustomer({
        platform: "mantle",
        platformId: jwtOrg.id,
        name: jwtOrg.name,
        email: jwtUser.email,
      });

      if (!identifyResult.success || !identifyResult.customerApiToken) {
        console.error("Failed to identify customer:", identifyResult.error);
        return NextResponse.json(
          { error: "Failed to identify customer" },
          { status: 500 }
        );
      }

      // Create the organization record
      organization = await prisma.organization.create({
        data: {
          mantleId: jwtOrg.id,
          name: jwtOrg.name,
          accessToken: "", // We don't have access token in the simplified payload
          apiToken: identifyResult.customerApiToken,
        },
      });

      console.log(
        `Created new organization: ${organization.name} (${organization.mantleId})`
      );
    } else {
      // Organization exists, but update access token if it's different
      // Organization exists, no need to update access token since we don't have it in the simplified payload
      console.log(`Organization found: ${organization.name}`);
    }

    // Check if user exists in database
    let user = await prisma.user.findFirst({
      where: { userId: jwtUser.id }, // Look up by Mantle's internal user ID first
    });

    // If not found by userId, try by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: jwtUser.email },
      });
    }

    // If user doesn't exist, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: jwtUser.email,
          name: jwtUser.name,
          userId: jwtUser.id, // Store Mantle's internal user ID
        },
      });

      console.log(`Created new user: ${user.name} (${user.email})`);
    } else {
      // User exists, update name and userId if needed
      if (user.name !== jwtUser.name || user.userId !== jwtUser.id) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: jwtUser.name,
            userId: jwtUser.id,
          },
        });
      }
    }

    // Ensure user-organization relationship exists
    const userOrgExists = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
    });

    if (!userOrgExists) {
      await prisma.userOrganization.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
      });

      console.log(
        `Created user-organization mapping: ${user.name} -> ${organization.name}`
      );
    }

    // Return the customer API token and relevant data
    return NextResponse.json({
      customerApiToken: organization.apiToken,
      organizationId: organization.mantleId,
      organizationName: organization.name,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
    });
  } catch (error) {
    console.error("Error syncing session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
