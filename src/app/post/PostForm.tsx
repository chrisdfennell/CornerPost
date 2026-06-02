"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CONDITIONS, getCategory } from "@/lib/categories";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass = "block text-sm font-semibold text-ink";

export function PostForm() {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [subcategory, setSubcategory] = useState(
    CATEGORIES[0].subcategories[0].slug
  );
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
      location: form.get("location"),
      condition: (form.get("condition") as string) || null,
      imageUrl: ((form.get("imageUrl") as string) || "").trim(),
      contactName: form.get("contactName"),
      contactEmail: form.get("contactEmail"),
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }
      router.push(`/listing/${data.listing.id}`);
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
          placeholder="Describe the item, condition, why you're posting, pickup details…"
          className={`${inputClass} mt-1.5 resize-y`}
        />
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
              placeholder="0 for free"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            maxLength={120}
            placeholder="City, State"
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
            defaultValue=""
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
        <label className={labelClass} htmlFor="imageUrl">
          Image URL <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          className={`${inputClass} mt-1.5`}
        />
        <p className="mt-1 text-xs text-slate-400">
          Paste a link to a photo. (A real upload flow would go here.)
        </p>
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
        {submitting ? "Posting…" : "Publish listing"}
      </button>
    </form>
  );
}
