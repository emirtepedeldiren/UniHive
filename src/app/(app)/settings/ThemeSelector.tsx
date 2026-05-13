"use client";
import React from "react";
import { useTheme, type ThemeMode } from "@/components/Providers";

const options: { mode: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    mode: "light",
    label: "Aydınlık",
    desc: "Açık arka plan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    mode: "dark",
    label: "Karanlık",
    desc: "Koyu arka plan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    mode: "system",
    label: "Sistem",
    desc: "Cihaz ayarına göre",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

export default function ThemeSelector() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const active = mode === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setMode(opt.mode)}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              active
                ? "border-honey bg-honey/10 text-app-text dark:text-dark-text"
                : "border-app-border dark:border-dark-border text-app-muted dark:text-dark-muted hover:border-honey/50"
            }`}
          >
            {opt.icon}
            <div className="text-left">
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs opacity-70">{opt.desc}</p>
            </div>
            {active && (
              <div className="ml-auto w-4 h-4 rounded-full bg-honey flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
