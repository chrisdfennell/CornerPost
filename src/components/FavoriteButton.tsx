"use client";

import { useEffect, useState } from "react";
import {
  isFavorite,
  toggleFavorite,
  FAVORITES_EVENT,
} from "@/lib/favorites";

export function FavoriteButton({
  listingId,
  variant = "card",
}: {
  listingId: string;
  variant?: "card" | "detail";
}) {
  const [fav, setFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFav(isFavorite(listingId));
    const sync = () => setFav(isFavorite(listingId));
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_EVENT, sync);
  }, [listingId]);

  function onClick(e: React.MouseEvent) {
    // Cards are wrapped in a Link; don't navigate when hearting.
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(listingId));
  }

  const base =
    variant === "detail"
      ? "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition"
      : "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-900/90 dark:shadow-black/40 dark:hover:bg-slate-800";

  const colored = fav ? "text-rose-500" : "text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400";
  const detailColors = fav
    ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950/50 dark:bg-rose-950/20 dark:text-rose-400"
    : "border-slate-200 bg-white text-slate-600 hover:text-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-rose-400";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Save to favorites"}
      // Avoid a hydration flash before localStorage is read.
      suppressHydrationWarning
      className={`${base} ${variant === "detail" ? detailColors : colored}`}
    >
      <svg
        width={variant === "detail" ? 18 : 18}
        height={variant === "detail" ? 18 : 18}
        viewBox="0 0 24 24"
        fill={mounted && fav ? "currentColor" : "none"}
        aria-hidden="true"
      >
        <path
          d="M12 21s-7-4.6-9.3-9C1 8.5 2.5 5 6 5c2 0 3.2 1.1 4 2.3C10.8 6.1 12 5 14 5c3.5 0 5 3.5 3.3 7-2.3 4.4-9.3 9-9.3 9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {variant === "detail" && (fav ? "Saved" : "Save")}
    </button>
  );
}
