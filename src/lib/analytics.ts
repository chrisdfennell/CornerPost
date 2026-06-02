/**
 * Takes an array of view hits and buckets them by calendar date for the specified sequence of days.
 */
export function bucketViewsByDate(
  views: { createdAt: Date }[],
  days: Date[]
): { day: string; views: number }[] {
  return days.map((d) => {
    const dateStringKey = d.toDateString();
    const matches = views.filter((v) => {
      const viewDate = typeof v.createdAt === "string" ? new Date(v.createdAt) : v.createdAt;
      return viewDate.toDateString() === dateStringKey;
    }).length;
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      views: matches,
    };
  });
}
