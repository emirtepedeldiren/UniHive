"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if we are on login, register, or signin pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/signin";

  if (isAuthPage) {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="ml-60 min-h-screen flex flex-col">
        <TopBar />
        <main className="mt-14 flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
