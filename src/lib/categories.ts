export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  // Tailwind utility classes for the category accent color
  accent: string;
  icon: string; // emoji used as a lightweight icon
  blurb: string;
  subcategories: Subcategory[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "for-sale",
    name: "For Sale",
    accent: "bg-emerald-500",
    icon: "🛍️",
    blurb: "Buy and sell almost anything",
    subcategories: [
      { slug: "electronics", name: "Electronics" },
      { slug: "furniture", name: "Furniture" },
      { slug: "vehicles", name: "Vehicles" },
      { slug: "home-garden", name: "Home & Garden" },
      { slug: "clothing", name: "Clothing" },
      { slug: "free", name: "Free Stuff" },
    ],
  },
  {
    slug: "housing",
    name: "Housing",
    accent: "bg-sky-500",
    icon: "🏠",
    blurb: "Rentals, rooms, and real estate",
    subcategories: [
      { slug: "apartments", name: "Apartments / Rentals" },
      { slug: "rooms", name: "Rooms & Shared" },
      { slug: "for-sale-housing", name: "Real Estate for Sale" },
      { slug: "sublets", name: "Sublets & Temporary" },
      { slug: "parking", name: "Parking & Storage" },
    ],
  },
  {
    slug: "jobs",
    name: "Jobs",
    accent: "bg-violet-500",
    icon: "💼",
    blurb: "Full-time, part-time, and contract roles",
    subcategories: [
      { slug: "engineering", name: "Engineering & Tech" },
      { slug: "retail", name: "Retail & Food" },
      { slug: "admin", name: "Admin & Office" },
      { slug: "healthcare", name: "Healthcare" },
      { slug: "education", name: "Education" },
      { slug: "skilled-trades", name: "Skilled Trades" },
    ],
  },
  {
    slug: "services",
    name: "Services",
    accent: "bg-amber-500",
    icon: "🔧",
    blurb: "Hire local help for any job",
    subcategories: [
      { slug: "home-services", name: "Home & Repair" },
      { slug: "creative", name: "Creative & Design" },
      { slug: "lessons", name: "Lessons & Tutoring" },
      { slug: "automotive", name: "Automotive" },
      { slug: "events", name: "Events & Catering" },
    ],
  },
  {
    slug: "community",
    name: "Community",
    accent: "bg-rose-500",
    icon: "🤝",
    blurb: "Events, groups, and local notices",
    subcategories: [
      { slug: "events", name: "Events" },
      { slug: "groups", name: "Groups & Clubs" },
      { slug: "volunteers", name: "Volunteers" },
      { slug: "lost-found", name: "Lost & Found" },
      { slug: "general", name: "General" },
    ],
  },
  {
    slug: "gigs",
    name: "Gigs",
    accent: "bg-teal-500",
    icon: "⚡",
    blurb: "Short-term and one-off work",
    subcategories: [
      { slug: "creative-gigs", name: "Creative" },
      { slug: "labor", name: "Labor & Moving" },
      { slug: "computer", name: "Computer & Tech" },
      { slug: "event-gigs", name: "Event" },
      { slug: "talent", name: "Talent" },
    ],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_MAP[slug];
}

export function getSubcategory(
  categorySlug: string,
  subSlug: string
): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export const CONDITIONS = [
  { slug: "new", name: "New" },
  { slug: "like-new", name: "Like New" },
  { slug: "good", name: "Good" },
  { slug: "fair", name: "Fair" },
  { slug: "salvage", name: "For Parts" },
] as const;
