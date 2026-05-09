"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialName: string;
  initialUniversity: string;
  initialDepartment: string;
  initialCountry: string;
  email: string;
}

export default function SettingsForm({
  initialName,
  initialUniversity,
  initialDepartment,
  initialCountry,
  email,
}: Props) {
  const [name, setName] = useState(initialName);
  const [university, setUniversity] = useState(initialUniversity);
  const [department, setDepartment] = useState(initialDepartment);
  const [country, setCountry] = useState(initialCountry);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, university, department, country }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message ?? "Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
