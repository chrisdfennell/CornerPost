import { getListings, PAGE_SIZE } from "@/lib/listings";
import { currentPlace } from "@/lib/place-server";
import { ListingGrid } from "@/components/ListingGrid";
import { SortSelect } from "@/components/SortSelect";
import { PriceFilter } from "@/components/PriceFilter";
import { Pagination } from "@/components/Pagination";
import { AlertSignup } from "@/components/AlertSignup";
import type { ListingFilter } from "@/lib/listings";

export const dynamic = "force-dynamic";

function num(v: string | undefined): number | undefined {
  if (v === undefined || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const place = await currentPlace();
  const query = (sp.q ?? "").trim();
  const page = Math.max(1, num(sp.page) ?? 1);
  const { items, total } = await getListings({
    q: query || undefined,
    place: place?.slug,
    sort: (sp.sort as ListingFilter["sort"]) ?? "newest",
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {query ? (
                <>
                  Results for{" "}
                  <span className="text-brand-600 dark:text-brand-500">“{query}”</span>
                </>
              ) : (
                "Search"
              )}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {total.toLocaleString()} {total === 1 ? "match" : "matches"}
              {place ? ` in ${place.label}` : ""}
            </p>
          </div>
          {total > 0 && <SortSelect />}
        </div>
        <PriceFilter />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <ListingGrid listings={items} />
        </div>
        <aside className="space-y-4">
          {place && query && (
            <AlertSignup
              query={query}
              placeSlug={place.slug}
              placeLabel={place.label}
            />
          )}
        </aside>
      </div>

      <Pagination
        total={total}
        pageSize={PAGE_SIZE}
        page={page}
        searchParams={sp}
        basePath="/search"
      />
    </div>
  );
}
