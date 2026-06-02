import { ListingCard, type ListingCardData } from "./ListingCard";

export function ListingGrid({ listings }: { listings: ListingCardData[] }) {
  if (listings.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-20 text-center">
        <div className="text-5xl">🔍</div>
        <h3 className="mt-4 text-lg font-semibold text-ink">
          Nothing here yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No listings match what you’re looking for. Try a different category or
          be the first to post one.
        </p>
        <a
          href="/post"
          className="mt-5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Post a listing
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
