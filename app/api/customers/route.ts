import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { mantleGet } from "@/lib/mantle-api-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { user, organization } = await getAuthenticatedUser(request);

  if (!user || !organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const limit = searchParams.get("limit") || "10"; // Default to 10, max 10

  console.log("API Route - Full URL:", request.url);
  console.log(
    "API Route - Search params:",
    Object.fromEntries(searchParams.entries())
  );
  console.log("API Route - Search value:", search);
  console.log("API Route - Limit:", limit);

  // Fetch customers from Mantle Core API
  const queryParams = {
    query: {
      search,
      limit: Math.min(parseInt(limit, 10), 10), // Cap at 10
    },
  };

  console.log("API Route - Calling mantleGet with params:", queryParams);

  const customers = await mantleGet(organization, "/customers", queryParams);

  console.log("API Route - Mantle API response:", customers);

  return NextResponse.json(customers);
}
