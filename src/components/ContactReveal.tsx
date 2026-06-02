"use client";

import { useState } from "react";

export function ContactReveal({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
      <p className="text-sm font-medium text-slate-500">Posted by</p>
      <p className="mt-1 text-lg font-semibold text-ink">{name}</p>

      {revealed ? (
        <a
          href={`mailto:${email}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
          </svg>
          {email}
        </a>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
          </svg>
          Show contact email
        </button>
      )}

      <p className="mt-3 text-center text-xs text-slate-400">
        Meet in a public place. Never wire money or share financial details.
      </p>
    </div>
  );
}
