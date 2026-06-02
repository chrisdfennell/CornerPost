import { NextRequest, NextResponse } from "next/server";
import { getListingContact } from "@/lib/listings";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = clientIp(req);
  // Throttle to make bulk email scraping by id impractical.
  const limit = rateLimit(`contact:${ip}`, 30, 60 * 1000); // 30/min/IP
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const { id } = await params;
  const contact = await getListingContact(id);
  if (!contact) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(contact);
}
