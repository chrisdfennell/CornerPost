import { STATES, COUNTRY } from "@/lib/places";
import { currentPlace } from "@/lib/place-server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Choose your city · CornerPost",
  description: "Pick your local area to browse listings near you.",
};

export default async function PlacesPage() {
  const current = await currentPlace();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="text-4xl">📍</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Choose your city
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-500 dark:text-slate-400">
          CornerPost is local. Pick your area to see listings near you — you can
          switch anytime.
        </p>
        {current && (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-450">
            Currently browsing{" "}
            <span className="font-semibold text-brand-700 dark:text-brand-450">
              {current.label}
            </span>
          </p>
        )}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-600">
        {COUNTRY}
      </h2>

      <div className="mt-4 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {STATES.map((state) => (
          <section key={state.code} className="mb-6 break-inside-avoid">
            <h3 className="text-sm font-bold text-ink">{state.name}</h3>
            <ul className="mt-1.5 space-y-1">
              {state.metros.map((m) => {
                const active = current?.slug === m.slug;
                return (
                  <li key={m.slug}>
                    <a
                      href={`/api/place?slug=${m.slug}&next=/`}
                      className={`text-sm transition ${
                        active
                          ? "font-semibold text-brand-700 dark:text-brand-450"
                          : "text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                      }`}
                    >
                      {m.name}
                      {active && " ✓"}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
