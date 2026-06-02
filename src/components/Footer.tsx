import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Local classifieds, done right. Buy, sell, rent, hire, and connect
              with your community.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-brand-500/50 dark:hover:text-brand-400"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CornerPost. A demo classifieds board.</p>
          <p>Built with Next.js · Be kind, meet in public places.</p>
        </div>
      </div>
    </footer>
  );
}
