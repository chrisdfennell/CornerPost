import { getListings, PAGE_SIZE } from "@/lib/listings";
import { currentPlace } from "@/lib/place-server";
import { ListingGrid } from "@/components/ListingGrid";
import { SortSelect } from "@/components/SortSelect";
import { PriceFilter } from "@/components/PriceFilter";
import { Pagination } from "@/components/Pagination";
import type { ListingFilter } from "@/lib/listings";

export const dynamic = "force-dynamic";

function num(v: string | undefined): number | undefined {
  if (v === undefined || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const place = await currentPlace();
  const page = Math.max(1, num(sp.page) ?? 1);
  const sort = (sp.sort as ListingFilter["sort"]) ?? "newest";
  const { items, total } = await getListings({
    place: place?.slug,
    sort,
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              All listings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {total.toLocaleString()} listings across every category
              {place ? ` in ${place.label}` : ""}
            </p>
          </div>
          <SortSelect />
        </div>
        <PriceFilter />
      </div>

      <div className="mt-8">
        <ListingGrid listings={items} />
      </div>

      <Pagination
        total={total}
        pageSize={PAGE_SIZE}
        page={page}
        searchParams={sp}
        basePath="/browse"
      />
    </div>
  );
}
