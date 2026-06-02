import { NextRequest, NextResponse } from "next/server";
import { isValidPlace, PLACE_COOKIE } from "@/lib/places";

/**
 * Hard location gate (Craigslist-style): the browsing pages require a chosen
 * metro. Visitors without a valid `place` cookie are sent to the chooser.
 * Listing detail pages, posting, /places, and the API are intentionally NOT
 * gated so shared links and posting still work.
 */
export function middleware(req: NextRequest) {
  const place = req.cookies.get(PLACE_COOKIE)?.value;
  if (isValidPlace(place)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/places";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/browse", "/search", "/category/:path*"],
};
