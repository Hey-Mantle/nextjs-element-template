import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  userId: string; // Mantle user ID
  organizationId: string; // Mantle organization ID
  organizationName: string;
}

/**
 * Verify JWT token with database lookup (for use in API routes)
 */
export async function verifyJWTToken(
  token: string
): Promise<AuthenticatedUser | null> {
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

    // Look up the organization by mantleId to get the access token for verification
    const organization = await prisma.organization.findUnique({
      where: { mantleId: payload.organizationId },
    });

    if (!organization) {
      return null;
    }

    // Verify the signature using the organization's access token
    const expectedSignature = crypto
      .createHmac("sha256", organization.accessToken)
      .update(jwtParts[0] + "." + jwtParts[1])
      .digest("base64url");

    if (expectedSignature !== jwtParts[2]) {
      return null;
    }

    // Extract user info from JWT payload
    const user: AuthenticatedUser = {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
      userId: payload.user.id,
      organizationId: organization.mantleId,
      organizationName: organization.name,
    };

    return user;
  } catch (error) {
    console.error("JWT Auth - verification failed:", error);
    return null;
  }
}

/**
 * Get authenticated user from JWT token in request headers
 */
export async function getAuthenticatedUser(
  request?: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    let sessionToken: string | null = null;

    if (request) {
      // Check Authorization header first (Bearer token)
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7);
      }

      // Fallback to custom header
      if (!sessionToken) {
        sessionToken = request.headers.get("x-session-token");
      }

      // Fallback to cookie
      if (!sessionToken) {
        sessionToken = request.cookies.get("session-token")?.value || null;
      }
    } else {
      // Access from Next.js headers() function (for App Router)
      const headersList = await headers();
      const authHeader = headersList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7);
      }

      if (!sessionToken) {
        sessionToken = headersList.get("x-session-token");
      }
    }

    if (!sessionToken) {
      return null;
    }

    return await verifyJWTToken(sessionToken);
  } catch (error) {
    console.error("JWT Auth - error getting authenticated user:", error);
    return null;
  }
}
