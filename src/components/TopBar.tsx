"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string } | undefined;

  useEffect(() => {
    if (!session) return;
    fetch("/api/notifications?unread=true")
      .then((r) => r.json())
      .then((data: { count?: number }) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  }, [session]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-app-border dark:border-dark-border z-30 flex items-center px-6 gap-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted dark:text-dark-muted" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="topbar-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kovan içinde ara..."
            className="w-full bg-app-bg dark:bg-dark-card border border-app-border dark:border-dark-border rounded-full pl-9 pr-4 py-2 text-sm outline-none text-app-text dark:text-dark-text placeholder-app-muted focus:border-honey focus:ring-2 focus:ring-honey/20 transition-all"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <Link
          href="/notifications"
          id="topbar-notifications"
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-app-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-sting text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Bookmarks */}
        <Link href="/bookmarks" id="topbar-bookmarks" className="w-9 h-9 rounded-full flex items-center justify-center text-app-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>

        {/* Grid / Browse */}
        <Link href="/explore" id="topbar-explore" className="w-9 h-9 rounded-full flex items-center justify-center text-app-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </Link>

        {/* Avatar */}
        {session ? (
          <Link href={`/profile/${user?.id}`} id="topbar-profile" className="ml-1">
            <div className="w-8 h-8 rounded-full bg-honey flex items-center justify-center font-bold text-hive-black text-sm">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
          </Link>
        ) : (
          <Link href="/login" id="topbar-login" className="btn-primary ml-2">
            Giriş Yap
          </Link>
        )}
      </div>
    </header>
  );
}
