import { describe, it, expect } from "vitest";
import { CATEGORIES, getCategory, getSubcategory } from "@/lib/categories";

describe("getCategory", () => {
  it("resolves a known category", () => {
    expect(getCategory("for-sale")?.name).toBe("For Sale");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCategory("nope")).toBeUndefined();
  });
});

describe("getSubcategory", () => {
  it("resolves a subcategory within its category", () => {
    expect(getSubcategory("for-sale", "electronics")?.name).toBe("Electronics");
  });

  it("rejects a subcategory from a different category", () => {
    expect(getSubcategory("jobs", "electronics")).toBeUndefined();
  });
});

describe("taxonomy integrity", () => {
  it("has unique category slugs", () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique subcategory slugs within each category", () => {
    for (const c of CATEGORIES) {
      const subs = c.subcategories.map((s) => s.slug);
      expect(new Set(subs).size).toBe(subs.length);
    }
  });
});
