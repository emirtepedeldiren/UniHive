"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function NewQuestionPage() {
  const { data: session } = useSession();
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="headline-md text-hive-black">Yeni Soru Sor</h1>
        <p className="body-sm text-on-surface-variant mt-1">
          Sorun admin onayından sonra feed'e çıkacak (+5 puan kazanırsın 🍯)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-card"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="q-title"
            className="label-caps text-on-surface-variant block mb-2"
          >
            Başlık *
          </label>
          <input
            id="q-title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sorunuzu kısaca özetleyin..."
            className="input-enclosed text-base"
          />
          <p className="body-sm text-on-surface-variant mt-1 text-right">
            {title.length}/200
          </p>
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="q-body"
            className="label-caps text-on-surface-variant block mb-2"
          >
            Açıklama{" "}
            <span className="font-normal text-on-surface-variant">
              (isteğe bağlı)
            </span>
          </label>
          <textarea
            id="q-body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Sorunuzu detaylandırın, bağlam ekleyin, ne denediğinizi anlatın..."
            className="input-enclosed resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="q-tag-input"
            className="label-caps text-on-surface-variant block mb-2"
          >
            Etiketler{" "}
            <span className="font-normal text-on-surface-variant">
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
              className="input-enclosed flex-1"
              maxLength={30}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addTag}
              className="flex-shrink-0"
              size="sm"
            >
              Ekle
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="community-chip gap-1 cursor-pointer"
                  onClick={() => removeTag(tag)}
                  title="Kaldır"
                >
                  #{tag}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="ml-0.5 opacity-60"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label className="label-caps text-on-surface-variant block mb-2">
            Fotoğraflar{" "}
            <span className="font-normal text-on-surface-variant">
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
            className="flex items-center gap-2 border-2 border-dashed border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface-variant hover:border-honey hover:text-primary transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Fotoğraf Ekle
          </button>

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3">
              {previews.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Önizleme ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-outline-variant"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-sting-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-sting-red text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Info box */}
        <div className="bg-honey-pale/50 border border-honey/40 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p className="body-sm text-on-surface-variant">
            Sorunuz admin tarafından incelenecek. Onaylandıktan sonra feed'e
            çıkacak ve <strong className="text-hive-black">+5 puan</strong>{" "}
            kazanacaksın.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            İptal
          </Button>
          <Button
            id="submit-question-btn"
            type="submit"
            loading={loading}
          >
            Gönder
          </Button>
        </div>
      </form>
    </div>
  );
}
