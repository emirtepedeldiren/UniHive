"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../../stitch_unihive_student_collaboration_platform/unihive_logo/screen.png";

export default function LoginPage() {


  return (
    <div className="min-h-screen flex bg-app-bg dark:bg-dark-bg">
      {/* Left panel — Big Logo */}
      <div className="hidden lg:flex w-1/2 items-center justify-end p-12 lg:pr-8 xl:pr-16 relative">
        <div className="w-[450px] h-[450px] xl:w-[600px] xl:h-[600px] relative flex items-center justify-center">
          <Image 
            src={logoImage} 
            alt="UniHive Logo" 
            width={600} 
            height={600} 
            className="object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:p-12 dark:rounded-[4rem] w-full h-full" 
            priority
          />
        </div>
      </div>

      {/* Right panel — auth options */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:pl-12 lg:pr-24">
        <div className="w-full max-w-[380px] animate-fade-up">
          {/* Mobile Logo */}
          <div className="lg:hidden w-32 mb-8 relative flex items-center justify-start">
            <Image 
              src={logoImage} 
              alt="UniHive Logo" 
              width={160} 
              height={64} 
              className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:p-2 dark:rounded-xl" 
            />
          </div>

          <h1 className="font-black text-5xl text-app-text dark:text-dark-text mb-4 tracking-tight leading-tight">
            Kampüste olup bitenler.
          </h1>
          <h2 className="font-extrabold text-3xl text-app-text dark:text-dark-text mb-8">
            Kovana katıl.
          </h2>

          <div className="space-y-4">

            <Link href="/register" className="w-full flex items-center justify-center bg-app-text text-app-bg dark:bg-dark-text dark:text-dark-bg font-bold py-3 px-4 rounded-full hover:opacity-90 transition-opacity shadow-sm">
              Hesap oluştur
            </Link>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 leading-relaxed font-medium">
              Kayıt olarak <span className="text-app-text dark:text-dark-text font-bold underline hover:opacity-80 cursor-pointer">Hizmet Şartları</span> ve <span className="text-app-text dark:text-dark-text font-bold underline hover:opacity-80 cursor-pointer">Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg text-app-text dark:text-dark-text mb-5">Zaten bir hesabın var mı?</h3>
              
              <Link
                href="/signin"
                className="w-full font-bold text-app-text dark:text-dark-text border border-gray-300 dark:border-gray-700 py-3 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors flex items-center justify-center shadow-sm"
              >
                Giriş yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
