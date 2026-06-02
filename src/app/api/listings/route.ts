import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getListings } from "@/lib/listings";
import { getCategory, getSubcategory } from "@/lib/categories";
import type { ListingFilter } from "@/lib/listings";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filter: ListingFilter = {
    category: sp.get("category") ?? undefined,
    subcategory: sp.get("sub") ?? undefined,
    q: sp.get("q") ?? undefined,
    sort: (sp.get("sort") as ListingFilter["sort"]) ?? undefined,
    take: sp.get("take") ? Number(sp.get("take")) : undefined,
    skip: sp.get("skip") ? Number(sp.get("skip")) : undefined,
  };
  const { items, total } = await getListings(filter);
  return NextResponse.json({ items, total });
}

const CreateSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120),
  description: z.string().trim().min(10, "Add a few more details").max(5000),
  price: z
    .union([z.number(), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
  category: z.string(),
  subcategory: z.string(),
  location: z.string().trim().min(2, "Where is it located?").max(120),
  condition: z.string().nullable().optional(),
  imageUrl: z
    .string()
    .trim()
    .url("Image must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  contactName: z.string().trim().min(1, "Add your name").max(80),
  contactEmail: z.string().trim().email("Enter a valid email"),
});

export async function POST(req: NextRequest) {
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

  // Validate category + subcategory against our taxonomy.
  const cat = getCategory(data.category);
  if (!cat) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  if (!getSubcategory(data.category, data.subcategory)) {
    return NextResponse.json({ error: "Unknown subcategory" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      category: data.category,
      subcategory: data.subcategory,
      location: data.location,
      condition: data.condition || null,
      imageUrl: data.imageUrl || null,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
