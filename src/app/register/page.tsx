"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../../stitch_unihive_student_collaboration_platform/unihive_logo/screen.png";

const COUNTRIES = [
  "Türkiye",
  "Kuzey Kıbrıs Türk Cumhuriyeti",
  "Azerbaycan",
  "Amerika Birleşik Devletleri",
  "İngiltere",
  "Almanya",
];

const UNIVERSITIES = [
  "İstanbul Teknik Üniversitesi",
  "Orta Doğu Teknik Üniversitesi",
  "Boğaziçi Üniversitesi",
  "Hacettepe Üniversitesi",
  "Ankara Üniversitesi",
  "İstanbul Üniversitesi",
  "Ege Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "Koç Üniversitesi",
  "Sabancı Üniversitesi",
];

const DEPARTMENTS = [
  "Bilgisayar Mühendisliği",
  "Elektrik-Elektronik Mühendisliği",
  "Makine Mühendisliği",
  "Matematik",
  "Fizik",
  "Kimya",
  "Tıp",
  "Hukuk",
  "İşletme",
  "Mimarlık",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");

  // Step 2
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function nextStep() {
    setError("");
    if (!country || !university || !department) {
      setError("Lütfen ülke, üniversite ve bölüm seçiniz.");
      return;
    }
    setStep(2);
  }

  async function handleSubmit() {
    setError("");
    if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
      setError("Tüm alanları doldurmanız gerekmektedir.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (!email.endsWith(".edu.tr") && !email.includes(".edu")) {
      setError("Sadece .edu veya .edu.tr uzantılı e-posta kabul edilir.");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, country, university, department }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Kayıt başarısız.");
        setLoading(false);
        return;
      }
      
      // Kayıt başarılı, login sayfasına dön
      router.push("/login?registered=1");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10 relative animate-fade-up overflow-hidden">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 mb-1 flex justify-center">
            <Image 
              src={logoImage} 
              alt="UniHive Logo" 
              width={160} 
              height={64} 
              className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:rounded-xl dark:p-2" 
            />
          </div>
          <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text text-center">
            Hesap Oluştur
          </h1>
          <p className="text-app-muted dark:text-dark-muted text-sm mt-1 text-center">
            {step === 1 ? "Akademik bilgilerini doldur." : "Kişisel bilgilerini gir."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-sting text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-app-text dark:text-dark-text">Ülke</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted">🌍</span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey appearance-none text-app-text dark:text-dark-text"
                >
                  <option value="" disabled>Ülke seç...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="text-black">{c}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-app-text dark:text-dark-text">Üniversite</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted">🏛</span>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey appearance-none text-app-text dark:text-dark-text"
                >
                  <option value="" disabled>Üniversite seç...</option>
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u} className="text-black">{u}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-app-text dark:text-dark-text">Bölüm / Uzmanlık</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted">🎓</span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey appearance-none text-app-text dark:text-dark-text"
                >
                  <option value="" disabled>Bölüm seç...</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="text-black">{d}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full font-bold bg-app-text text-app-bg dark:bg-dark-text dark:text-dark-bg py-3 rounded-full hover:opacity-90 transition-opacity mt-4"
            >
              Devam Et
            </button>
          </div>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold mb-1 text-app-text dark:text-dark-text">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ada Lovelace"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-app-text dark:text-dark-text">.edu E-postası</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Örn: ada@itu.edu.tr"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-app-text dark:text-dark-text">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-app-text dark:text-dark-text">Şifre Tekrar</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full font-bold bg-honey text-hive-black py-3 rounded-full hover:bg-honey-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
              </button>
              
              <button
                onClick={() => { setStep(1); setError(""); }}
                className="w-full font-semibold text-app-muted hover:text-app-text py-2"
              >
                Geri Dön
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-app-muted dark:text-dark-muted">
            Zaten bir hesabın var mı?{" "}
            <Link href="/login" className="text-honey font-bold hover:underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
