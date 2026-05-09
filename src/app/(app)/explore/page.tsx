import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ExplorePage() {
  const categories = [
    { id: "matematik", label: "Matematik", icon: "🧮" },
    { id: "muhendislik", label: "Mühendislik", icon: "⚙️" },
    { id: "guzel-sanatlar", label: "Güzel Sanatlar", icon: "🎨" },
    { id: "yasam-bilimleri", label: "Yaşam Bilimleri", icon: "🔬" },
    { id: "bilgisayar-bilimleri", label: "Bilgisayar Bilimleri", icon: "💻" },
  ];

  const popularTagData = await prisma.question.findMany({
    where: { status: "APPROVED" },
    select: { tags: true, voteScore: true },
    take: 100,
  });

  const tagMap: Record<string, { score: number; count: number }> = {};
  for (const q of popularTagData) {
    q.tags.forEach((t) => {
      if (!tagMap[t]) tagMap[t] = { score: 0, count: 0 };
      tagMap[t].score += q.voteScore + 1;
      tagMap[t].count += 1;
    });
  }

  const hives = Object.entries(tagMap)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 6)
    .map(([tag, stats]) => ({
      name: tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      score: stats.score,
      count: stats.count,
      tag,
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-extrabold text-3xl text-app-text dark:text-dark-text mb-2">
          Sürüyü Keşfet
        </h1>
        <p className="text-app-muted text-sm">
          Toplulukları, akranları ve akademik kaynakları bulun.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/?tag=${c.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-app-border dark:border-dark-border text-sm font-semibold bg-white dark:bg-dark-card text-app-text dark:text-dark-text hover:border-honey transition-all"
          >
            <span className="text-base">{c.icon}</span>
            {c.label}
          </Link>
        ))}
      </div>

      {/* Popular Hives Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-bold text-xl text-app-text dark:text-dark-text flex items-center gap-2">
          🔥 Popüler Kovanlar
        </h2>
        <Link href="/hives" className="text-honey text-sm font-semibold hover:text-honey-dark transition-colors">
          Hepsini Gör
        </Link>
      </div>

      {hives.length === 0 ? (
        <div className="post-card text-center py-12">
          <span className="text-4xl">🐝</span>
          <p className="mt-3 text-app-muted text-sm">Henüz onaylanmış soru yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured Hive */}
          {hives[0] && (
            <Link href={`/?tag=${hives[0].tag}`} className="bg-honey rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 hex-clip bg-white/50 mb-4 flex items-center justify-center">
                <span className="text-xl">🍯</span>
              </div>
              <h3 className="font-extrabold text-xl text-hive-black mb-1">{hives[0].name}</h3>
              <p className="text-hive-black/80 text-sm mb-2">{hives[0].count} soru · {hives[0].score} Polen</p>
              <span className="text-xs font-bold text-hive-black/70 uppercase tracking-wider">#{hives[0].tag}</span>
            </Link>
          )}

          {/* Other Hives */}
          {hives.slice(1).map((hive) => (
            <Link
              key={hive.tag}
              href={`/?tag=${hive.tag}`}
              className="post-card flex items-center justify-between group hover:border-honey"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 hex-clip bg-honey/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍯</span>
                </div>
                <div>
                  <h3 className="font-bold text-app-text dark:text-dark-text group-hover:text-honey transition-colors">
                    {hive.name}
                  </h3>
                  <p className="text-sm text-app-muted">{hive.count} soru · {hive.score} Polen</p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full border border-app-border dark:border-dark-border flex items-center justify-center text-app-text dark:text-dark-text group-hover:bg-honey group-hover:border-honey group-hover:text-hive-black transition-colors flex-shrink-0 ml-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
