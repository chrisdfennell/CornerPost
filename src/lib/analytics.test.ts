import { describe, it, expect } from "vitest";
import { bucketViewsByDate } from "./analytics";

describe("bucketViewsByDate", () => {
  const days = [
    new Date("2026-06-01T12:00:00"),
    new Date("2026-06-02T12:00:00"),
    new Date("2026-06-03T12:00:00"),
  ];

  it("correctly counts views inside matching calendar dates", () => {
    const views = [
      { createdAt: new Date("2026-06-01T08:00:00") },
      { createdAt: new Date("2026-06-01T18:30:00") },
      { createdAt: new Date("2026-06-03T01:15:00") },
    ];

    const result = bucketViewsByDate(views, days);
    
    expect(result).toEqual([
      { day: "Mon", views: 2 },
      { day: "Tue", views: 0 },
      { day: "Wed", views: 1 },
    ]);
  });

  it("handles empty view lists", () => {
    const result = bucketViewsByDate([], days);
    expect(result).toEqual([
      { day: "Mon", views: 0 },
      { day: "Tue", views: 0 },
      { day: "Wed", views: 0 },
    ]);
  });
});
