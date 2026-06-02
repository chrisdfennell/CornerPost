import React from "react";

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      {/* Media placeholder */}
      <div className="animate-shimmer relative aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800" />

      {/* Info placeholder */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category tag */}
        <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        </div>

        {/* Location & date */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 h-4 w-48 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Gallery column */}
        <div>
          {/* Main image placeholder */}
          <div className="aspect-[1.8/1] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          {/* Title and metadata block */}
          <div className="mt-6 space-y-4">
            <div className="h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            <div className="flex gap-4">
              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            </div>
          </div>
          {/* Body content */}
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-4">
          {/* Specs card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow dark:border-slate-800 dark:bg-slate-900/50">
            <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
            <div className="mt-4 space-y-3">
              <div className="flex justify-between h-4">
                <div className="w-16 rounded bg-slate-100 dark:bg-slate-800 animate-shimmer" />
                <div className="w-20 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
              </div>
              <div className="flex justify-between h-4">
                <div className="w-12 rounded bg-slate-100 dark:bg-slate-800 animate-shimmer" />
                <div className="w-24 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
              </div>
              <div className="flex justify-between h-4">
                <div className="w-16 rounded bg-slate-100 dark:bg-slate-800 animate-shimmer" />
                <div className="w-16 rounded bg-slate-200 dark:bg-slate-800 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Contact reveal card */}
          <div className="h-32 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
