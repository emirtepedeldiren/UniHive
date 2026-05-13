"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import NotificationsDropdown from "./ui/NotificationsDropdown";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string; avatarUrl?: string } | undefined;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/notifications/count")
      .then((r) => r.json())
      .then((data: { count?: number }) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
    const interval = setInterval(() => {
      fetch("/api/notifications/count")
        .then((r) => r.json())
        .then((data: { count?: number }) => setUnreadCount(data.count ?? 0))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        {/* Notifications dropdown */}
        {session && (
          <NotificationsDropdown unreadCount={unreadCount} onCountChange={setUnreadCount} />
        )}

        {/* Bookmarks */}
        <Link href="/bookmarks" id="topbar-bookmarks" className="w-9 h-9 rounded-full flex items-center justify-center text-app-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>

        {/* Explore */}
        <Link href="/explore" id="topbar-explore" className="w-9 h-9 rounded-full flex items-center justify-center text-app-muted hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </Link>

        {/* Avatar / Dropdown */}
        {session ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              id="topbar-profile"
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-honey flex items-center justify-center font-bold text-hive-black text-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-honey/50"
            >
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
              ) : (
                (user?.name || user?.email || "?").charAt(0).toUpperCase()
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl shadow-lg py-1 z-50">
                <Link
                  href={`/profile/${user?.id}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text dark:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profil
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text dark:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Ayarlar
                </Link>
                <Link
                  href="/help"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-app-text dark:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Yardım
                </Link>
                <div className="border-t border-app-border dark:border-dark-border my-1" />
                <button
                  onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/login" }); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-sting hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" id="topbar-login" className="btn-primary ml-2">
            Giriş Yap
          </Link>
        )}
      </div>
    </header>
  );
}
