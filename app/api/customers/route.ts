import { getAuthenticatedUser } from "@/lib/jwt-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { user, organization } = await getAuthenticatedUser(request);

  if (!user || !organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const take = searchParams.get("take") || "10"; // Default to 10, max 10

  // Build query parameters for Mantle API
  const params = new URLSearchParams();
  if (search && search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page);
  params.set("take", Math.min(parseInt(take, 10), 10).toString());

  const baseUrl =
    process.env.NEXT_PUBLIC_MANTLE_CORE_API_URL ||
    "https://api.heymantle.com/v1";
  const url = `${baseUrl}/customers?${params.toString()}`;

  console.log("API Route - Calling Mantle API with URL:", url);

  // Use fetch directly instead of mantleGet to match client-side approach
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${organization.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Mantle API call failed with status: ${response.status}`);
  }

  const customers = await response.json();

  console.log("API Route - Mantle API response:", customers);

  return NextResponse.json(customers);
}
