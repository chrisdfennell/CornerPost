"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListingGrid } from "@/components/ListingGrid";
import type { ListingCardData } from "@/components/ListingCard";
import { getFavorites, FAVORITES_EVENT } from "@/lib/favorites";

export default function FavoritesPage() {
  const [items, setItems] = useState<ListingCardData[] | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const ids = getFavorites();
      if (ids.length === 0) {
        if (active) setItems([]);
        return;
      }
      try {
        const res = await fetch(`/api/listings?ids=${ids.join(",")}`);
        const data = await res.json();
        if (!active) return;
        // Preserve the user's saved order (most-recently added last).
        const byId = new Map<string, ListingCardData>(
          (data.items as ListingCardData[]).map((l) => [l.id, l])
        );
        setItems(ids.map((id) => byId.get(id)).filter(Boolean) as ListingCardData[]);
      } catch {
        if (active) setItems([]);
      }
    }

    load();
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(FAVORITES_EVENT, load);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Saved listings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {items === null
            ? "Loading…"
            : `${items.length} saved ${items.length === 1 ? "listing" : "listings"} · stored on this device`}
        </p>
      </div>

      <div className="mt-8">
        {items === null ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-20 text-center">
            <div className="text-5xl">🤍</div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              No saved listings yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Tap the heart on any listing to save it here for later.
            </p>
            <Link
              href="/browse"
              className="mt-5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Browse listings
            </Link>
          </div>
        ) : (
          <ListingGrid listings={items} />
        )}
      </div>
    </div>
  );
}
