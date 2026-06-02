# CornerPost

A modern, good-looking local classifieds board — think Craigslist, but built for 2026. Buy, sell, rent, hire, and connect with your community.

![Categories: For Sale · Housing · Jobs · Services · Community · Gigs](https://img.shields.io/badge/categories-6-blue)

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Prisma 6** + **SQLite** for persistence
- **Zod** for API validation

## Features

- 🏠 Marketing home with hero, live category counts, featured + fresh listings
- 🗂️ Six top-level categories with subcategories (For Sale, Housing, Jobs, Services, Community, Gigs)
- 🔎 Full-text search across title, description, and location
- 🧭 Category & browse pages with subcategory filters and price/date sorting
- 📄 Listing detail pages with image, price, condition, and a privacy-friendly **reveal-contact** gate
- ✍️ "Post a listing" form with live category/subcategory selection and server-side validation
- 📱 Fully responsive, sticky header with search + quick category nav
- 🔌 JSON API at `/api/listings`

## Getting started

```bash
npm install          # also runs `prisma generate`
npm run db:push      # create the SQLite schema
npm run db:seed      # load 22 demo listings across all categories
npm run dev          # http://localhost:3000
```

Handy: `npm run db:reset` wipes and re-seeds the database.

## Project layout

```
prisma/
  schema.prisma        # Listing model
  seed.ts              # demo data
src/
  app/
    page.tsx           # home
    browse/            # all listings
    category/[slug]/   # category + subcategory filtering
    search/            # search results
    listing/[id]/      # listing detail
    post/              # create-listing form (client) 
    api/listings/      # GET (list) + POST (create), GET /[id]
  components/          # Header, Footer, ListingCard, SearchBar, etc.
  lib/
    categories.ts      # the category taxonomy (single source of truth)
    listings.ts        # query helpers (filter/sort/count)
    prisma.ts          # Prisma client singleton
    format.ts          # price + relative-time formatting
```

## Notes & next steps

This is a fully working first version with seeded data. Natural follow-ups:

- Real auth + "my listings" management (edit/delete)
- Image uploads (currently an image-URL field) via S3/UploadThing
- Pagination / infinite scroll (queries already support `take`/`skip`)
- Saved searches, favorites, and email alerts
- Geolocation-based "near me" filtering
