import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HivesPage() {
  const tagData = await prisma.question.findMany({
    where: { status: "APPROVED" },
    select: { tags: true, voteScore: true, userId: true },
    take: 200,
  });

  // Aggregate tag stats
  const tagMap: Record<string, { score: number; questionCount: number; userIds: Set<string> }> = {};
  for (const q of tagData) {
    for (const t of q.tags) {
      if (!tagMap[t]) tagMap[t] = { score: 0, questionCount: 0, userIds: new Set() };
      tagMap[t].score += q.voteScore;
      tagMap[t].questionCount += 1;
      tagMap[t].userIds.add(q.userId);
    }
  }

  const hives = Object.entries(tagMap)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([tag, stats]) => ({
      tag,
      label: tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      questionCount: stats.questionCount,
      score: stats.score,
      memberCount: stats.userIds.size,
    }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mb-1">
          🍯 Tüm Kovanlar
        </h1>
        <p className="text-app-muted text-sm">
          {hives.length} aktif kovan · Tıklayarak soruları filtrele
        </p>
      </div>

      {hives.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">🏗️</span>
          <p className="mt-4 text-app-muted">Henüz onaylanmış soru yok.</p>
          <Link href="/questions/new" className="btn-primary inline-flex mt-4">
            İlk Soruyu Sor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hives.map((hive) => (
            <Link
              key={hive.tag}
              href={`/?tag=${hive.tag}`}
              className="post-card group hover:border-honey transition-colors block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 hex-clip bg-honey/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🍯</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-app-text dark:text-dark-text group-hover:text-honey transition-colors">
                      {hive.label}
                    </h2>
                    <p className="text-xs text-app-muted">
                      {hive.questionCount} soru · {hive.memberCount} arı
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-honey">↑ {hive.score}</p>
                  <p className="text-[10px] text-app-muted">Polen</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
