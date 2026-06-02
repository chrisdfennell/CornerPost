/**
 * Returns true if a new listing matches a saved search subscription (same place area,
 * and the query keyword matches the listing title or description case-insensitively).
 */
export function isAlertMatch(
  listing: { title: string; description: string; place: string },
  subscription: { query: string; place: string }
): boolean {
  if (listing.place !== subscription.place) return false;
  const keyword = subscription.query.toLowerCase();
  return (
    listing.title.toLowerCase().includes(keyword) ||
    listing.description.toLowerCase().includes(keyword)
  );
}
