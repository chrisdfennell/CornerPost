"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CONDITIONS, getCategory } from "@/lib/categories";
import { STATES, PLACES } from "@/lib/places";
import { ImageUploader } from "@/components/ImageUploader";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass = "block text-sm font-semibold text-ink";

export type PostFormListing = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  subcategory: string;
  place: string;
  location: string;
  condition: string | null;
  images: string[];
  contactName: string;
  contactEmail: string;
};

export function PostForm({
  listing,
  editToken,
  defaultPlace,
  uploadsEnabled = false,
}: {
  listing?: PostFormListing;
  editToken?: string;
  defaultPlace?: string;
  uploadsEnabled?: boolean;
}) {
  const router = useRouter();
  const isEdit = Boolean(listing && editToken);

  const [category, setCategory] = useState(
    listing?.category ?? CATEGORIES[0].slug
  );
  const [subcategory, setSubcategory] = useState(
    listing?.subcategory ?? CATEGORIES[0].subcategories[0].slug
  );
  const [place, setPlace] = useState(
    listing?.place ?? defaultPlace ?? PLACES[0].slug
  );
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subcategories = useMemo(
    () => getCategory(category)?.subcategories ?? [],
    [category]
  );

  function onCategoryChange(slug: string) {
    setCategory(slug);
    const first = getCategory(slug)?.subcategories[0]?.slug;
    if (first) setSubcategory(first);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const priceRaw = (form.get("price") as string).trim();
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      price: priceRaw === "" ? null : Number(priceRaw),
      category,
      subcategory,
      place,
      location: form.get("location"),
      condition: (form.get("condition") as string) || null,
      images,
      contactName: form.get("contactName"),
      contactEmail: form.get("contactEmail"),
      company: (form.get("company") as string) || "",
      ...(isEdit ? { token: editToken } : {}),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/listings/${listing!.id}` : "/api/listings",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }
      if (isEdit) {
        router.push(`/listing/${listing!.id}`);
      } else {
        router.push(
          `/listing/${data.listing.id}/manage?token=${data.editToken}&posted=1`
        );
      }
    } catch {
      setError("Network error — please try again");
      setSubmitting(false);
    }
  }

  const showCondition = category === "for-sale";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 card-shadow sm:p-8"
    >
      {/* Honeypot — hidden from real users, catches naive bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`${inputClass} mt-1.5`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="subcategory">
            Subcategory
          </label>
          <select
            id="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className={`${inputClass} mt-1.5`}
          >
            {subcategories.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          defaultValue={listing?.title}
          placeholder="e.g. Mid-century walnut credenza"
          className={`${inputClass} mt-1.5`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={listing?.description}
          placeholder="Describe the item, condition, why you're posting, pickup details…"
          className={`${inputClass} mt-1.5 resize-y`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="place">
          City / area
        </label>
        <select
          id="place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className={`${inputClass} mt-1.5`}
        >
          {STATES.map((s) => (
            <optgroup key={s.code} label={s.name}>
              {s.metros.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}, {s.code}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="price">
            Price <span className="font-normal text-slate-400">(blank = contact / N/A)</span>
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={listing?.price ?? undefined}
              placeholder="0 for free"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            Neighborhood / detail
          </label>
          <input
            id="location"
            name="location"
            required
            maxLength={120}
            defaultValue={listing?.location}
            placeholder="e.g. Capitol Hill, or Remote"
            className={`${inputClass} mt-1.5`}
          />
        </div>
      </div>

      {showCondition && (
        <div>
          <label className={labelClass} htmlFor="condition">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            defaultValue={listing?.condition ?? ""}
            className={`${inputClass} mt-1.5`}
          >
            <option value="">Not specified</option>
            {CONDITIONS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>
          Photos <span className="font-normal text-slate-400">(optional, up to 8)</span>
        </label>
        <div className="mt-1.5">
          <ImageUploader
            value={images}
            onChange={setImages}
            uploadsEnabled={uploadsEnabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contactName">
            Your name
          </label>
          <input
            id="contactName"
            name="contactName"
            required
            maxLength={80}
            defaultValue={listing?.contactName}
            placeholder="Jamie"
            className={`${inputClass} mt-1.5`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactEmail">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={listing?.contactEmail}
            placeholder="you@example.com"
            className={`${inputClass} mt-1.5`}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? isEdit
            ? "Saving…"
            : "Posting…"
          : isEdit
            ? "Save changes"
            : "Publish listing"}
      </button>
    </form>
  );
}
