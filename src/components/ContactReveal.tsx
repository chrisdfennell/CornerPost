"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-500 dark:focus:ring-brand-900/30";

const labelClass = "block text-xs font-semibold text-slate-500 dark:text-slate-400";

export function ContactReveal({
  listingId,
  name,
}: {
  listingId: string;
  name: string;
}) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("Hi, is this still available? I can pick it up locally.");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ conversationId: string; buyerToken: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Autofill buyer info if they already set it previously in localStorage
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("buyer_name");
      const storedEmail = localStorage.getItem("buyer_email");
      if (storedName) setBuyerName(storedName);
      if (storedEmail) setBuyerEmail(storedEmail);
    } catch (_) {}
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      listingId,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      message: message.trim(),
    };

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send message.");
        setLoading(false);
        return;
      }

      // Persist contact details for next inquiries
      try {
        localStorage.setItem("buyer_name", buyerName.trim());
        localStorage.setItem("buyer_email", buyerEmail.trim());
      } catch (_) {}

      setSuccess({
        conversationId: data.conversationId,
        buyerToken: data.buyerToken,
      });
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  if (success) {
    const chatUrl = `/chat/${success.conversationId}?token=${success.buyerToken}`;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 card-shadow dark:border-emerald-950/40 dark:bg-emerald-950/20">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400">🚀 Message Sent!</h3>
        <p className="mt-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-500">
          Your secure inquiry has been emailed to the seller. We also sent you a copy with your private workspace link.
        </p>
        <Link
          href={chatUrl}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-750 active:scale-98"
        >
          Open secure chat 💬
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact Poster</p>
      <p className="mt-1 text-lg font-bold text-ink">Inquire with {name}</p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className={labelClass} htmlFor="buyerName">
            Your Name
          </label>
          <input
            id="buyerName"
            type="text"
            required
            placeholder="Jane Doe"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="buyerEmail">
            Your Email
          </label>
          <input
            id="buyerEmail"
            type="email"
            required
            placeholder="you@example.com"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={3}
            placeholder="Ask about details, pickup availability..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} mt-1 resize-none`}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Secure Message"}
        </button>
      </form>

      <p className="mt-4 text-center text-[10px] leading-normal text-slate-400 dark:text-slate-500">
        Your email is hidden. Replies occur securely inside CornerPost. Meet in public spots.
      </p>
    </div>
  );
}
