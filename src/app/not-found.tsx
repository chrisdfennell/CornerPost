import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-2 text-slate-500">
        This corner doesn’t exist (or the listing was taken down).
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-700"
      >
        Back home
      </Link>
    </div>
  );
}
