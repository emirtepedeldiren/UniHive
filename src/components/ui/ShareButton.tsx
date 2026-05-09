"use client";
import React, { useState } from "react";

interface Props {
  path: string;
  title: string;
}

export default function ShareButton({ path, title }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const fullUrl = `${window.location.origin}${path}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: fullUrl });
        return;
      } catch {
        // user cancelled or unsupported, fall through
      }
    }
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 text-app-muted text-xs hover:text-app-text dark:hover:text-dark-text transition-colors"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {copied ? "Kopyalandı!" : "Paylaş"}
    </button>
  );
}
