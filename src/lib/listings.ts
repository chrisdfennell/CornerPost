import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const PAGE_SIZE = 24;

/** Listings expire (drop out of public queries) this many days after posting. */
export const LISTING_TTL_DAYS = 30;

/** Expiry timestamp for a listing posted/renewed right now. */
export function expiryFromNow(): Date {
  return new Date(Date.now() + LISTING_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export type ListingFilter = {
  category?: string;
  subcategory?: string;
  place?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  take?: number;
  skip?: number;
  ids?: string[];
  /** Include listings whose expiresAt is in the past (owner/admin views). */
  includeExpired?: boolean;
  /** Include closed (sold/filled) listings — lists hide them by default. */
  includeClosed?: boolean;
};

/**
 * Fields safe to expose in list/detail responses. Deliberately omits
 * contactEmail and editToken so they can never leak via the JSON API or
 * server-rendered HTML. The email is only served from a dedicated endpoint.
 */
export const PUBLIC_SELECT = {
  id: true,
  title: true,
  description: true,
  price: true,
  category: true,
  subcategory: true,
  place: true,
  location: true,
  condition: true,
  imageUrl: true,
  images: true,
  contactName: true,
  featured: true,
  status: true,
  expiresAt: true,
  createdAt: true,
} satisfies Prisma.ListingSelect;

export type PublicListing = Prisma.ListingGetPayload<{
  select: typeof PUBLIC_SELECT;
}>;

/** All image URLs for a listing, parsed from the JSON `images` column. */
export function listingImages(listing: {
  images: string | null;
  imageUrl: string | null;
}): string[] {
  if (listing.images) {
    try {
      const parsed = JSON.parse(listing.images);
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is string => typeof x === "string");
      }
    } catch {
      /* fall through to imageUrl */
    }
  }
  return listing.imageUrl ? [listing.imageUrl] : [];
}

export function buildWhere(filter: ListingFilter): Prisma.ListingWhereInput {
  const and: Prisma.ListingWhereInput[] = [];

  if (filter.category) and.push({ category: filter.category });
  if (filter.subcategory) and.push({ subcategory: filter.subcategory });
  if (filter.place) and.push({ place: filter.place });
  if (filter.ids) and.push({ id: { in: filter.ids } });
  // Lists show only active listings; closed (sold/filled) ones stay reachable
  // by direct link but drop out of browse/search.
  if (!filter.includeClosed) and.push({ status: "active" });

  // Multi-term search: every word must appear in at least one field.
  if (filter.q) {
    const terms = filter.q.split(/\s+/).filter(Boolean);
    for (const term of terms) {
      and.push({
        OR: [
          { title: { contains: term } },
          { description: { contains: term } },
          { location: { contains: term } },
        ],
      });
    }
  }

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    const price: { gte?: number; lte?: number } = {};
    if (filter.minPrice !== undefined) price.gte = filter.minPrice;
    if (filter.maxPrice !== undefined) price.lte = filter.maxPrice;
    and.push({ price });
  }

  // Hide expired listings from public queries.
  if (!filter.includeExpired) {
    and.push({ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] });
  }

  return and.length ? { AND: and } : {};
}

export function buildOrderBy(
  sort: ListingFilter["sort"]
): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export async function getListings(filter: ListingFilter = {}) {
  const where = buildWhere(filter);
  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: buildOrderBy(filter.sort),
      take: filter.take ?? PAGE_SIZE,
      skip: filter.skip ?? 0,
      select: PUBLIC_SELECT,
    }),
    prisma.listing.count({ where }),
  ]);
  return { items, total };
}

export async function getListing(id: string): Promise<PublicListing | null> {
  return prisma.listing.findFirst({
    where: {
      id,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: PUBLIC_SELECT,
  });
}

/** Contact details for a single listing — served only from the contact endpoint. */
export async function getListingContact(id: string) {
  return prisma.listing.findFirst({
    where: {
      id,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: { contactName: true, contactEmail: true },
  });
}

/** Full listing, but only if the caller holds the matching edit token. */
export async function getListingForOwner(id: string, token: string) {
  if (!token) return null;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.editToken !== token) return null;
  return listing;
}

export async function getCategoryCounts(place?: string) {
  const grouped = await prisma.listing.groupBy({
    by: ["category"],
    where: {
      ...(place ? { place } : {}),
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  for (const g of grouped) map[g.category] = g._count._all;
  return map;
}
