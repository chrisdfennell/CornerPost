import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getListing, getListingForOwner, expiryFromNow } from "@/lib/listings";
import { getCategory, getSubcategory } from "@/lib/categories";
import { isValidPlace } from "@/lib/places";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

const UpdateSchema = z.object({
  token: z.string().trim().optional(),
  title: z.string().trim().min(3, "Title is too short").max(120),
  description: z.string().trim().min(10, "Add a few more details").max(5000),
  price: z
    .union([z.number().int().min(0).max(100_000_000), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
  category: z.string(),
  subcategory: z.string(),
  place: z.string(),
  location: z.string().trim().min(2, "Where is it located?").max(120),
  condition: z.string().nullable().optional(),
  images: z.array(z.string().trim().url()).max(8).optional(),
  contactName: z.string().trim().min(1, "Add your name").max(80),
  contactEmail: z.string().trim().email("Enter a valid email"),
  /** When true, push the expiry back out to a fresh full TTL. */
  renew: z.boolean().optional(),
});

export async function PATCH(
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

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const currentUser = await getCurrentUser();
  const owned = await getListingForOwner(id, data.token, currentUser?.email);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!getCategory(data.category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  if (!getSubcategory(data.category, data.subcategory)) {
    return NextResponse.json({ error: "Unknown subcategory" }, { status: 400 });
  }
  if (!isValidPlace(data.place)) {
    return NextResponse.json({ error: "Choose a valid location" }, { status: 400 });
  }

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      category: data.category,
      subcategory: data.subcategory,
      place: data.place,
      location: data.location,
      condition: data.condition || null,
      imageUrl: data.images?.[0] ?? null,
      images: data.images?.length ? JSON.stringify(data.images) : null,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      ...(data.renew ? { expiresAt: expiryFromNow() } : {}),
    },
  });

  return NextResponse.json({ listing: { id: listing.id } });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token") ?? "";

  const currentUser = await getCurrentUser();
  const owned = await getListingForOwner(id, token, currentUser?.email);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
