import { NextRequest, NextResponse } from "next/server";
import { verifyJWTTokenPayload } from "@/lib/jwt-auth";

export async function GET(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized", message: "No Authorization header found" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = verifyJWTTokenPayload(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid token" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Server-side authentication successful",
    user: payload.user,
    organization: payload.organization,
    timestamp: new Date().toISOString(),
  });
}

