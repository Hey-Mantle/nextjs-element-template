import { signIn } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return new Response("Missing organizationId", { status: 400 });
  }

  try {
    // Use NextAuth's signIn function in a Route Handler context
    // Pass the organizationId in the callback URL for post-OAuth processing
    await signIn("MantleOAuth", {
      callbackUrl: `/?organizationId=${encodeURIComponent(organizationId)}`,
    });
  } catch (error) {
    // Check if this is a NEXT_REDIRECT error (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // Re-throw to let Next.js handle the redirect properly
      throw error;
    }

    console.error("OAuth initiation error:", error);
    return new Response("OAuth initiation failed", { status: 500 });
  }
}
