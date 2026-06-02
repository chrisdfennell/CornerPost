import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Seed = {
  title: string;
  description: string;
  price: number | null;
  category: string;
  subcategory: string;
  location: string;
  condition?: string | null;
  imageUrl?: string | null;
  contactName: string;
  contactEmail: string;
  featured?: boolean;
  daysAgo?: number;
};

// Unsplash source images (stable photo IDs) keep the demo looking real.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

const LISTINGS: Seed[] = [
  // ---------- For Sale ----------
  {
    title: "MacBook Pro 14” M3 — barely used",
    description:
      "Space black, 18GB RAM, 512GB SSD. Bought 4 months ago, still under AppleCare. Includes original box and charger. No scratches, always kept in a sleeve.",
    price: 1450,
    category: "for-sale",
    subcategory: "electronics",
    location: "Brooklyn, NY",
    condition: "like-new",
    imageUrl: img("1517336714731-489689fd1ca8"),
    contactName: "Dana",
    contactEmail: "dana@example.com",
    featured: true,
    daysAgo: 0,
  },
  {
    title: "Mid-century walnut credenza",
    description:
      "Solid walnut, tapered legs, three sliding doors. A few minor surface marks consistent with age but structurally perfect. Local pickup only.",
    price: 620,
    category: "for-sale",
    subcategory: "furniture",
    location: "Portland, OR",
    condition: "good",
    imageUrl: img("1538688525198-9b88f6f53126"),
    contactName: "Marcus",
    contactEmail: "marcus@example.com",
    daysAgo: 1,
  },
  {
    title: "2018 Trek FX 3 hybrid bike",
    description:
      "Size M, recently tuned with new brake pads and chain. Great commuter. Includes rear rack and lights.",
    price: 380,
    category: "for-sale",
    subcategory: "vehicles",
    location: "Austin, TX",
    condition: "good",
    imageUrl: img("1485965120184-e220f721d03e"),
    contactName: "Priya",
    contactEmail: "priya@example.com",
    daysAgo: 2,
  },
  {
    title: "Monstera deliciosa — huge, healthy",
    description:
      "Moving and can't take it. Over 4ft tall with a dozen fenestrated leaves. Comes in ceramic pot.",
    price: 45,
    category: "for-sale",
    subcategory: "home-garden",
    location: "Seattle, WA",
    condition: "good",
    imageUrl: img("1614594975525-e45190c55d0b"),
    contactName: "Leah",
    contactEmail: "leah@example.com",
    daysAgo: 0,
  },
  {
    title: "Free moving boxes — already broken down",
    description:
      "About 20 medium/large boxes plus packing paper. First come first served, on the porch.",
    price: 0,
    category: "for-sale",
    subcategory: "free",
    location: "Denver, CO",
    condition: "fair",
    imageUrl: img("1530124566582-a618bc2615dc"),
    contactName: "Sam",
    contactEmail: "sam@example.com",
    daysAgo: 1,
  },
  {
    title: "Vintage Levi's denim jacket (M)",
    description:
      "Genuine 90s trucker jacket, perfectly broken in. Medium, fits true. No rips or stains.",
    price: 75,
    category: "for-sale",
    subcategory: "clothing",
    location: "Chicago, IL",
    condition: "good",
    imageUrl: img("1551537482-f2075a1d41f2"),
    contactName: "Theo",
    contactEmail: "theo@example.com",
    daysAgo: 3,
  },

  // ---------- Housing ----------
  {
    title: "Sunny 1BR in Capitol Hill — available July 1",
    description:
      "Bright corner unit with hardwood floors, dishwasher, and a small balcony. Cat-friendly. Heat and water included. Walk to everything.",
    price: 1850,
    category: "housing",
    subcategory: "apartments",
    location: "Seattle, WA",
    imageUrl: img("1502672260266-1c1ef2d93688"),
    contactName: "Kelsey",
    contactEmail: "kelsey@example.com",
    featured: true,
    daysAgo: 0,
  },
  {
    title: "Room in 3BR house, friendly housemates",
    description:
      "Furnished room in a quiet neighborhood, shared kitchen and backyard. Utilities split three ways. Looking for someone tidy and easygoing.",
    price: 800,
    category: "housing",
    subcategory: "rooms",
    location: "Austin, TX",
    imageUrl: img("1505691938895-1758d7feb511"),
    contactName: "Jordan",
    contactEmail: "jordan@example.com",
    daysAgo: 2,
  },
  {
    title: "2BR condo for sale — river views",
    description:
      "Updated kitchen, in-unit laundry, deeded parking, and a balcony overlooking the river. Low HOA. Motivated seller.",
    price: 389000,
    category: "housing",
    subcategory: "for-sale-housing",
    location: "Pittsburgh, PA",
    imageUrl: img("1560448204-e02f11c3d0e2"),
    contactName: "Rosa",
    contactEmail: "rosa@example.com",
    daysAgo: 4,
  },
  {
    title: "Summer sublet — fully furnished studio",
    description:
      "June through August, everything included. Great natural light, fast internet, walkable to campus and cafes.",
    price: 1200,
    category: "housing",
    subcategory: "sublets",
    location: "Boston, MA",
    imageUrl: img("1522708323590-d24dbb6b0267"),
    contactName: " Amir".trim(),
    contactEmail: "amir@example.com",
    daysAgo: 1,
  },

  // ---------- Jobs ----------
  {
    title: "Senior Frontend Engineer (React)",
    description:
      "Series B startup hiring a senior engineer to own our design system and core product surfaces. Remote-friendly within US time zones. Competitive salary + equity.",
    price: 165000,
    category: "jobs",
    subcategory: "engineering",
    location: "Remote (US)",
    imageUrl: img("1498050108023-c5249f4df085"),
    contactName: "Hiring Team",
    contactEmail: "jobs@example.com",
    featured: true,
    daysAgo: 1,
  },
  {
    title: "Barista — weekend mornings",
    description:
      "Busy neighborhood cafe looking for a friendly barista. Latte art a plus but we'll train. Free coffee, obviously.",
    price: null,
    category: "jobs",
    subcategory: "retail",
    location: "Portland, OR",
    imageUrl: img("1495474472287-4d71bcdd2085"),
    contactName: "Bluebird Cafe",
    contactEmail: "hello@example.com",
    daysAgo: 0,
  },
  {
    title: "Registered Nurse — day shift",
    description:
      "Outpatient clinic seeking an RN for our growing primary care team. Mon–Fri, no nights or weekends. Full benefits.",
    price: 82000,
    category: "jobs",
    subcategory: "healthcare",
    location: "Columbus, OH",
    imageUrl: img("1576091160550-2173dba999ef"),
    contactName: "Clinic HR",
    contactEmail: "hr@example.com",
    daysAgo: 3,
  },

  // ---------- Services ----------
  {
    title: "Licensed handyman — same-week availability",
    description:
      "20 years experience. Drywall, fixtures, mounting, small electrical and plumbing. Free estimates, fully insured.",
    price: null,
    category: "services",
    subcategory: "home-services",
    location: "Denver, CO",
    imageUrl: img("1581578731548-c64695cc6952"),
    contactName: "Mike's Repairs",
    contactEmail: "mike@example.com",
    daysAgo: 2,
  },
  {
    title: "Brand & logo design for small businesses",
    description:
      "Independent designer offering logo, brand kit, and social templates. Clear flat-rate packages, fast turnaround, unlimited revisions on the core concept.",
    price: 600,
    category: "services",
    subcategory: "creative",
    location: "Remote",
    imageUrl: img("1561070791-2526d30994b5"),
    contactName: "Nadia",
    contactEmail: "nadia@example.com",
    daysAgo: 1,
  },
  {
    title: "Guitar lessons — all levels, first one free",
    description:
      "Berklee grad teaching acoustic and electric, in-person or over video. Beginners welcome. Flexible evenings.",
    price: 40,
    category: "services",
    subcategory: "lessons",
    location: "Nashville, TN",
    imageUrl: img("1510915361894-db8b60106cb1"),
    contactName: "Chris",
    contactEmail: "chris@example.com",
    daysAgo: 5,
  },

  // ---------- Community ----------
  {
    title: "Saturday neighborhood cleanup + coffee",
    description:
      "Join us this Saturday at 9am at the park entrance. Gloves and bags provided. Free coffee and pastries after. All ages welcome!",
    price: 0,
    category: "community",
    subcategory: "events",
    location: "Minneapolis, MN",
    imageUrl: img("1559027615-cd4628902d4a"),
    contactName: "Green Streets",
    contactEmail: "volunteer@example.com",
    featured: true,
    daysAgo: 0,
  },
  {
    title: "Beginner-friendly run club, Tuesdays",
    description:
      "Easy 5k along the waterfront every Tuesday evening. No pace pressure, we wait for everyone. Stick around for a drink after.",
    price: 0,
    category: "community",
    subcategory: "groups",
    location: "San Diego, CA",
    imageUrl: img("1476480862126-209bfaa8edc8"),
    contactName: "Harbor Runners",
    contactEmail: "run@example.com",
    daysAgo: 2,
  },
  {
    title: "Found: orange tabby near Oak & 5th",
    description:
      "Very friendly, no collar, hanging around our porch. Clearly someone's pet. Message me to identify and claim.",
    price: null,
    category: "community",
    subcategory: "lost-found",
    location: "Sacramento, CA",
    imageUrl: img("1514888286974-6c03e2ca1dba"),
    contactName: "Wendy",
    contactEmail: "wendy@example.com",
    daysAgo: 1,
  },

  // ---------- Gigs ----------
  {
    title: "Need 2 helpers for a Saturday move",
    description:
      "Loading a truck from a 2nd floor walkup, about 4 hours. Cash same day plus pizza. Must be able to lift 50lbs.",
    price: 120,
    category: "gigs",
    subcategory: "labor",
    location: "Brooklyn, NY",
    imageUrl: img("1530268729831-4b0b9e170218"),
    contactName: "Devon",
    contactEmail: "devon@example.com",
    daysAgo: 0,
  },
  {
    title: "Photographer for a small wedding",
    description:
      "Intimate backyard wedding, ~30 guests, 3 hours of coverage. Looking for someone with a portfolio. Edited gallery within 2 weeks.",
    price: 800,
    category: "gigs",
    subcategory: "event-gigs",
    location: "Asheville, NC",
    imageUrl: img("1519741497674-611481863552"),
    contactName: "Hannah",
    contactEmail: "hannah@example.com",
    daysAgo: 3,
  },
  {
    title: "WordPress fix — site won't load after update",
    description:
      "White screen after a plugin update. Need someone to get it back up today. Quick job for the right person, paid hourly.",
    price: 75,
    category: "gigs",
    subcategory: "computer",
    location: "Remote",
    imageUrl: img("1517694712202-14dd9538aa97"),
    contactName: "Owen",
    contactEmail: "owen@example.com",
    daysAgo: 1,
  },
];

async function main() {
  console.log("Clearing existing listings…");
  await prisma.listing.deleteMany();

  console.log(`Seeding ${LISTINGS.length} listings…`);
  for (const l of LISTINGS) {
    const createdAt = new Date(
      Date.now() - (l.daysAgo ?? 0) * 24 * 60 * 60 * 1000
    );
    await prisma.listing.create({
      data: {
        title: l.title,
        description: l.description,
        price: l.price ?? null,
        category: l.category,
        subcategory: l.subcategory,
        location: l.location,
        condition: l.condition ?? null,
        imageUrl: l.imageUrl ?? null,
        contactName: l.contactName,
        contactEmail: l.contactEmail,
        featured: l.featured ?? false,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
