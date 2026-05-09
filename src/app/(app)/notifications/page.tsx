import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import MarkAllReadButton from "./MarkAllReadButton";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    take: 50,
  });

  const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text">
          🔔 Bildirimler
        </h1>
        {unreadIds.length > 0 && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">🔕</span>
          <p className="mt-4 text-app-muted">Henüz bildirim yok.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`post-card flex items-start gap-3 transition-colors ${
                !n.isRead ? "border-l-2 border-honey" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-honey/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">
                  {n.type === "ANSWER" ? "💬" : n.type === "VOTE" ? "⬆" : n.type === "BEST" ? "✓" : "🐝"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-app-text dark:text-dark-text">{n.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-app-muted">{timeAgo(n.createdAt)}</span>
                  {n.refId && (
                    <Link
                      href={`/questions/${n.refId}`}
                      className="text-xs text-honey hover:text-honey-dark font-semibold transition-colors"
                    >
                      Göster →
                    </Link>
                  )}
                </div>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 rounded-full bg-honey flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
