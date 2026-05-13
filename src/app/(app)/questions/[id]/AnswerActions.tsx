"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  answerId: string;
  initialBody: string;
}

export default function AnswerActions({ answerId, initialBody }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!body.trim()) { setError("Cevap boş olamaz."); return; }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/answers/${answerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message ?? "Güncelleme başarısız.");
    }
  }

  async function handleDelete() {
    if (!confirm("Cevabı silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    const res = await fetch(`/api/answers/${answerId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setLoading(false);
      alert("Silme işlemi başarısız.");
    }
  }

  if (editing) {
    return (
      <div className="mt-3 space-y-3">
        {error && <p className="text-sting text-sm">{error}</p>}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full border border-app-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-app-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-honey resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1.5 text-sm font-semibold bg-honey text-hive-black rounded-full hover:bg-honey-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            onClick={() => { setEditing(false); setBody(initialBody); setError(""); }}
            className="px-4 py-1.5 text-sm font-semibold text-app-muted hover:text-app-text transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-1">
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-app-muted hover:text-app-text transition-colors"
      >
        Düzenle
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs text-sting hover:opacity-70 transition-opacity disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
