"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getCategory } from "@/lib/categories";

type ListingData = {
  id: string;
  title: string;
  price: number | null;
  imageUrl: string | null;
  category: string;
  status: string;
  contactName: string;
};

type ConversationData = {
  id: string;
  buyerName: string;
  listing: ListingData;
  role: "buyer" | "seller";
  createdAt: string;
};

type MessageData = {
  id: string;
  sender: "buyer" | "seller";
  content: string;
  createdAt: string;
};

export function ChatWorkspace({
  conversation,
  initialMessages,
  token,
}: {
  conversation: ConversationData;
  initialMessages: MessageData[];
  token: string;
}) {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isBuyer = conversation.role === "buyer";
  const partnerName = isBuyer ? conversation.listing.contactName : conversation.buyerName;
  const partnerRole = isBuyer ? "Seller" : "Buyer";

  // Auto-scroll to bottom of conversation thread
  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // HTTP Polling: fetch new messages every 4 seconds when browser tab is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function poll() {
      if (document.hidden) return; // Skip fetch if tab is minimized
      try {
        const res = await fetch(`/api/conversations/${conversation.id}?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length !== messages.length) {
            setMessages(data.messages);
          }
        }
      } catch (_) {
        // Suppress background errors during polling to keep experience clean
      }
    }

    intervalId = setInterval(poll, 4000);
    return () => clearInterval(intervalId);
  }, [conversation.id, token, messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = newMsg.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);

    // Optimistic message append for seamless user experience
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: MessageData = {
      id: tempId,
      sender: conversation.role,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMsg("");

    try {
      const res = await fetch(`/api/conversations/${conversation.id}?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send message.");
        // Remove the optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setNewMsg(content); // Restore draft
      } else {
        // Replace optimistic message with actual DB record
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
      }
    } catch {
      setError("Connection error. Message not sent.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setNewMsg(content);
    } finally {
      setSending(false);
    }
  }

  const cat = getCategory(conversation.listing.category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Listing context bar for mobile */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 lg:hidden">
        {conversation.listing.imageUrl ? (
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            <Image
              src={conversation.listing.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="grid h-12 w-16 shrink-0 place-items-center rounded-lg bg-slate-100 text-xl dark:bg-slate-800">
            {cat?.icon ?? "📦"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Link
            href={`/listing/${conversation.listing.id}`}
            className="block truncate text-sm font-semibold text-ink hover:text-brand-600"
          >
            {conversation.listing.title}
          </Link>
          <span className="text-xs font-bold text-slate-500">
            {formatPrice(conversation.listing.price)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Side: Desktop Listing specifications */}
        <aside className="hidden space-y-4 lg:block">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow dark:border-slate-800 dark:bg-slate-900/50">
            {conversation.listing.imageUrl ? (
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={conversation.listing.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center bg-slate-100 text-5xl dark:bg-slate-800">
                {cat?.icon ?? "📦"}
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Discussing listing
              </span>
              <Link
                href={`/listing/${conversation.listing.id}`}
                className="mt-1 block font-bold leading-snug text-ink hover:text-brand-600"
              >
                {conversation.listing.title}
              </Link>
              <p className="mt-2 text-xl font-extrabold text-ink">
                {formatPrice(conversation.listing.price)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-950/30 dark:bg-amber-950/10">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500">🛡️ Transaction Safety</h4>
            <p className="mt-1.5 text-[11px] leading-normal text-amber-700 dark:text-amber-600">
              Never share bank routing, wire money, or pay via unverified cash apps. Complete trades in bright, high-traffic public areas.
            </p>
          </div>
        </aside>

        {/* Right Side: Message Room */}
        <main className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow dark:border-slate-800 dark:bg-slate-900/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-ink">
                {partnerName}
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {partnerRole} · Secure Connection
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </div>
          </div>

          {/* Messages Panel */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin]"
          >
            {messages.length === 0 ? (
              <div className="grid h-full place-items-center text-center text-slate-400 dark:text-slate-500">
                <div>
                  <p className="text-3xl">💬</p>
                  <p className="mt-2 text-sm font-medium">Conversation started</p>
                  <p className="text-xs">Type below to securely connect.</p>
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const sentByMe = m.sender === conversation.role;
                const formattedTime = new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[75%] ${
                      sentByMe ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        sentByMe
                          ? "bg-brand-600 text-white rounded-br-none"
                          : "bg-slate-100 text-ink dark:bg-slate-800/80 rounded-bl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      {formattedTime}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Form */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                required
                maxLength={3000}
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message securely..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-500 dark:focus:ring-brand-900/30"
              />
              <button
                type="submit"
                disabled={sending || !newMsg.trim()}
                className="shrink-0 rounded-xl bg-brand-600 px-5 font-semibold text-white transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </form>
            {error && (
              <p className="mt-2 text-center text-xs font-semibold text-rose-600">{error}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
