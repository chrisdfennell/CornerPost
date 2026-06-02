import { NextRequest, NextResponse } from "next/server";
import { isValidPlace, PLACE_COOKIE } from "@/lib/places";

export const dynamic = "force-dynamic";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Only allow same-origin, single-segment-leading internal redirects. */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const next = safeNext(req.nextUrl.searchParams.get("next"));

  if (!isValidPlace(slug)) {
    const url = req.nextUrl.clone();
    url.pathname = "/places";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set(PLACE_COOKIE, slug!, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return res;
}
