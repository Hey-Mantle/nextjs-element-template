import { signIn } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const organizationId = searchParams.get("organizationId");

  console.log("[OAuth Initiate] Starting OAuth initiation");
  console.log("[OAuth Initiate] Organization ID:", organizationId);
  console.log("[OAuth Initiate] Request URL:", request.url);
  console.log(
    "[OAuth Initiate] User-Agent:",
    request.headers.get("user-agent")
  );
  console.log("[OAuth Initiate] Referer:", request.headers.get("referer"));

  if (!organizationId) {
    console.error("[OAuth Initiate] Missing organizationId");
    return new Response("Missing organizationId", { status: 400 });
  }

  try {
    await signIn("MantleOAuth");
  } catch (error) {
    // Check if this is a NEXT_REDIRECT error (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      console.log(
        "[OAuth Initiate] NEXT_REDIRECT error (expected), re-throwing"
      );
      // Re-throw to let Next.js handle the redirect properly
      throw error;
    }

    console.error("[OAuth Initiate] OAuth initiation error:", error);
    return new Response("OAuth initiation failed", { status: 500 });
  }
}
