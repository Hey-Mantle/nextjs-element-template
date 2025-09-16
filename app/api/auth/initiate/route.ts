import { signIn } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const organizationId = searchParams.get("organizationId");

  await signIn(
    "MantleOAuth",
    { redirectTo: "/api/auth/redirect" },
    organizationId ? { organization_id: organizationId } : undefined
  );
}
