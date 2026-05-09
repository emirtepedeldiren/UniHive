"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkAllReadButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function markAll() {
    setLoading(true);
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={markAll}
      disabled={loading}
      className="text-xs text-honey hover:text-honey-dark font-semibold transition-colors disabled:opacity-50"
    >
      {loading ? "İşleniyor..." : "Tümünü okundu işaretle"}
    </button>
  );
}
