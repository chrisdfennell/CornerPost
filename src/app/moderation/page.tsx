import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moderationEnabled, isModerator } from "@/lib/moderation";
import { getCategory } from "@/lib/categories";
import { getPlace } from "@/lib/places";
import { timeAgo } from "@/lib/format";
import { ModerationActions } from "./ModerationActions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moderation",
  robots: { index: false, follow: false },
};

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <div className="text-5xl">🛡️</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-slate-500">{body}</p>
    </div>
  );
}

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  if (!moderationEnabled()) {
    return (
      <Notice
        title="Moderation is disabled"
        body="Set MODERATION_TOKEN in the environment to enable the review queue."
      />
    );
  }
  if (!isModerator(token)) {
    return (
      <Notice
        title="Access denied"
        body="This page requires a valid moderation token in the URL."
      />
    );
  }

  const reports = await prisma.report.findMany({
    where: { resolved: false },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      listing: {
        select: { id: true, title: true, category: true, place: true, status: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Moderation queue
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {reports.length} open {reports.length === 1 ? "report" : "reports"}
      </p>

      {reports.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center text-slate-500">
          🎉 Nothing to review. The queue is clear.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {reports.map((r) => {
            const cat = getCategory(r.listing.category);
            const place = getPlace(r.listing.place);
            return (
              <li
                key={r.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 card-shadow"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-rose-700">
                      {r.reason}
                    </span>
                    <span className="text-xs text-slate-400">
                      {timeAgo(r.createdAt)}
                    </span>
                  </div>
                  <Link
                    href={`/listing/${r.listing.id}`}
                    className="mt-1.5 block truncate font-semibold text-ink hover:text-brand-600"
                  >
                    {r.listing.title}
                  </Link>
                  <p className="text-xs text-slate-400">
                    {cat?.name}
                    {place ? ` · ${place.label}` : ""}
                    {r.listing.status !== "active" ? ` · ${r.listing.status}` : ""}
                  </p>
                  {r.detail && (
                    <p className="mt-2 text-sm text-slate-600">“{r.detail}”</p>
                  )}
                </div>
                <ModerationActions
                  token={token}
                  reportId={r.id}
                  listingId={r.listing.id}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
