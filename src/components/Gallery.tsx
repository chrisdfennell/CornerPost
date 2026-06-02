"use client";

import { useState } from "react";
import Image from "next/image";

export function Gallery({
  images,
  alt,
  featured,
  closedLabel,
  fallbackIcon,
}: {
  images: string[];
  alt: string;
  featured: boolean;
  closedLabel?: string;
  fallbackIcon: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {current ? (
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-7xl">
            {fallbackIcon}
          </div>
        )}
        {featured && !closedLabel && (
          <span className="absolute left-4 top-4 rounded-full bg-amber-400/95 px-3 py-1 text-sm font-bold text-amber-950 shadow-sm backdrop-blur">
            ★ Featured
          </span>
        )}
        {closedLabel && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ink/70 py-3 text-center text-xl font-bold uppercase tracking-wide text-white">
            {closedLabel}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active
                  ? "border-brand-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
