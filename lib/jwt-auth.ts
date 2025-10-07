import { Organization, User } from "@prisma/client";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

/**
 * Verify JWT token with database lookup (for use in API routes)
 * For managed installs, JWT tokens are signed with MANTLE_ELEMENT_SECRET
 */
async function verifyJWTToken(
  token: string
): Promise<{ user: User; organization: Organization } | null> {
  try {
    // Decode the JWT payload
    const jwtParts = token.split(".");
    if (jwtParts.length !== 3) {
      console.log("JWT Auth - invalid JWT format");
      return null;
    }

    // Decode the payload (base64url decode)
    const payload = JSON.parse(
      Buffer.from(jwtParts[1], "base64url").toString()
    );

    // Check if JWT is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Look up the organization by mantleId
    const organization = await prisma.organization.findUnique({
      where: { mantleId: payload.organizationId },
    });

    if (!organization) {
      return null;
    }

    // Get the element secret for JWT verification (for managed installs)
    const elementSecret = process.env.MANTLE_ELEMENT_SECRET;
    if (!elementSecret) {
      console.error("MANTLE_ELEMENT_SECRET not found in environment variables");
      return null;
    }

    // Verify the signature using the element secret
    const expectedSignature = crypto
      .createHmac("sha256", elementSecret)
      .update(jwtParts[0] + "." + jwtParts[1])
      .digest("base64url");

    if (expectedSignature !== jwtParts[2]) {
      return null;
    }

    // Look up user by userId first (Mantle's internal user ID) for more accurate matching
    let user = await prisma.user.findFirst({
      where: { userId: payload.user.id },
    });

    // If not found by userId, try by email as fallback
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: payload.user.email },
      });
    }

    if (!user) {
      // Create new user if not found
      user = await prisma.user.create({
        data: {
          userId: payload.user.id,
          email: payload.user.email,
          name: payload.user.name || "",
        },
      });
    } else {
      // Update user if name has changed
      const needsUpdate =
        user.name !== (payload.user.name || "") ||
        user.userId !== payload.user.id;

      if (needsUpdate) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            userId: payload.user.id,
            name: payload.user.name || "",
          },
        });
      }
    }

    // Check if user-organization association exists
    const existingUserOrg = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
    });

    // Create user-organization association if it doesn't exist
    if (!existingUserOrg) {
      await prisma.userOrganization.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
      });
    }

    return { user, organization };
  } catch (error) {
    console.error("JWT Auth - verification failed:", error);
    return null;
  }
}

/**
 * Get authenticated user from JWT token in request headers
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  user: User | null;
  organization: Organization | null;
  sessionToken: string | null;
}> {
  let sessionToken: string | null = null;

  // Check Authorization header (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionToken = authHeader.substring(7);
  }

  if (!sessionToken) {
    return { user: null, organization: null, sessionToken: null };
  }

  const verifiedToken = await verifyJWTToken(sessionToken);
  if (!verifiedToken) {
    return { user: null, organization: null, sessionToken: null };
  }

  return { ...verifiedToken, sessionToken };
}
