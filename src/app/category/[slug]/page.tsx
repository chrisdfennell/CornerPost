import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getListings, PAGE_SIZE } from "@/lib/listings";
import { currentPlace } from "@/lib/place-server";
import { ListingGrid } from "@/components/ListingGrid";
import { SortSelect } from "@/components/SortSelect";
import { PriceFilter } from "@/components/PriceFilter";
import { Pagination } from "@/components/Pagination";
import { SubcategoryChips } from "@/components/SubcategoryChips";
import type { ListingFilter } from "@/lib/listings";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

function num(v: string | undefined): number | undefined {
  if (v === undefined || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  return { title: cat ? `${cat.name} · CornerPost` : "CornerPost" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sub?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const { sub, sort } = sp;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const place = await currentPlace();
  const page = Math.max(1, num(sp.page) ?? 1);
  const { items, total } = await getListings({
    category: slug,
    subcategory: sub,
    place: place?.slug,
    sort: (sort as ListingFilter["sort"]) ?? "newest",
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const activeSub = sub ? cat.subcategories.find((s) => s.slug === sub) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl ${cat.accent} text-2xl text-white`}
        >
          {cat.icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {activeSub ? activeSub.name : cat.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {cat.blurb}
            {place ? ` · ${place.label}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SubcategoryChips category={cat} active={sub} />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total.toLocaleString()} {total === 1 ? "listing" : "listings"}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <PriceFilter />
          <SortSelect />
        </div>
      </div>

      <div className="mt-8">
        <ListingGrid listings={items} />
      </div>

      <Pagination
        total={total}
        pageSize={PAGE_SIZE}
        page={page}
        searchParams={sp}
        basePath={`/category/${slug}`}
      />
    </div>
  );
}
