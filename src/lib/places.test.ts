import { describe, it, expect } from "vitest";
import { PLACES, STATES, getPlace, isValidPlace } from "@/lib/places";

describe("places taxonomy", () => {
  it("has globally unique metro slugs", () => {
    const slugs = PLACES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers all 50 states plus DC", () => {
    expect(STATES.length).toBe(51);
  });

  it("has at least 3 metros per state (DC excepted)", () => {
    const thin = STATES.filter((s) => s.code !== "DC" && s.metros.length < 3);
    expect(thin.map((s) => s.code)).toEqual([]);
  });

  it("resolves a known metro with its state label", () => {
    const seattle = getPlace("seattle");
    expect(seattle?.name).toBe("Seattle");
    expect(seattle?.label).toBe("Seattle, WA");
  });

  it("validates slugs", () => {
    expect(isValidPlace("seattle")).toBe(true);
    expect(isValidPlace("atlantis")).toBe(false);
    expect(isValidPlace(undefined)).toBe(false);
    expect(isValidPlace(null)).toBe(false);
  });
});
