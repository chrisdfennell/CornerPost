"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-500 dark:focus:ring-brand-900/30";

export function AlertSignup({
  query,
  placeSlug,
  placeLabel,
}: {
  query: string;
  placeSlug: string;
  placeLabel: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError(null);

    const payload = {
      email: email.trim(),
      query: query.trim(),
      place: placeSlug,
    };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save alert.");
        setLoading(false);
        return;
      }

      setSuccess(data.message ?? "Alert activated successfully!");
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  if (!query) return null; // Don't show if search keyword is empty

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-950/40 dark:bg-emerald-950/20">
        <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">🔔 Alert Live!</h4>
        <p className="mt-1.5 text-[11px] leading-normal text-emerald-700 dark:text-emerald-550">
          We will email you the moment a new listing matches <strong>“{query}”</strong> in <strong>{placeLabel}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Saved Search Alerts
      </h3>
      <p className="mt-1 text-sm font-bold text-ink">
        Get alert for “{query}”
      </p>
      <p className="mt-1 text-xs leading-normal text-slate-500 dark:text-slate-400">
        We'll email you immediately when a matching item is posted in {placeLabel}.
      </p>

      <form onSubmit={submit} className="mt-4 space-y-2">
        <input
          type="email"
          required
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        {error && (
          <p className="text-[10px] font-semibold text-rose-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Activating..." : "Email me matches 🔔"}
        </button>
      </form>
    </div>
  );
}
