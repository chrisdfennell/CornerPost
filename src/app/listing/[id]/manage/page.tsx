import Link from "next/link";
import { getListingForOwner, listingImages } from "@/lib/listings";
import { PostForm } from "@/app/post/PostForm";
import { ManageActions } from "./ManageActions";
import { closedLabel } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage listing · CornerPost",
  robots: { index: false, follow: false },
};

export default async function ManageListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string; posted?: string }>;
}) {
  const { id } = await params;
  const { token = "", posted } = await searchParams;

  const listing = await getListingForOwner(id, token);

  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
          Can’t manage this listing
        </h1>
        <p className="mt-2 text-slate-500">
          This management link is missing or invalid. Use the exact link you
          received when you posted.
        </p>
        <Link
          href="/browse"
          className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Browse listings
        </Link>
      </div>
    );
  }

  const expired = listing.expiresAt && listing.expiresAt.getTime() <= Date.now();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {posted && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="font-semibold text-emerald-800">
            🎉 Your listing is live!
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            <strong>Bookmark this page</strong> — it’s the only way to edit or
            delete your listing later. We don’t use accounts.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Manage your listing
        </h1>
        <Link
          href={`/listing/${listing.id}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View public page →
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {expired
          ? "This listing has expired and is hidden — renew it to show it again."
          : listing.expiresAt
            ? `Expires ${listing.expiresAt.toISOString().slice(0, 10)}`
            : "This listing doesn’t expire."}
      </p>

      <div className="mt-6">
        <ManageActions
          listingId={listing.id}
          token={token}
          status={listing.status}
          closedLabel={closedLabel(listing.category)}
        />
      </div>

      <h2 className="mt-10 text-lg font-bold tracking-tight text-ink">
        Edit details
      </h2>
      <div className="mt-4">
        <PostForm
          editToken={token}
          uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
          listing={{
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            category: listing.category,
            subcategory: listing.subcategory,
            place: listing.place,
            location: listing.location,
            condition: listing.condition,
            images: listingImages(listing),
            contactName: listing.contactName,
            contactEmail: listing.contactEmail,
          }}
        />
      </div>
    </div>
  );
}
