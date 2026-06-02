import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getListings, PAGE_SIZE, expiryFromNow } from "@/lib/listings";
import { getCategory, getSubcategory } from "@/lib/categories";
import { isValidPlace } from "@/lib/places";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendManageLinkEmail } from "@/lib/email";
import type { ListingFilter } from "@/lib/listings";

export const dynamic = "force-dynamic";

function numParam(v: string | null): number | undefined {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // ids mode: fetch a specific set (used by favorites). Include closed ones so
  // a saved item that since sold still shows up, marked as closed.
  const idsParam = sp.get("ids");
  if (idsParam !== null) {
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 100);
    if (ids.length === 0) return NextResponse.json({ items: [], total: 0 });
    const { items, total } = await getListings({
      ids,
      includeClosed: true,
      take: ids.length,
    });
    return NextResponse.json({ items, total });
  }

  const filter: ListingFilter = {
    category: sp.get("category") ?? undefined,
    subcategory: sp.get("sub") ?? undefined,
    q: sp.get("q") ?? undefined,
    minPrice: numParam(sp.get("minPrice")),
    maxPrice: numParam(sp.get("maxPrice")),
    place: sp.get("place") ?? undefined,
    sort: (sp.get("sort") as ListingFilter["sort"]) ?? undefined,
    take: numParam(sp.get("take")) ?? PAGE_SIZE,
    skip: numParam(sp.get("skip")),
  };
  const { items, total } = await getListings(filter);
  return NextResponse.json({ items, total });
}

const CreateSchema = z.object({
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
  // Honeypot: real users never see or fill this. Bots tend to. Accept any
  // value at the schema level so the handler can silently absorb bot hits.
  company: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit(`post:${ip}`, 5, 60 * 60 * 1000); // 5 posts/hour/IP
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many listings posted. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Silently accept honeypot hits so bots don't learn the field is checked.
  if (data.company) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Validate category + subcategory against our taxonomy.
  const cat = getCategory(data.category);
  if (!cat) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  if (!getSubcategory(data.category, data.subcategory)) {
    return NextResponse.json({ error: "Unknown subcategory" }, { status: 400 });
  }
  if (!isValidPlace(data.place)) {
    return NextResponse.json({ error: "Choose a valid location" }, { status: 400 });
  }

  const expiresAt = expiryFromNow();

  const listing = await prisma.listing.create({
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
      expiresAt,
    },
  });

  // Email the manage link so the poster never loses edit access (best-effort).
  await sendManageLinkEmail({
    to: listing.contactEmail,
    listingId: listing.id,
    title: listing.title,
    editToken: listing.editToken,
  });

  // editToken is returned ONCE so the poster can manage their listing later.
  return NextResponse.json(
    { listing: { id: listing.id }, editToken: listing.editToken },
    { status: 201 }
  );
}
