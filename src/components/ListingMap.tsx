"use client";

import { useState } from "react";

export function ListingMap({
  location,
  placeLabel,
}: {
  location: string;
  placeLabel: string;
}) {
  const [showMap, setShowMap] = useState(true);
  const query = `${location}, ${placeLabel}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <h3 className="text-sm font-bold text-ink">📍 Approximate Location</h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Showing vicinity of {location}
        </p>
      </div>

      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-950">
        {showMap ? (
          <iframe
            title={`Approximate location map of ${location}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setShowMap(false)}
            className="opacity-90 dark:opacity-80 dark:invert-[0.9] dark:hue-rotate-[180deg]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-center p-4">
            <div>
              <p className="text-3xl">🗺️</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">Map unavailable offline</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
