import { getListings } from "@/lib/listings";
import { ListingGrid } from "@/components/ListingGrid";
import { SortSelect } from "@/components/SortSelect";
import type { ListingFilter } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q = "", sort } = await searchParams;
  const query = q.trim();
  const { items, total } = await getListings({
    q: query || undefined,
    sort: (sort as ListingFilter["sort"]) ?? "newest",
    take: 48,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {query ? (
              <>
                Results for{" "}
                <span className="text-brand-600">“{query}”</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {total.toLocaleString()} {total === 1 ? "match" : "matches"}
          </p>
        </div>
        {total > 0 && <SortSelect />}
      </div>

      <div className="mt-8">
        <ListingGrid listings={items} />
      </div>
    </div>
  );
}
