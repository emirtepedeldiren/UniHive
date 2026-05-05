"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../../stitch_unihive_student_collaboration_platform/unihive_logo/screen.png";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // To handle the ?registered=1 param if they just registered
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
    } else {
      router.push("/");
      router.refresh();
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
            Kovana Giriş Yap
          </h1>
          <p className="text-app-muted dark:text-dark-muted text-sm mt-1 text-center">
            Akademik sürüne geri dön.
          </p>
        </div>

        {justRegistered && !error && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            Kayıt başarılı! Lütfen giriş yapın.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-sting text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-app-text dark:text-dark-text">.edu E-postası</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Örn: ada@itu.edu.tr"
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-app-text dark:text-dark-text">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-honey text-app-text dark:text-dark-text"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold bg-app-text text-app-bg dark:bg-dark-text dark:text-dark-bg py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
            
            <Link
              href="/login"
              className="w-full font-semibold text-center text-app-muted hover:text-app-text py-2"
            >
              Geri Dön
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-app-muted dark:text-dark-muted">
            Henüz hesabın yok mu?{" "}
            <Link href="/register" className="text-honey font-bold hover:underline">
              Hesap oluştur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
