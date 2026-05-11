"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import logoImage from "../../design_assets/stitch_unihive_student_collaboration_platform/unihive_logo/screen.png";
import logoTransparent from "../../public/logo-transparent.png";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/explore",
    label: "Keşfet",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    href: "/notifications",
    label: "Bildirimler",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "Mesajlar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    href: "/bookmarks",
    label: "Yer İşaretleri",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];


export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 py-2 border-b border-app-border dark:border-dark-border">
        <Link href="/" className="block w-[140px]">
          <Image
            src={logoImage}
            alt="UniHive Logo"
            width={140}
            height={56}
            className="w-full h-auto object-contain mix-blend-multiply dark:hidden"
          />
          <Image
            src={logoTransparent}
            alt="UniHive Logo"
            width={140}
            height={56}
            className="w-full h-auto object-contain hidden dark:block"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {session && (
          <Link href="/questions/new" id="create-post-sidebar-btn" className="btn-primary mx-4 mb-3 justify-center w-[calc(100%-32px)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Gönderi Oluştur
          </Link>
        )}

        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {session && (
          <Link
            href={`/profile/${user?.id}`}
            id="nav-profil"
            className={`nav-item ${pathname.startsWith("/profile") ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profil
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            id="nav-admin"
            className={`nav-item ${pathname.startsWith("/admin") ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </Link>
        )}
      </nav>

      {!session && (
        <div className="border-t border-app-border dark:border-dark-border py-3">
          <Link href="/login" className="nav-item text-sm font-semibold text-honey">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Giriş Yap
          </Link>
        </div>
      )}
    </aside>
  );
}
