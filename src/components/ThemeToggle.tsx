"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const supportDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (supportDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  function toggle() {
    if (!theme) return;
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  if (!theme) {
    return <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800/60" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 ring-1 ring-slate-200 transition-all hover:bg-white hover:text-brand-600 hover:ring-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-800/80 dark:text-slate-400 dark:ring-slate-700/80 dark:hover:bg-slate-800 dark:hover:text-amber-400 dark:hover:ring-amber-500/50"
    >
      <div className="relative h-5 w-5 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 transform transition-all duration-500 ${
            theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 transform transition-all duration-500 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
}
