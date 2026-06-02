import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getListing, getListings } from "@/lib/listings";
import { getCategory, getSubcategory, CONDITIONS } from "@/lib/categories";
import { formatPrice, timeAgo } from "@/lib/format";
import { ContactReveal } from "@/components/ContactReveal";
import { ListingCard } from "@/components/ListingCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  return { title: listing ? `${listing.title} · CornerPost` : "CornerPost" };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const cat = getCategory(listing.category);
  const sub = getSubcategory(listing.category, listing.subcategory);
  const conditionName = CONDITIONS.find(
    (c) => c.slug === listing.condition
  )?.name;

  const { items: related } = await getListings({
    category: listing.category,
    take: 5,
  });
  const relatedOthers = related.filter((l) => l.id !== listing.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        {cat && (
          <>
            <Link href={`/category/${cat.slug}`} className="hover:text-brand-600">
              {cat.name}
            </Link>
            <span>/</span>
          </>
        )}
        {sub && cat && (
          <Link
            href={`/category/${cat.slug}?sub=${sub.slug}`}
            className="hover:text-brand-600"
          >
            {sub.name}
          </Link>
        )}
      </nav>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            {listing.imageUrl ? (
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-7xl">
                {cat?.icon ?? "📦"}
              </div>
            )}
            {listing.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-amber-400/95 px-3 py-1 text-sm font-bold text-amber-950 shadow-sm backdrop-blur">
                ★ Featured
              </span>
            )}
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {listing.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                </svg>
                {listing.location}
              </span>
              <span>Posted {timeAgo(listing.createdAt)}</span>
            </div>
          </div>

          <article className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
            {listing.description}
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
            <p className="text-3xl font-extrabold text-ink">
              {formatPrice(listing.price)}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {cat && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-medium text-ink">{cat.name}</dd>
                </div>
              )}
              {sub && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-medium text-ink">{sub.name}</dd>
                </div>
              )}
              {conditionName && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Condition</dt>
                  <dd className="font-medium text-ink">{conditionName}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-ink">{listing.location}</dd>
              </div>
            </dl>
          </div>

          <ContactReveal
            name={listing.contactName}
            email={listing.contactEmail}
          />
        </aside>
      </div>

      {/* Related */}
      {relatedOthers.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            More in {cat?.name}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedOthers.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
