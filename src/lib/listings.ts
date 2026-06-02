import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ListingFilter = {
  category?: string;
  subcategory?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  take?: number;
  skip?: number;
};

export function buildWhere(filter: ListingFilter): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {};
  if (filter.category) where.category = filter.category;
  if (filter.subcategory) where.subcategory = filter.subcategory;

  if (filter.q) {
    where.OR = [
      { title: { contains: filter.q } },
      { description: { contains: filter.q } },
      { location: { contains: filter.q } },
    ];
  }

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    where.price = {};
    if (filter.minPrice !== undefined) where.price.gte = filter.minPrice;
    if (filter.maxPrice !== undefined) where.price.lte = filter.maxPrice;
  }

  return where;
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
      take: filter.take ?? 24,
      skip: filter.skip ?? 0,
    }),
    prisma.listing.count({ where }),
  ]);
  return { items, total };
}

export async function getListing(id: string) {
  return prisma.listing.findUnique({ where: { id } });
}

export async function getCategoryCounts() {
  const grouped = await prisma.listing.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  for (const g of grouped) map[g.category] = g._count._all;
  return map;
}
