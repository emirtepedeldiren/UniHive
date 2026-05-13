import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButton from "@/components/ui/ShareButton";
import PostedBanner from "@/components/ui/PostedBanner";

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; sort?: string; posted?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { q, tag, sort = "hot", posted } = params;
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; name?: string; email?: string } | undefined;

  const where: {
    status: string;
    OR?: { title?: { contains: string; mode: "insensitive" }; body?: { contains: string; mode: "insensitive" } }[];
    tags?: { has: string };
  } = { status: "APPROVED" };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } },
    ];
  }
  if (tag) {
    where.tags = { has: tag };
  }

  const orderBy =
    sort === "new"
      ? { createdAt: "desc" as const }
      : { voteScore: "desc" as const };

  const questions = await prisma.question.findMany({
    where,
    orderBy,
    take: 20,
    include: {
      user: { select: { id: true, name: true, email: true, badge: true } },
      _count: { select: { answers: true } },
    },
  });

  // Right sidebar data (direct Prisma queries — no API fetch needed in server component)
  const popularTagData = await prisma.question.findMany({
    where: { status: "APPROVED" },
    select: { tags: true, voteScore: true },
    take: 50,
  });
  const tagMap: Record<string, number> = {};
  for (const pq of popularTagData) {
    for (const t of pq.tags) {
      tagMap[t] = (tagMap[t] || 0) + pq.voteScore + 1;
    }
  }
  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topUsers = await prisma.user.findMany({
    where: { score: { gt: 0 } },
    orderBy: { score: "desc" },
    take: 3,
    select: { id: true, name: true, email: true, score: true, badge: true },
  });

  // Fetch user bookmarks for bookmark button state
  const bookmarkedIds = new Set<string>();
  if (user) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      select: { questionId: true },
    });
    bookmarks.forEach((b) => bookmarkedIds.add(b.questionId));
  }

  return (
    <div className="flex max-w-5xl mx-auto px-4 py-6 gap-6">
      {/* Feed */}
      <div className="flex-1 min-w-0">
        {/* Success banner after question submission */}
        {posted === "1" && <PostedBanner />}

        {/* Compose box */}
        {session && (
          <div className="compose-box animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-honey flex items-center justify-center font-bold text-hive-black text-sm flex-shrink-0">
                {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
              </div>
              <Link
                href="/questions/new"
                id="compose-box-link"
                className="flex-1 bg-app-bg dark:bg-dark-bg border border-app-border dark:border-dark-border rounded-full px-4 py-2.5 text-sm text-app-muted cursor-pointer hover:border-honey transition-colors"
              >
                Kovanda neler oluyor?
              </Link>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-app-border dark:border-dark-border">
              <div className="flex items-center gap-4">
                <Link href="/questions/new" className="flex items-center gap-1.5 text-app-muted text-sm hover:text-honey transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  Foto
                </Link>
                <Link href="/questions/new" className="flex items-center gap-1.5 text-app-muted text-sm hover:text-honey transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  Grafik
                </Link>
                <Link href="/questions/new" className="flex items-center gap-1.5 text-app-muted text-sm hover:text-honey transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                  Ekle
                </Link>
              </div>
              <Link href="/questions/new" id="compose-paylas-btn" className="btn-primary text-xs px-4 py-1.5">
                Paylaş
              </Link>
            </div>
          </div>
        )}

        {/* Sort tabs */}
        <div className="flex items-center gap-1 mb-4">
          {[
            { key: "hot", label: "🔥 Popüler" },
            { key: "new", label: "✨ Yeni" },
            { key: "top", label: "⬆ En Çok Oy" },
          ].map((s) => (
            <Link
              key={s.key}
              href={`/?sort=${s.key}${q ? `&q=${q}` : ""}${tag ? `&tag=${tag}` : ""}`}
              id={`sort-${s.key}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                sort === s.key
                  ? "bg-honey text-hive-black"
                  : "text-app-muted hover:text-app-text hover:bg-app-hover dark:hover:bg-dark-hover"
              }`}
            >
              {s.label}
            </Link>
          ))}
          {(q || tag) && (
            <Link href="/" className="ml-auto text-xs text-app-muted hover:text-sting transition-colors">
              ✕ Filtreyi kaldır
            </Link>
          )}
        </div>

        {/* Questions */}
        {questions.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🐝</span>
            <p className="mt-3 text-app-muted">Henüz onaylanmış soru yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => {
              const qTags = Array.isArray(question.tags) ? question.tags : [];
              const handle = question.user.name || question.user.email?.split("@")[0] || "?";
              return (
                <article
                  key={question.id}
                  id={`post-${question.id}`}
                  className="post-card animate-fade-up"
                >
                  <div className="flex gap-4">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <button className="vote-btn" aria-label="Pollinate">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <span className="text-sm font-bold text-app-text dark:text-dark-text tabular-nums">
                        {question.voteScore}
                      </span>
                      <button className="vote-btn" aria-label="Sting">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author row */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                          {handle.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link href={`/profile/${question.user.id}`} className="font-semibold text-sm text-app-text dark:text-dark-text hover:underline">
                              {question.user.name || "Anonim"}
                            </Link>
                            <span className="text-xs text-app-muted">@{handle.toLowerCase().replace(/\s/g, "_")}</span>
                            <span className="text-xs text-app-muted">·</span>
                            <span className="text-xs text-app-muted">{timeAgo(question.createdAt)}</span>
                          </div>
                          {qTags[0] && (
                            <Link href={`/?tag=${qTags[0]}`} className="tag-chip">
                              #{qTags[0]}
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/questions/${question.id}`} className="block group">
                        <h2 className="font-semibold text-[15px] text-app-text dark:text-dark-text group-hover:text-honey transition-colors leading-snug">
                          {question.isResolved && (
                            <span className="inline-flex items-center mr-1.5 px-1.5 py-0.5 bg-green-100 text-pollinate text-xs rounded font-bold">✓ Çözüldü</span>
                          )}
                          {question.title}
                        </h2>
                        {question.body && (
                          <p className="text-sm text-app-muted dark:text-dark-muted mt-1 line-clamp-2 leading-relaxed">
                            {question.body}
                          </p>
                        )}
                      </Link>

                      {/* Footer */}
                      <div className="flex items-center gap-5 mt-3">
                        <Link href={`/questions/${question.id}`} className="flex items-center gap-1.5 text-app-muted text-xs hover:text-app-text transition-colors">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {question._count.answers}
                        </Link>
                        <ShareButton path={`/questions/${question.id}`} title={question.title} />
                        {user && (
                          <BookmarkButton
                            questionId={question.id}
                            initialBookmarked={bookmarkedIds.has(question.id)}
                          />
                        )}
                        {qTags.slice(1).map((t) => (
                          <Link key={t} href={`/?tag=${t}`} className="text-app-muted text-xs font-semibold tracking-wide uppercase hover:text-honey transition-colors">
                            #{t}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="w-72 flex-shrink-0 space-y-4">
        {/* Popular Pollen */}
        <div className="sidebar-card">
          <h3 className="font-bold text-sm text-app-text dark:text-dark-text mb-3">Popüler Polenler</h3>
          <div className="space-y-2.5">
            {topTags.map(([t, score], i) => (
              <Link key={t} href={`/?tag=${t}`} className="block group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-app-muted">{i + 1} · Akademik</p>
                    <p className="text-sm font-semibold text-app-text dark:text-dark-text group-hover:text-honey transition-colors capitalize">
                      {t.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-app-muted">{score} Polenlendi</p>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/hives" className="text-honey text-xs font-semibold hover:text-honey-dark transition-colors">
              Daha fazla göster
            </Link>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="sidebar-card">
          <h3 className="font-bold text-sm text-app-text dark:text-dark-text mb-3">Önerilen Arılar</h3>
          <div className="space-y-3">
            {topUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                  {(u.name || u.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-app-text dark:text-dark-text truncate">
                    {u.name || "Anonim"}
                  </p>
                  <p className="text-xs text-app-muted">{u.score} Polen Puanı</p>
                </div>
                <Link href={`/profile/${u.id}`} className="btn-outline text-xs px-3 py-1">
                  Takip Et
                </Link>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
