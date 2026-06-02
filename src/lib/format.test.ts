import { describe, it, expect } from "vitest";
import { formatPrice, timeAgo, closedLabel } from "@/lib/format";

describe("formatPrice", () => {
  it("shows 'Contact' for null/undefined", () => {
    expect(formatPrice(null)).toBe("Contact");
    expect(formatPrice(undefined)).toBe("Contact");
  });

  it("shows 'Free' for zero", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("formats whole-dollar amounts without cents", () => {
    expect(formatPrice(1450)).toBe("$1,450");
  });
});

describe("closedLabel", () => {
  it("says Filled for jobs and gigs", () => {
    expect(closedLabel("jobs")).toBe("Filled");
    expect(closedLabel("gigs")).toBe("Filled");
  });
  it("says Sold for goods and housing", () => {
    expect(closedLabel("for-sale")).toBe("Sold");
    expect(closedLabel("housing")).toBe("Sold");
  });
  it("falls back to Closed", () => {
    expect(closedLabel("services")).toBe("Closed");
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for the current time", () => {
    expect(timeAgo(new Date())).toBe("just now");
  });

  it("singularizes a one-unit interval", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(timeAgo(oneHourAgo)).toBe("1 hour ago");
  });

  it("pluralizes multi-unit intervals", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(timeAgo(threeDaysAgo)).toBe("3 days ago");
  });
});
