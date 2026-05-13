import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";
import ThemeSelector from "./ThemeSelector";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, university: true, department: true, country: true, avatarUrl: true, bio: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mb-6">
        Hesap Ayarları
      </h1>

      <div className="post-card mb-6">
        <h2 className="font-bold text-sm text-app-text dark:text-dark-text mb-4">
          Profil Bilgileri
        </h2>
        <SettingsForm
          initialName={user.name ?? ""}
          initialUniversity={user.university}
          initialDepartment={user.department ?? ""}
          initialCountry={user.country ?? ""}
          initialBio={user.bio ?? ""}
          initialAvatarUrl={user.avatarUrl ?? ""}
          email={user.email}
        />
      </div>

      <div className="post-card mb-6">
        <h2 className="font-bold text-sm text-app-text dark:text-dark-text mb-4">
          Görünüm
        </h2>
        <ThemeSelector />
      </div>

      <div className="post-card opacity-60">
        <h2 className="font-bold text-sm text-app-text dark:text-dark-text mb-2">
          Şifre Değiştir
        </h2>
        <p className="text-sm text-app-muted">Bu özellik yakında geliyor.</p>
      </div>
    </div>
  );
}
