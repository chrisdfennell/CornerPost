"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

const MAX = 8;

export function ImageUploader({
  value,
  onChange,
  uploadsEnabled,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  uploadsEnabled: boolean;
}) {
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addUrls(urls: string[]) {
    const next = [...value];
    for (const u of urls) {
      if (next.length >= MAX) break;
      if (u && !next.includes(u)) next.push(u);
    }
    onChange(next.slice(0, MAX));
  }

  function addManual() {
    const u = urlDraft.trim();
    if (!u) return;
    try {
      // eslint-disable-next-line no-new
      new URL(u);
    } catch {
      setError("Enter a valid image URL");
      return;
    }
    setError(null);
    addUrls([u]);
    setUrlDraft("");
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function makeCover(i: number) {
    if (i === 0) return;
    const next = [...value];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            >
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-ink"
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="ml-auto rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < MAX && uploadsEnabled && (
        <UploadDropzone
          endpoint="listingImages"
          onClientUploadComplete={(res) => {
            addUrls(res.map((r) => r.ufsUrl ?? r.url).filter(Boolean) as string[]);
          }}
          onUploadError={(e) => setError(e.message)}
          config={{ cn: (...c) => c.filter(Boolean).join(" ") }}
          appearance={{
            container:
              "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4",
            label: "text-brand-600",
            button:
              "bg-brand-600 text-white text-sm rounded-full px-4 py-1.5 after:bg-brand-700",
          }}
        />
      )}

      {value.length < MAX && (
        <div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addManual();
                }
              }}
              placeholder="…or paste an image URL"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={addManual}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-ink transition hover:border-brand-300"
            >
              Add
            </button>
          </div>
          {!uploadsEnabled && (
            <p className="mt-1 text-xs text-slate-400">
              File uploads are off (set UPLOADTHING_TOKEN to enable). Paste image
              URLs for now.
            </p>
          )}
        </div>
      )}

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
