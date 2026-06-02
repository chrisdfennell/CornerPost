import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isModerator } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const Schema = z.object({
  token: z.string().min(1),
  action: z.enum(["resolve", "remove"]),
  reportId: z.string().optional(),
  listingId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { token, action, reportId, listingId } = parsed.data;

  if (!isModerator(token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (action === "resolve") {
    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }
    await prisma.report.update({
      where: { id: reportId },
      data: { resolved: true },
    });
    return NextResponse.json({ ok: true });
  }

  // action === "remove": delete the listing (cascades to its reports).
  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }
  await prisma.listing.delete({ where: { id: listingId } });
  return NextResponse.json({ ok: true });
}
