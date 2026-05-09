import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HiveCard from "@/components/ui/HiveCard";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      question: {
        include: {
          user: {
            select: { id: true, name: true, badge: true, university: true, department: true },
          },
          _count: { select: { answers: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mb-6">
        🔖 Yer İşaretlerim
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-app-muted">Henüz kaydedilmiş soru yok.</p>
          <p className="text-sm text-app-muted mt-1">
            Soru kartlarındaki &quot;Kaydet&quot; butonunu kullanarak buraya ekleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <HiveCard
              key={b.id}
              question={b.question}
              userBookmarked={true}
              showBookmark={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
