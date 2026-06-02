import { describe, it, expect } from "vitest";
import { isAlertMatch } from "./subscriptions";

describe("isAlertMatch", () => {
  const sub = {
    query: "road bike",
    place: "pittsburgh",
  };

  it("matches if keyword is present in title", () => {
    const listing = {
      title: "Vintage road bike for sale",
      description: "Fast ride, pick up in Oakland.",
      place: "pittsburgh",
    };
    expect(isAlertMatch(listing, sub)).toBe(true);
  });

  it("matches if keyword is present in description", () => {
    const listing = {
      title: "10-speed bicycle",
      description: "A wonderful road bike in great condition.",
      place: "pittsburgh",
    };
    expect(isAlertMatch(listing, sub)).toBe(true);
  });

  it("is case-insensitive", () => {
    const listing = {
      title: "Beautiful Road Bike!",
      description: "Great frame.",
      place: "pittsburgh",
    };
    expect(isAlertMatch(listing, sub)).toBe(true);
  });

  it("does not match if place does not match", () => {
    const listing = {
      title: "Vintage road bike for sale",
      description: "Pick up in Seattle.",
      place: "seattle",
    };
    expect(isAlertMatch(listing, sub)).toBe(false);
  });

  it("does not match if keyword is missing entirely", () => {
    const listing = {
      title: "Sofa / couch",
      description: "Leather surface, good shape.",
      place: "pittsburgh",
    };
    expect(isAlertMatch(listing, sub)).toBe(false);
  });
});
