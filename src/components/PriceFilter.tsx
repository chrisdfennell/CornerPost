"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export function PriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (min.trim() === "") next.delete("minPrice");
    else next.set("minPrice", String(Math.max(0, Number(min) || 0)));
    if (max.trim() === "") next.delete("maxPrice");
    else next.set("maxPrice", String(Math.max(0, Number(max) || 0)));
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  function clear() {
    setMin("");
    setMax("");
    const next = new URLSearchParams(params.toString());
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  const hasFilter = params.get("minPrice") || params.get("maxPrice");

  return (
    <form
      onSubmit={apply}
      className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
    >
      <span className="font-medium">Price</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        placeholder="Min"
        aria-label="Minimum price"
        className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-brand-900/30"
      />
      <span className="text-slate-300 dark:text-slate-700">–</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        placeholder="Max"
        aria-label="Maximum price"
        className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-brand-900/30"
      />
      <button
        type="submit"
        className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white transition hover:bg-brand-700"
      >
        Apply
      </button>
      {hasFilter && (
        <button
          type="button"
          onClick={clear}
          className="font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:hover:text-slate-300"
        >
          Clear
        </button>
      )}
    </form>
  );
}
