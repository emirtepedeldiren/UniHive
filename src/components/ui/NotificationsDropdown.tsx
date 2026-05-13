"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  message: string;
  refId: string | null;
  isRead: boolean;
  createdAt: string;
}

function notifIcon(type: string) {
  if (type === "message") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  if (type === "VOTE") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
  if (type === "BEST") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  if (type === "ANSWER") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function notifUrl(type: string, refId: string | null): string | null {
  if (!refId) return null;
  if (type === "message") return "/messages";
  return `/questions/${refId}`;
}

export default function NotificationsDropdown({ unreadCount, onCountChange }: {
  unreadCount: number;
  onCountChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/notifications?limit=20");
    if (res.ok) {
      const data = await res.json() as { items: Notification[] };
      setNotifications(data.items);
    }
    setLoading(false);
  }, []);

  const markAllRead = useCallback(async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    onCountChange(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [onCountChange]);

  async function toggleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    await fetchNotifications();
    if (unreadCount > 0) markAllRead();
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleClick(n: Notification) {
    setOpen(false);
    const url = notifUrl(n.type, n.refId);
    if (url) router.push(url);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id="topbar-notifications"
        onClick={toggleOpen}
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
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-app-border dark:border-dark-border">
            <span className="font-bold text-sm text-app-text dark:text-dark-text">Bildirimler</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <svg className="animate-spin w-5 h-5 text-app-muted" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-app-muted dark:text-dark-muted">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="text-sm">Henüz bildirim yok.</span>
              </div>
            ) : (
              notifications.map((n) => {
                const url = notifUrl(n.type, n.refId);
                const isClickable = !!url;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    disabled={!isClickable}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-app-border dark:border-dark-border last:border-0 transition-colors ${
                      isClickable ? "hover:bg-app-hover dark:hover:bg-dark-hover cursor-pointer" : "cursor-default"
                    } ${!n.isRead ? "bg-honey/5" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.isRead ? "bg-honey/20 text-honey-dark" : "bg-app-bg dark:bg-dark-bg text-app-muted"}`}>
                      {notifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.isRead ? "text-app-text dark:text-dark-text font-medium" : "text-app-muted dark:text-dark-muted"}`}>
                        {n.message}
                      </p>
                      <p className="text-[11px] text-app-muted dark:text-dark-muted mt-0.5">
                        {timeAgo(new Date(n.createdAt))}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-honey flex-shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
