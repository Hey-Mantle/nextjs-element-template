import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.redirect(
    `${process.env.NEXT_PUBLIC_MANTLE_URL}/extensions/${process.env.NEXT_PUBLIC_MANTLE_ELEMENT_HANDLE}`
  );
}
