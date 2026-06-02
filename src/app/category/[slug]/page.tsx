import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getListings } from "@/lib/listings";
import { ListingGrid } from "@/components/ListingGrid";
import { SortSelect } from "@/components/SortSelect";
import { SubcategoryChips } from "@/components/SubcategoryChips";
import type { ListingFilter } from "@/lib/listings";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { sub, sort } = await searchParams;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const { items, total } = await getListings({
    category: slug,
    subcategory: sub,
    sort: (sort as ListingFilter["sort"]) ?? "newest",
    take: 48,
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
          <p className="text-sm text-slate-500">{cat.blurb}</p>
        </div>
      </div>

      <div className="mt-6">
        <SubcategoryChips category={cat} active={sub} />
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <p className="text-sm text-slate-500">
          {total.toLocaleString()} {total === 1 ? "listing" : "listings"}
        </p>
        <SortSelect />
      </div>

      <div className="mt-8">
        <ListingGrid listings={items} />
      </div>
    </div>
  );
}
