import Link from "next/link";

/**
 * Server-rendered pagination. Preserves all existing query params and only
 * swaps the `page` value, so it composes with sort/price/sub filters.
 */
export function Pagination({
  total,
  pageSize,
  page,
  searchParams,
  basePath,
}: {
  total: number;
  pageSize: number;
  page: number;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined && k !== "page") sp.set(k, v);
    }
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const linkClass =
    "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700";
  const disabledClass =
    "rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-300";

  return (
    <nav
      className="mt-10 flex items-center justify-between gap-4"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass} rel="prev">
          ← Previous
        </Link>
      ) : (
        <span className={disabledClass}>← Previous</span>
      )}

      <span className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass} rel="next">
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </nav>
  );
}
