export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Contact";
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Label for a closed listing, tuned to the category ("Sold" vs "Filled"). */
export function closedLabel(category: string): string {
  if (category === "jobs" || category === "gigs") return "Filled";
  if (category === "for-sale" || category === "housing") return "Sold";
  return "Closed";
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: [number, string][] = [
    [60, "just now"],
    [3600, "minute"],
    [86400, "hour"],
    [2592000, "day"],
    [31536000, "month"],
    [Infinity, "year"],
  ];
  if (seconds < 60) return "just now";
  let unit = "year";
  let value = Math.floor(seconds / 31536000);
  if (seconds < 3600) {
    unit = "minute";
    value = Math.floor(seconds / 60);
  } else if (seconds < 86400) {
    unit = "hour";
    value = Math.floor(seconds / 3600);
  } else if (seconds < 2592000) {
    unit = "day";
    value = Math.floor(seconds / 86400);
  } else if (seconds < 31536000) {
    unit = "month";
    value = Math.floor(seconds / 2592000);
  }
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
