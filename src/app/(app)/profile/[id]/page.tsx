import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo, BADGE_EMOJI } from "@/lib/utils";
import HiveCard from "@/components/ui/HiveCard";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const BADGE_LEVELS = [
  { name: "Drone", min: 0, next: 50 },
  { name: "Worker Bee", min: 50, next: 200 },
  { name: "Scout Bee", min: 200, next: 500 },
  { name: "Queen Bee", min: 500, next: null },
];

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab = "questions" } = await searchParams;

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      questions: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true, title: true, tags: true, voteScore: true,
          isResolved: true, createdAt: true,
          _count: { select: { answers: true } },
        },
      },
      answers: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { question: { select: { id: true, title: true } } },
      },
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      bookmarks: {
        orderBy: { createdAt: "desc" },
        include: {
          question: {
            include: {
              user: { select: { id: true, name: true, badge: true, university: true, department: true } },
              _count: { select: { answers: true } },
            },
          },
        },
      },
    },
  });

  if (!user) notFound();
  const isOwn = currentUserId === id;

  const currentLevel = BADGE_LEVELS.find((l) => l.name === user.badge) ?? BADGE_LEVELS[0];
  const nextLevel = BADGE_LEVELS[BADGE_LEVELS.indexOf(currentLevel) + 1];
  const progress =
    currentLevel.next !== null
      ? Math.min(100, ((user.score - currentLevel.min) / (currentLevel.next - currentLevel.min)) * 100)
      : 100;

  if (isOwn && user.notifications.length > 0) {
    await prisma.notification.updateMany({
      where: { userId: id, isRead: false },
      data: { isRead: true },
    });
  }

  const TABS = [
    { key: "questions", label: "Sorulan Sorular", count: user.questions.length },
    { key: "answers", label: "Verilen Çözümler", count: user.answers.length },
    { key: "saved", label: "Kaydedilen Kovanlar", count: user.bookmarks.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Profile header card */}
      <div className="post-card mb-6 animate-fade-up">
        <div className="flex items-start gap-6">
          {/* Hex avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 hex-clip bg-honey flex items-center justify-center">
              <span className="font-extrabold text-3xl text-hive-black">
                {(user.name || user.email || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-honey text-hive-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
              🪙 {user.score} HP
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text">
                  {user.name ?? "Anonim Arı"}
                </h1>
                <p className="text-app-muted text-sm">
                  @{(user.name || user.email?.split("@")[0] || "?").toLowerCase().replace(/\s/g, "_")}
                  {user.university && <span> · {user.university}</span>}
                  {user.department && <span> · {user.department}</span>}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isOwn && (
                  <Link href="/settings" className="btn-outline text-sm" id="edit-profile-btn">
                    Profili Düzenle
                  </Link>
                )}
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-app-border dark:border-dark-border hover:bg-app-hover dark:hover:bg-dark-hover transition-colors text-app-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Badge chip */}
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-honey/20 text-hive-black dark:text-honey px-3 py-1 rounded-full text-xs font-bold">
                {BADGE_EMOJI[user.badge] ?? "🐝"} {user.badge}
              </span>
            </div>

            {/* Progress bar */}
            {nextLevel && (
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between text-xs text-app-muted mb-1">
                  <span>{user.score} puan</span>
                  <span>{currentLevel.next} puan → {nextLevel.name}</span>
                </div>
                <div className="h-1.5 bg-app-border dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-honey rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tags / interests */}
            {user.department && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="flex items-center gap-1 border border-pink-accent/30 text-pink-accent text-xs px-2.5 py-1 rounded-full font-semibold">
                  📚 #{user.department.replace(/\s/g, "")}
                </span>
                <span className="flex items-center gap-1 border border-pink-accent/30 text-pink-accent text-xs px-2.5 py-1 rounded-full font-semibold">
                  🏛 #{user.university?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications (own profile) */}
      {isOwn && user.notifications.length > 0 && (
        <div className="sidebar-card mb-4 animate-fade-up">
          <h3 className="font-bold text-sm mb-3 text-app-text dark:text-dark-text">🔔 Bildirimler</h3>
          <div className="space-y-2">
            {user.notifications.map((n) => (
              <div key={n.id} className="text-sm text-app-muted bg-honey/5 px-3 py-2 rounded-lg border border-honey/20">
                {n.message}
                <span className="ml-2 text-xs opacity-60">{timeAgo(n.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content + right sidebar */}
      <div className="flex gap-6">
        {/* Tabs + content */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex border-b border-app-border dark:border-dark-border mb-4">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={`/profile/${id}?tab=${t.key}`}
                id={`profile-tab-${t.key}`}
                className={`px-4 py-3 text-sm font-semibold transition-colors relative ${
                  tab === t.key
                    ? "text-app-text dark:text-dark-text"
                    : "text-app-muted hover:text-app-text dark:hover:text-dark-text"
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className="ml-1.5 text-xs text-app-muted">({t.count})</span>
                )}
                {tab === t.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-honey rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Questions tab */}
          {tab === "questions" && (
            <div className="space-y-3">
              {user.questions.length === 0 ? (
                <p className="text-app-muted text-sm py-8 text-center">Henüz onaylanmış soru yok.</p>
              ) : (
                user.questions.map((q) => {
                  const qTags = q.tags;
                  return (
                    <article key={q.id} className="post-card">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <svg width="12" height="12" className="text-app-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                          <span className="text-xs font-bold text-app-text dark:text-dark-text py-0.5">{q.voteScore}</span>
                          <svg width="12" height="12" className="text-app-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                        <div className="flex-1">
                          <Link href={`/questions/${q.id}`} className="font-semibold text-sm text-app-text dark:text-dark-text hover:text-honey transition-colors block">
                            {q.isResolved && <span className="text-pollinate text-xs mr-1 font-bold">✓ </span>}
                            {q.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {qTags.slice(0, 3).map((t) => (
                              <span key={t} className="tag-chip">#{t}</span>
                            ))}
                            <span className="text-xs text-app-muted">{timeAgo(q.createdAt)}</span>
                            <span className="text-xs text-app-muted">💬 {q._count.answers}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {/* Answers tab */}
          {tab === "answers" && (
            <div className="space-y-3">
              {user.answers.length === 0 ? (
                <p className="text-app-muted text-sm py-8 text-center">Henüz onaylanmış cevap yok.</p>
              ) : (
                user.answers.map((a) => (
                  <article key={a.id} className="post-card">
                    <p className="text-xs text-app-muted mb-1 font-medium">{a.question.title}</p>
                    <Link href={`/questions/${a.question.id}`} className="block text-sm text-app-text dark:text-dark-text line-clamp-2 hover:text-honey transition-colors">
                      {a.body}
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-app-muted">{timeAgo(a.createdAt)}</span>
                      {a.isBest && <span className="text-xs text-pollinate font-bold">✓ En İyi Cevap</span>}
                      <span className="text-xs text-app-muted">↑ {a.voteScore}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* Saved tab */}
          {tab === "saved" && (
            <div className="space-y-3">
              {user.bookmarks.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl">📭</span>
                  <p className="text-app-muted text-sm mt-3">Henüz kaydedilen kovan yok.</p>
                </div>
              ) : (
                user.bookmarks.map((b) => (
                  <HiveCard
                    key={b.id}
                    question={b.question}
                    userBookmarked={true}
                    showBookmark={isOwn}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Academic Impact sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="sidebar-card">
            <h3 className="font-bold text-sm text-app-text dark:text-dark-text mb-4">Akademik Etki</h3>
            {[
              { label: "Kabul Edilen Çözümler", value: user.answers.filter((a) => a.isBest).length },
              { label: "Sorulan Sorular", value: user.questions.length },
              { label: "Kaydedilen Kovanlar", value: user.bookmarks.length },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-app-border dark:border-dark-border last:border-0">
                <span className="text-sm text-app-muted">{s.label}</span>
                <span className="font-bold text-sm text-app-text dark:text-dark-text">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
