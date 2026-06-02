import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const Schema = z.object({
  reason: z.enum(["spam", "scam", "prohibited", "miscategorized", "other"]),
  detail: z.string().trim().max(1000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = clientIp(req);
  const limit = rateLimit(`report:${ip}`, 10, 60 * 60 * 1000); // 10/hr/IP
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many reports. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a reason" }, { status: 400 });
  }

  // Confirm the listing exists before recording a report against it.
  const exists = await prisma.listing.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.report.create({
    data: {
      listingId: id,
      reason: parsed.data.reason,
      detail: parsed.data.detail || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
