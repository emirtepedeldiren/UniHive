"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  initialName: string;
  initialUniversity: string;
  initialDepartment: string;
  initialCountry: string;
  initialBio: string;
  initialAvatarUrl: string;
  email: string;
}

export default function SettingsForm({
  initialName,
  initialUniversity,
  initialDepartment,
  initialCountry,
  initialBio,
  initialAvatarUrl,
  email,
}: Props) {
  const [name, setName] = useState(initialName);
  const [university, setUniversity] = useState(initialUniversity);
  const [department, setDepartment] = useState(initialDepartment);
  const [country, setCountry] = useState(initialCountry);
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setAvatarUploading(false);
    if (res.ok) {
      const data = await res.json() as { url: string };
      setAvatarUrl(data.url);
    } else {
      setError("Fotoğraf yüklenemedi.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, university, department, country, bio, avatarUrl }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const data = await res.json() as { message?: string };
      setError(data.message ?? "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-2">
          Profil Fotoğrafı
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-honey flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="avatar" width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xl text-hive-black">
                {(name || email || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="btn-secondary text-sm disabled:opacity-60"
            >
              {avatarUploading ? "Yükleniyor..." : "Fotoğraf Seç"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="text-xs text-sting hover:underline text-left"
              >
                Kaldır
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          E-posta
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="input-field opacity-60 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="settings-name" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          Ad Soyad
        </label>
        <input
          id="settings-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="settings-bio" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          Biyografi
        </label>
        <textarea
          id="settings-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Kendin hakkında kısa bir şeyler yaz..."
          className="input-field resize-none"
        />
        <p className="text-[11px] text-app-muted dark:text-dark-muted mt-1 text-right">{bio.length}/200</p>
      </div>

      <div>
        <label htmlFor="settings-university" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          Üniversite <span className="text-sting">*</span>
        </label>
        <input
          id="settings-university"
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
          maxLength={100}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="settings-department" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          Bölüm
        </label>
        <input
          id="settings-department"
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          maxLength={100}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="settings-country" className="block text-[11px] font-bold uppercase tracking-[0.05em] text-app-muted dark:text-dark-muted mb-1.5">
          Ülke
        </label>
        <input
          id="settings-country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          maxLength={80}
          className="input-field"
        />
      </div>

      {error && (
        <p className="text-sm text-sting bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-pollinate bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 rounded-lg">
          Profil başarıyla güncellendi.
        </p>
      )}

      <div className="flex justify-end pt-1">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
