"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import HexAvatar from "./ui/HexAvatar";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant">
      <nav className="max-w-container mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="text-2xl">🐝</span>
          <span className="font-extrabold text-lg tracking-tight text-hive-black group-hover:text-primary transition-colors">
            Uni<span className="text-honey">Hive</span>
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <form action="/" method="GET">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                name="q"
                placeholder="Soru ara..."
                className="input-enclosed pl-10 py-2 text-sm"
              />
            </div>
          </form>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              {/* Ask question */}
              <Link
                href="/questions/new"
                id="ask-question-btn"
                className="btn-primary text-sm hidden sm:inline-flex items-center gap-1.5"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Soru Sor
              </Link>

              {/* Admin */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  id="admin-panel-link"
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Admin
                </Link>
              )}

              {/* User menu */}
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <HexAvatar name={user?.name} badge={user?.badge} size="sm" />
                  <span className="hidden md:block text-sm font-semibold text-hive-black">
                    {user?.name ?? user?.email?.split("@")[0]}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-modal animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-outline-variant">
                      <p className="text-sm font-semibold text-hive-black truncate">
                        {user?.email}
                      </p>
                      <p className="label-caps text-on-surface-variant mt-0.5">
                        {user?.badge} · {user?.score ?? 0} puan
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href={`/profile/${user?.id}`}
                        className="block px-4 py-2 text-sm text-hive-black hover:bg-surface-container transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profilim
                      </Link>
                      <Link
                        href="/questions/new"
                        className="block px-4 py-2 text-sm text-hive-black hover:bg-surface-container transition-colors sm:hidden"
                        onClick={() => setMenuOpen(false)}
                      >
                        Soru Sor
                      </Link>
                      <button
                        id="signout-btn"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full text-left px-4 py-2 text-sm text-sting-red hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                Giriş
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
