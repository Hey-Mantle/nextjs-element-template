import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { user, organization } = await getAuthenticatedUser(request);
  if (user && organization) {
    return NextResponse.json({ user, organization });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
