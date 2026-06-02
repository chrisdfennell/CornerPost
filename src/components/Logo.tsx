import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="CornerPost home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm transition-transform group-hover:-rotate-6">
        {/* map-pin / corner mark */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z"
            fill="currentColor"
            opacity="0.25"
          />
          <circle cx="12" cy="10" r="3" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink">
        Corner<span className="text-brand-600">Post</span>
      </span>
    </Link>
  );
}
