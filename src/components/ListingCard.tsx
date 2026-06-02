import Link from "next/link";
import Image from "next/image";
import { formatPrice, timeAgo } from "@/lib/format";
import { getCategory } from "@/lib/categories";

export type ListingCardData = {
  id: string;
  title: string;
  price: number | null;
  category: string;
  subcategory: string;
  location: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date | string;
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const cat = getCategory(listing.category);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow transition-all duration-200 hover:-translate-y-1 hover:card-shadow-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl">
            {cat?.icon ?? "📦"}
          </div>
        )}

        {listing.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm backdrop-blur">
            ★ Featured
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-ink shadow-sm backdrop-blur">
          {formatPrice(listing.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {cat && (
          <span className="inline-flex w-fit items-center gap-1 text-xs font-medium text-slate-400">
            <span className={`h-2 w-2 rounded-full ${cat.accent}`} />
            {cat.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug text-ink transition-colors group-hover:text-brand-700">
          {listing.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 truncate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="10" r="2.5" fill="currentColor" />
            </svg>
            <span className="truncate">{listing.location}</span>
          </span>
          <span className="shrink-0">{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
