import Link from "next/link";
import type { Category } from "@/lib/categories";

export function SubcategoryChips({
  category,
  active,
}: {
  category: Category;
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/category/${category.slug}`}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          !active
            ? "bg-ink text-white"
            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300"
        }`}
      >
        All {category.name}
      </Link>
      {category.subcategories.map((s) => {
        const isActive = active === s.slug;
        return (
          <Link
            key={s.slug}
            href={`/category/${category.slug}?sub=${s.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-ink text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300"
            }`}
          >
            {s.name}
          </Link>
        );
      })}
    </div>
  );
}
