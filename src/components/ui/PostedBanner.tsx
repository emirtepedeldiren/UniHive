"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostedBanner() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      router.replace("/");
    }, 4000);
    return () => clearTimeout(t);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="mb-4 flex items-start gap-3 bg-pollinate/10 border border-pollinate/40 rounded-xl px-4 py-3 animate-fade-up">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-pollinate flex-shrink-0 mt-0.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <p className="text-sm text-app-text dark:text-dark-text">
        <span className="font-semibold text-pollinate">Sorunuz alındı!</span>{" "}
        Admin onayından sonra feed&apos;e çıkacak.
      </p>
    </div>
  );
}
