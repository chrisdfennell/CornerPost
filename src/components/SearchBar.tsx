"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar({
  size = "md",
  initialQuery = "",
}: {
  size?: "md" | "lg";
  initialQuery?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery || params.get("q") || "");

  useEffect(() => {
    setQ(initialQuery || params.get("q") || "");
  }, [initialQuery, params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  const big = size === "lg";

  return (
    <form
      onSubmit={submit}
      role="search"
      className={`flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white pl-4 pr-2 ${
        big ? "h-14 text-base card-shadow" : "h-11 text-sm"
      } focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100 transition`}
    >
      <svg
        width={big ? 22 : 18}
        height={big ? 22 : 18}
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 text-slate-400"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="m20 20-3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search listings, e.g. ‘road bike’, ‘1BR apartment’…"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
        aria-label="Search listings"
      />
      <button
        type="submit"
        className={`shrink-0 rounded-full bg-brand-600 font-semibold text-white transition hover:bg-brand-700 active:scale-95 ${
          big ? "px-6 py-2.5" : "px-4 py-1.5 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
