"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!body.trim()) {
      setError("Cevap boş olamaz.");
      return;
    }

    setLoading(true);

    let imageUrls: string[] = [];
    if (images.length > 0) {
      const fd = new FormData();
      images.forEach((img) => fd.append("files", img));
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        imageUrls = data.urls;
      }
    }

    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, body: body.trim(), imageUrls }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setBody("");
      setImages([]);
      setPreviews([]);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message ?? "Cevap gönderilemedi.");
    }
  }

  if (success) {
    return (
      <div className="bg-honey-pale/50 border border-honey/40 rounded-lg px-4 py-4 text-center">
        <span className="text-2xl">🍯</span>
        <p className="font-semibold text-hive-black mt-1">
          Cevabın gönderildi!
        </p>
        <p className="body-sm text-on-surface-variant">
          Admin onayladıktan sonra görünecek ve +10 puan kazanacaksın.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        id="answer-body"
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Cevabını buraya yaz..."
        className="input-enclosed resize-none"
        required
      />

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Fotoğraf ekle (max 3)
        </button>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-2">
            {previews.map((url, i) => (
              <Image key={i} src={url} alt="" width={64} height={64} unoptimized className="object-cover rounded border border-outline-variant" />
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sting-red text-sm">{error}</p>
      )}

      <div className="flex justify-end">
        <Button id="submit-answer-btn" type="submit" loading={loading}>
          Cevapla
        </Button>
      </div>
    </form>
  );
}
