"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ManageActions({
  listingId,
  token,
  status,
  closedLabel,
}: {
  listingId: string;
  token: string;
  status: string;
  closedLabel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"none" | "renew" | "delete" | "status">("none");
  const [error, setError] = useState<string | null>(null);
  const [renewed, setRenewed] = useState(false);
  const isClosed = status !== "active";

  async function toggleStatus() {
    setBusy("status");
    setError(null);
    try {
      const res = await fetch(`/api/listings/${listingId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: isClosed ? "active" : "closed" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't update status.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy("none");
    }
  }

  async function renew() {
    setBusy("renew");
    setError(null);
    try {
      const res = await fetch(`/api/listings/${listingId}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't renew listing.");
        return;
      }
      setRenewed(true);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy("none");
    }
  }

  async function remove() {
    if (!confirm("Delete this listing permanently? This can't be undone.")) {
      return;
    }
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(
        `/api/listings/${listingId}?token=${encodeURIComponent(token)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't delete listing.");
        setBusy("none");
        return;
      }
      router.push("/browse");
    } catch {
      setError("Network error — please try again.");
      setBusy("none");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      <h2 className="font-semibold text-ink">Manage</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Renew to reset the 30-day clock, or remove the listing entirely.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={toggleStatus}
          disabled={busy !== "none"}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50 dark:hover:text-brand-400"
        >
          {busy === "status"
            ? "Updating…"
            : isClosed
              ? "Reopen listing"
              : `Mark as ${closedLabel.toLowerCase()}`}
        </button>
        <button
          onClick={renew}
          disabled={busy !== "none"}
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy === "renew" ? "Renewing…" : renewed ? "Renewed ✓" : "Renew 30 days"}
        </button>
        <button
          onClick={remove}
          disabled={busy !== "none"}
          className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-950/50 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/35"
        >
          {busy === "delete" ? "Deleting…" : "Delete listing"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
