import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, getListings, listingImages } from "@/lib/listings";
import { getCategory, getSubcategory, CONDITIONS } from "@/lib/categories";
import { getPlace } from "@/lib/places";
import { formatPrice, timeAgo, closedLabel } from "@/lib/format";
import { ContactReveal } from "@/components/ContactReveal";
import { ListingCard } from "@/components/ListingCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReportButton } from "@/components/ReportButton";
import { Gallery } from "@/components/Gallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Not found" };

  const description = listing.description.slice(0, 200);
  const images = listing.imageUrl ? [listing.imageUrl] : undefined;
  return {
    title: listing.title,
    description,
    openGraph: {
      type: "website",
      title: listing.title,
      description,
      url: `/listing/${listing.id}`,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: listing.title,
      description,
      images,
    },
  };
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
  const closed = listing.status !== "active";
  const images = listingImages(listing);
  const conditionName = CONDITIONS.find(
    (c) => c.slug === listing.condition
  )?.name;

  const place = getPlace(listing.place);
  const { items: related } = await getListings({
    category: listing.category,
    place: listing.place,
    take: 5,
  });
  const relatedOthers = related.filter((l) => l.id !== listing.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    ...(listing.imageUrl ? { image: listing.imageUrl } : {}),
    ...(listing.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <Gallery
            images={images}
            alt={listing.title}
            featured={listing.featured}
            closedLabel={closed ? closedLabel(listing.category) : undefined}
            fallbackIcon={cat?.icon ?? "📦"}
          />

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
              {place && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Area</dt>
                  <dd className="font-medium text-ink">
                    <Link href={`/api/place?slug=${place.slug}&next=/browse`} className="hover:text-brand-600">
                      {place.label}
                    </Link>
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-ink">{listing.location}</dd>
              </div>
            </dl>
          </div>

          <ContactReveal listingId={listing.id} name={listing.contactName} />

          <div className="flex justify-center">
            <FavoriteButton listingId={listing.id} variant="detail" />
          </div>

          <ReportButton listingId={listing.id} />
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
