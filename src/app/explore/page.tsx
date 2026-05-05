import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ExplorePage() {
  const categories = [
    { id: "matematik", label: "Matematik", icon: "🧮", active: true },
    { id: "muhendislik", label: "Mühendislik", icon: "⚙️" },
    { id: "guzel-sanatlar", label: "Güzel Sanatlar", icon: "🎨" },
    { id: "yasam-bilimleri", label: "Yaşam Bilimleri", icon: "🔬" },
    { id: "bilgisayar-bilimleri", label: "Bilgisayar Bilimleri", icon: "💻" },
  ];

  // Fetch some popular tags to represent "Hives" (Kovanlar)
  const popularTags = await prisma.question.findMany({
    where: { status: "APPROVED" },
    select: { tags: true, voteScore: true },
    take: 100,
  });

  const tagMap: Record<string, number> = {};
  for (const q of popularTags) {
    if (q.tags) {
      try {
        const parsed = JSON.parse(q.tags) as string[];
        parsed.forEach((t) => {
          tagMap[t] = (tagMap[t] || 0) + q.voteScore + 1;
        });
      } catch (e) {}
    }
  }

  const hives = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, score]) => ({
      name: tag.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      score: score * 10, // Simulated activity
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${
              c.active
                ? "bg-honey border-honey text-hive-black"
                : "bg-white dark:bg-dark-card border-app-border dark:border-dark-border text-app-text dark:text-dark-text hover:border-honey"
            }`}
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

      {/* Hive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Hive (Yellow) */}
        <div className="bg-honey rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
          <div className="absolute right-4 top-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-hive-black">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="w-12 h-12 hex-clip bg-white/50 mb-4 flex items-center justify-center">
             <span className="text-xl">📐</span>
          </div>
          <h3 className="font-extrabold text-xl text-hive-black mb-1">Kentsel Tasarım Stüdyosu</h3>
          <p className="text-hive-black/80 text-sm mb-6">850 Arı vızlıyor</p>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-honey hex-clip flex items-center justify-center font-bold text-xs">E</div>
              <div className="w-8 h-8 rounded-full bg-white border-2 border-honey hex-clip flex items-center justify-center font-bold text-xs">M</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-hive-black text-[10px] font-bold flex items-center justify-center">
              +42
            </div>
          </div>
        </div>

        {/* Regular Hive 1 */}
        <div className="bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl p-6 flex items-center justify-between group hover:border-honey transition-colors cursor-pointer">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 hex-clip bg-pink-light/30 flex items-center justify-center flex-shrink-0">
                 <span className="text-2xl text-pink-accent">🧠</span>
              </div>
              <div>
                 <h3 className="font-bold text-app-text dark:text-dark-text">Bilişsel Bilim ve Yapay Zeka</h3>
                 <p className="text-sm text-app-muted">2.4k Arı vızlıyor</p>
                 <p className="text-xs text-app-text dark:text-dark-text mt-2 line-clamp-2">
                   Nöral ağlar ve insan biliş modellemesi üzerine en son makaleleri tartışıyoruz.
                 </p>
                 <div className="flex gap-2 mt-2">
                    <span className="bg-app-bg dark:bg-dark-bg text-app-muted text-[10px] font-bold px-2 py-1 rounded-full">#MachineLearning</span>
                 </div>
              </div>
           </div>
           <button className="w-10 h-10 rounded-full border border-app-border dark:border-dark-border flex items-center justify-center text-app-text dark:text-dark-text group-hover:bg-honey group-hover:border-honey group-hover:text-hive-black transition-colors flex-shrink-0 ml-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
           </button>
        </div>

        {/* Regular Hive 2 */}
        <div className="bg-white dark:bg-dark-card border border-app-border dark:border-dark-border rounded-xl p-6 flex items-center justify-between group hover:border-honey transition-colors cursor-pointer">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 hex-clip bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                 <span className="text-2xl">⚖️</span>
              </div>
              <div>
                 <h3 className="font-bold text-app-text dark:text-dark-text">Hukuk Öncesi Topluluğu</h3>
                 <p className="text-sm text-app-muted">1.2k Arı vızlıyor</p>
                 <p className="text-xs text-app-text dark:text-dark-text mt-2 line-clamp-2">
                   LSAT hazırlığı, deneme mahkemeleri ve gelecek vadeden avukatlar için ağ...
                 </p>
              </div>
           </div>
           <button className="w-10 h-10 rounded-full border border-app-border dark:border-dark-border flex items-center justify-center text-app-text dark:text-dark-text group-hover:bg-honey group-hover:border-honey group-hover:text-hive-black transition-colors flex-shrink-0 ml-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
           </button>
        </div>

      </div>
    </div>
  );
}
