import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getListings, getCategoryCounts } from "@/lib/listings";
import { currentPlace } from "@/lib/place-server";
import { ListingGrid } from "@/components/ListingGrid";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const place = await currentPlace();
  const slug = place?.slug;
  const [{ items: featured }, { items: recent }, counts] = await Promise.all([
    getListings({ place: slug, take: 4, sort: "newest" }),
    getListings({ place: slug, take: 8, sort: "newest" }),
    getCategoryCounts(slug),
  ]);

  const featuredOnly = featured.filter((l) => l.featured).slice(0, 4);
  const totalListings = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Hero */}
      <section className="hero-mesh border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm font-medium text-slate-600 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {totalListings.toLocaleString()} live listings
              {place ? ` in ${place.name}` : " near you"}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl">
              Your corner of the
              <span className="text-brand-600"> local market</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Buy, sell, rent, hire, and connect with the people around you — on
              a classifieds board that doesn’t look like it’s from 1999.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="lg" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
              <span>Popular:</span>
              {["electronics", "apartments", "engineering", "free"].map((s) => {
                const label =
                  s === "free"
                    ? "Free stuff"
                    : s.charAt(0).toUpperCase() + s.slice(1);
                return (
                  <Link
                    key={s}
                    href={`/search?q=${s}`}
                    className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200 transition hover:text-brand-700 hover:ring-brand-300"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Categories */}
        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Browse by category
            </h2>
            <Link
              href="/browse"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              See everything →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 card-shadow transition-all hover:-translate-y-1 hover:card-shadow-hover"
              >
                <span
                  className={`absolute -right-6 -top-6 h-16 w-16 rounded-full ${c.accent} opacity-10 transition-transform group-hover:scale-150`}
                />
                <span className="text-3xl">{c.icon}</span>
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-slate-400">
                  {(counts[c.slug] ?? 0).toLocaleString()} listings
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featuredOnly.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">★</span>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Featured
              </h2>
            </div>
            <div className="mt-6">
              <ListingGrid listings={featuredOnly} />
            </div>
          </section>
        )}

        {/* Recent */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Fresh listings
            </h2>
            <Link
              href="/browse"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6">
            <ListingGrid listings={recent} />
          </div>
        </section>
      </div>
    </>
  );
}
