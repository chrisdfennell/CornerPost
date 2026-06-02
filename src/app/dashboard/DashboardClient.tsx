"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlace } from "@/lib/places";

type DashboardUser = {
  email: string;
  name: string;
};

type DashboardListing = {
  id: string;
  title: string;
  price: number | null;
  category: string;
  subcategory: string;
  imageUrl: string | null;
  status: string;
  createdAt: Date | string;
};

type DashboardSubscription = {
  id: string;
  query: string;
  place: string;
  createdAt: Date | string;
};

type DashboardConversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  buyerName: string;
  buyerEmail: string;
  buyerToken: string;
  sellerToken: string;
  listing: {
    id: string;
    title: string;
    imageUrl: string | null;
    price: number | null;
    contactEmail: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: string;
  } | null;
};

interface DashboardClientProps {
  user: DashboardUser;
  initialListings: DashboardListing[];
  initialSubscriptions: DashboardSubscription[];
  initialConversations: DashboardConversation[];
}

export function DashboardClient({
  user,
  initialListings,
  initialSubscriptions,
  initialConversations,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"listings" | "subscriptions" | "messages">("listings");
  const [listings, setListings] = useState<DashboardListing[]>(initialListings);
  const [subscriptions, setSubscriptions] = useState<DashboardSubscription[]>(initialSubscriptions);
  const [conversations] = useState<DashboardConversation[]>(initialConversations);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUnsubscribe = async (subId: string) => {
    if (!confirm("Are you sure you want to stop receiving alerts for this search?")) return;
    setLoadingAction(subId);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subId }),
      });

      if (res.ok) {
        setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
      } else {
        alert("Failed to unsubscribe. Please try again.");
      }
    } catch (err) {
      console.error("Error unsubscribing:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "Contact";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 🚀 User Profile Banner with beautiful colored mesh background */}
      <div className="hero-mesh rounded-3xl border border-slate-200/50 p-6 md:p-8 dark:border-slate-800/40 card-shadow mb-8 relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-600/90 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/post"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Post a New Listing
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-500 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:text-rose-400"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Mini stats cards grid */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/40 relative z-10">
          <div className="text-center md:text-left">
            <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Listings
            </span>
            <span className="text-2xl font-black text-ink">{listings.length}</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Search Alerts
            </span>
            <span className="text-2xl font-black text-ink">{subscriptions.length}</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Conversations
            </span>
            <span className="text-2xl font-black text-ink">{conversations.length}</span>
          </div>
        </div>
      </div>

      {/* 🎛️ Glassmorphic tabs toggle bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 shrink-0 ${
            activeTab === "listings"
              ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
          }`}
        >
          My Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 shrink-0 ${
            activeTab === "subscriptions"
              ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
          }`}
        >
          Saved Searches ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 shrink-0 ${
            activeTab === "messages"
              ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
          }`}
        >
          My Messages ({conversations.length})
        </button>
      </div>

      {/* 📁 Active tab workspace content */}
      <div className="min-h-[40vh]">
        {activeTab === "listings" && (
          <div>
            {listings.length === 0 ? (
              <div className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-12 text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <h3 className="text-lg font-bold text-ink">No listings published yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  Post something for sale, free, or a job to start. It will automatically show up here.
                </p>
                <Link
                  href="/post"
                  className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Create your first listing
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-5 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300"
                  >
                    {/* Thumbnail image */}
                    <div className="h-20 w-20 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-850 flex items-center justify-center relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">📷</span>
                      )}
                    </div>

                    {/* Listing details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-450 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
                          {item.subcategory}
                        </span>
                        <span
                          className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            item.status === "active"
                              ? "text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30"
                              : "text-slate-500 dark:text-slate-450 bg-slate-100 dark:bg-slate-800/50"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-ink mt-1.5 line-clamp-1 hover:text-brand-600 transition">
                        <Link href={`/listing/${item.id}`}>{item.title}</Link>
                      </h3>

                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-xs text-slate-455 dark:text-slate-500">
                          Posted {formatDate(item.createdAt)}
                        </span>
                        <Link
                          href={`/listing/${item.id}/manage`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-450 hover:underline"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Manage details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div>
            {subscriptions.length === 0 ? (
              <div className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-12 text-center">
                <div className="text-4xl mb-3">🔔</div>
                <h3 className="text-lg font-bold text-ink">No saved search alerts</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  Subscribe to search keywords in your local metro area to receive instant matching email notifications.
                </p>
                <Link
                  href="/browse"
                  className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Browse listings
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
                  const placeName = getPlace(sub.place)?.name ?? sub.place;
                  return (
                    <div
                      key={sub.id}
                      className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🔍</span>
                          <h4 className="font-extrabold text-ink text-base">
                            “{sub.query}”
                          </h4>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-650 dark:text-slate-400">
                            📍 {placeName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Subscribed on {formatDate(sub.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleUnsubscribe(sub.id)}
                        disabled={loadingAction === sub.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-rose-250 hover:text-rose-600 transition dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:text-rose-450 disabled:opacity-50"
                      >
                        {loadingAction === sub.id ? (
                          "Unsubscribing..."
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            Unsubscribe
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            {conversations.length === 0 ? (
              <div className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-12 text-center">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-lg font-bold text-ink">No conversations yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  When you contact a seller or a buyer reaches out to your listing, your secure passive messaging rooms appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((chat) => {
                  const isSeller = user.email.toLowerCase() === chat.listing.contactEmail.toLowerCase();
                  const token = isSeller ? chat.sellerToken : chat.buyerToken;
                  const roleLabel = isSeller ? "Selling" : "Buying";

                  return (
                    <div
                      key={chat.id}
                      className="card-shadow bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl p-5 flex items-start justify-between gap-4 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700/80"
                    >
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        {/* Listing cover */}
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-850 flex items-center justify-center">
                          {chat.listing.imageUrl ? (
                            <img
                              src={chat.listing.imageUrl}
                              alt={chat.listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">📷</span>
                          )}
                        </div>

                        {/* Text preview */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                isSeller
                                  ? "text-brand-650 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30"
                                  : "text-amber-700 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/20"
                              }`}
                            >
                              {roleLabel}
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                              For listing: {chat.listing.title}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-ink text-base mt-1 truncate">
                            {isSeller ? chat.buyerName : "Seller"}
                          </h4>

                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate max-w-lg">
                            {chat.lastMessage
                              ? `${chat.lastMessage.sender === (isSeller ? "seller" : "buyer") ? "You: " : ""}${chat.lastMessage.content}`
                              : "No messages yet"}
                          </p>

                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            Updated {formatDate(chat.updatedAt)}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/chat/${chat.id}?token=${token}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition"
                      >
                        Open Chat
                        <span className="text-brand-200">→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
