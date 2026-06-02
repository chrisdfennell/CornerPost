import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getListingForOwner, expiryFromNow } from "@/lib/listings";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let token = "";
  try {
    const body = await req.json();
    token = typeof body?.token === "string" ? body.token : "";
  } catch {
    /* fall through to token check */
  }

  const currentUser = await getCurrentUser();
  const owned = await getListingForOwner(id, token, currentUser?.email);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const expiresAt = expiryFromNow();
  await prisma.listing.update({ where: { id }, data: { expiresAt } });

  return NextResponse.json({ ok: true, expiresAt });
}

