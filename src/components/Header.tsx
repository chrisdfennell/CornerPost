import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { CATEGORIES } from "@/lib/categories";
import { currentPlace } from "@/lib/place-server";

function PlacePicker({ label }: { label: string }) {
  return (
    <Link
      href="/places"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
      aria-label="Change location"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="10" r="2.5" fill="currentColor" />
      </svg>
      {label}
      <span className="text-slate-300">▾</span>
    </Link>
  );
}

// SearchBar reads useSearchParams, which needs a Suspense boundary so pages
// that are statically generated (e.g. the 404) don't bail out of prerendering.
const searchFallback = (
  <div className="h-11 w-full rounded-full border border-slate-200 bg-white" />
);

export async function Header() {
  const place = await currentPlace();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <div className="hidden flex-1 md:block">
          <Suspense fallback={searchFallback}>
            <SearchBar />
          </Suspense>
        </div>

        <Link
          href="/favorites"
          aria-label="Saved listings"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-500 md:ml-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.3-9C1 8.5 2.5 5 6 5c2 0 3.2 1.1 4 2.3C10.8 6.1 12 5 14 5c3.5 0 5 3.5 3.3 7-2.3 4.4-9.3 9-9.3 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Saved</span>
        </Link>

        <Link
          href="/post"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Post
        </Link>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <Suspense fallback={searchFallback}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Category strip */}
      <nav className="border-t border-slate-100 bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PlacePicker label={place ? place.label : "Choose location"} />
          <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" />
          <Link
            href="/browse"
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink"
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink"
            >
              <span className="mr-1">{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
