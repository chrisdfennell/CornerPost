import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getListingForOwner } from "@/lib/listings";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const Schema = z.object({
  token: z.string().trim().optional(),
  status: z.enum(["active", "closed"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const currentUser = await getCurrentUser();
  const owned = await getListingForOwner(id, parsed.data.token, currentUser?.email);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.listing.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, status: parsed.data.status });
}

