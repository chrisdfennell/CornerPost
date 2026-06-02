"use client";

import { useState } from "react";

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export function ContactReveal({
  listingId,
  name,
}: {
  listingId: string;
  name: string;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reveal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/listings/${listingId}/contact`);
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Too many requests — try again in a moment."
            : "Couldn't load contact info."
        );
        return;
      }
      const data = await res.json();
      setEmail(data.contactEmail as string);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
      <p className="text-sm font-medium text-slate-500">Posted by</p>
      <p className="mt-1 text-lg font-semibold text-ink">{name}</p>

      {email ? (
        <a
          href={`mailto:${email}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          <MailIcon />
          {email}
        </a>
      ) : (
        <button
          onClick={reveal}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
        >
          <MailIcon />
          {loading ? "Loading…" : "Show contact email"}
        </button>
      )}

      {error && (
        <p className="mt-2 text-center text-xs font-medium text-rose-600">
          {error}
        </p>
      )}

      <p className="mt-3 text-center text-xs text-slate-400">
        Meet in a public place. Never wire money or share financial details.
      </p>
    </div>
  );
}
