"use client";
import React, { useState } from "react";

interface Props {
  questionId: string;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ questionId, initialBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    if (bookmarked) {
      await fetch(`/api/bookmarks?questionId=${questionId}`, { method: "DELETE" });
    } else {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });
    }
    setBookmarked((b) => !b);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={bookmarked ? "Yer işaretinden kaldır" : "Yer işaretine ekle"}
      className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 ${
        bookmarked
          ? "text-honey"
          : "text-app-muted hover:text-app-text dark:hover:text-dark-text"
      }`}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {bookmarked ? "Kaydedildi" : "Kaydet"}
    </button>
  );
}
