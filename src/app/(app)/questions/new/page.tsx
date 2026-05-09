"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9çğışöü-]/g, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const total = images.length + files.length;
    if (total > 3) {
      setError("En fazla 3 fotoğraf ekleyebilirsiniz.");
      return;
    }
    setError("");
    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(i: number) {
    const newImages = images.filter((_, idx) => idx !== i);
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    setLoading(true);

    let imageUrls: string[] = [];

    if (images.length > 0) {
      const fd = new FormData();
      images.forEach((img) => fd.append("files", img));
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        setError(data.message ?? "Fotoğraf yüklenemedi.");
        setLoading(false);
        return;
      }
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.urls;
    }

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim() || null,
        tags,
        imageUrls,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Soru oluşturulamadı.");
    } else {
      router.push(`/?posted=1`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-up">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-hive-black dark:text-dark-text">
          Yeni Soru Sor
        </h1>
        <p className="text-sm text-app-muted dark:text-dark-muted mt-1.5">
          Sorun admin onayından sonra feed&apos;e çıkacak ve{" "}
          <span className="font-semibold text-hive-black dark:text-honey">+5 puan</span>{" "}
          kazanırsın.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl p-6 shadow-card space-y-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="q-title"
            className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-2"
          >
            Başlık <span className="text-sting">*</span>
          </label>
          <input
            id="q-title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sorunuzu kısaca özetleyin..."
            className="input-field text-[15px]"
          />
          <p className="text-[11px] text-app-muted dark:text-dark-muted mt-1 text-right">
            {title.length}/200
          </p>
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="q-body"
            className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-2"
          >
            Açıklama{" "}
            <span className="font-normal normal-case tracking-normal text-app-muted dark:text-dark-muted">
              (isteğe bağlı)
            </span>
          </label>
          <textarea
            id="q-body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Sorunuzu detaylandırın, bağlam ekleyin, ne denediğinizi anlatın..."
            className="input-field resize-none leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="q-tag-input"
            className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-2"
          >
            Etiketler{" "}
            <span className="font-normal normal-case tracking-normal text-app-muted dark:text-dark-muted">
              (max 5)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              id="q-tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="matematik, fizik, yazılım..."
              className="input-field flex-1"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-outline px-4 py-2 text-sm flex-shrink-0"
            >
              Ekle
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  title="Kaldır"
                  className="inline-flex items-center gap-1 bg-pink-light dark:bg-pink-accent/20 text-pink-accent text-xs font-bold px-3 py-1 rounded-full transition-opacity hover:opacity-70"
                >
                  #{tag}
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-60"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-2">
            Fotoğraflar{" "}
            <span className="font-normal normal-case tracking-normal text-app-muted dark:text-dark-muted">
              (max 3, 5MB)
            </span>
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            id="q-images"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 w-full border-2 border-dashed border-app-border dark:border-dark-border rounded-lg px-4 py-3.5 text-sm text-app-muted dark:text-dark-muted hover:border-honey hover:text-hive-black dark:hover:text-honey transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="flex-shrink-0"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Fotoğraf eklemek için tıklayın</span>
            <span className="ml-auto text-[11px] opacity-60">{images.length}/3</span>
          </button>

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3">
              {previews.map((url, i) => (
                <div key={i} className="relative group">
                  <Image
                    src={url}
                    alt={`Önizleme ${i + 1}`}
                    width={96}
                    height={96}
                    unoptimized
                    className="object-cover rounded-lg border border-app-border dark:border-dark-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-sting text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sting text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Info box */}
        <div className="bg-honey-light dark:bg-honey/10 border border-honey/50 rounded-lg px-4 py-3 flex items-start gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5 text-honey-dark"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-app-muted dark:text-dark-muted leading-relaxed">
            Sorunuz admin tarafından incelenecek. Onaylandıktan sonra feed&apos;e
            çıkacak ve{" "}
            <strong className="text-hive-black dark:text-honey font-semibold">
              +5 puan
            </strong>{" "}
            kazanacaksın.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            İptal
          </button>
          <button
            id="submit-question-btn"
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed min-w-[100px] justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Gönderiliyor
              </span>
            ) : (
              "Gönder"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
