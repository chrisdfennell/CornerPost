import { describe, it, expect } from "vitest";
import { buildWhere, buildOrderBy, listingImages } from "@/lib/listings";

describe("buildWhere", () => {
  it("filters by category and subcategory", () => {
    const where = buildWhere({ category: "for-sale", subcategory: "electronics" });
    expect(where.AND).toContainEqual({ category: "for-sale" });
    expect(where.AND).toContainEqual({ subcategory: "electronics" });
  });

  it("requires every search term to match some field (AND of terms)", () => {
    const where = buildWhere({ q: "red bike" });
    const and = where.AND as Array<Record<string, unknown>>;
    const termClauses = and.filter((c) => "OR" in c);
    // one OR-clause per term, plus the expiry OR-clause
    expect(termClauses.length).toBe(3);
    expect(termClauses[0]).toEqual({
      OR: [
        { title: { contains: "red" } },
        { description: { contains: "red" } },
        { location: { contains: "red" } },
      ],
    });
  });

  it("filters by place (metro)", () => {
    const where = buildWhere({ place: "seattle" });
    expect(where.AND).toContainEqual({ place: "seattle" });
  });

  it("applies price bounds", () => {
    const where = buildWhere({ minPrice: 10, maxPrice: 100 });
    expect(where.AND).toContainEqual({ price: { gte: 10, lte: 100 } });
  });

  it("shows only active listings by default", () => {
    const where = buildWhere({});
    expect(where.AND).toContainEqual({ status: "active" });
  });

  it("includes closed listings when asked", () => {
    const where = buildWhere({ includeClosed: true });
    expect(where.AND).not.toContainEqual({ status: "active" });
  });

  it("filters by a set of ids", () => {
    const where = buildWhere({ ids: ["a", "b"] });
    expect(where.AND).toContainEqual({ id: { in: ["a", "b"] } });
  });

  it("hides expired listings by default", () => {
    const where = buildWhere({});
    const and = where.AND as Array<Record<string, unknown>>;
    expect(and.some((c) => "OR" in c)).toBe(true);
  });

  it("includes everything when expiry and closed filters are off", () => {
    const where = buildWhere({ includeExpired: true, includeClosed: true });
    // no clauses at all → empty where
    expect(where).toEqual({});
  });
});

describe("listingImages", () => {
  it("parses the JSON images array", () => {
    expect(
      listingImages({ images: '["a","b","c"]', imageUrl: "a" })
    ).toEqual(["a", "b", "c"]);
  });

  it("falls back to imageUrl when images is null", () => {
    expect(listingImages({ images: null, imageUrl: "cover" })).toEqual([
      "cover",
    ]);
  });

  it("returns an empty array when there are no images", () => {
    expect(listingImages({ images: null, imageUrl: null })).toEqual([]);
  });

  it("tolerates malformed JSON", () => {
    expect(listingImages({ images: "not json", imageUrl: "x" })).toEqual(["x"]);
  });
});

describe("buildOrderBy", () => {
  it("sorts price ascending then newest", () => {
    expect(buildOrderBy("price-asc")).toEqual([
      { price: "asc" },
      { createdAt: "desc" },
    ]);
  });

  it("sorts price descending then newest", () => {
    expect(buildOrderBy("price-desc")).toEqual([
      { price: "desc" },
      { createdAt: "desc" },
    ]);
  });

  it("defaults to featured then newest", () => {
    expect(buildOrderBy(undefined)).toEqual([
      { featured: "desc" },
      { createdAt: "desc" },
    ]);
  });
});
