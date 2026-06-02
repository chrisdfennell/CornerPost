"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ModerationActions({
  token,
  reportId,
  listingId,
}: {
  token: string;
  reportId: string;
  listingId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"none" | "resolve" | "remove">("none");

  async function act(action: "resolve" | "remove") {
    if (action === "remove" && !confirm("Delete this listing permanently?")) return;
    setBusy(action);
    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, reportId, listingId }),
      });
      if (res.ok) router.refresh();
      else setBusy("none");
    } catch {
      setBusy("none");
    }
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={() => act("resolve")}
        disabled={busy !== "none"}
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand-300 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50 dark:hover:text-brand-400"
      >
        {busy === "resolve" ? "…" : "Dismiss"}
      </button>
      <button
        onClick={() => act("remove")}
        disabled={busy !== "none"}
        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-950/50 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/35"
      >
        {busy === "remove" ? "…" : "Remove listing"}
      </button>
    </div>
  );
}
