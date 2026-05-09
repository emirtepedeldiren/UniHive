import React from "react";
import Link from "next/link";

const FAQ = [
  {
    q: "UniHive nedir?",
    a: "UniHive, üniversite öğrencilerinin akademik sorularını paylaşıp yanıtlayabildiği bir Q&A platformudur. Arı temalı gamification sistemiyle katkıda bulundukça rozet kazanırsın.",
  },
  {
    q: "Nasıl soru sorabilirim?",
    a: 'Giriş yaptıktan sonra sol menüdeki "Gönderi Oluştur" butonuna ya da üst menüdeki arama kutusunun yanındaki alana tıklayarak soru oluşturabilirsin. Sorular admin onayından geçtikten sonra yayınlanır.',
  },
  {
    q: "Polen Puanı nasıl kazanılır?",
    a: "Sorun ya da cevabın oy aldığında puanın artar. Bir cevabın \"En İyi Cevap\" seçilirse ekstra puan kazanırsın. Puanına göre Drone → Worker Bee → Scout Bee → Queen Bee rozetleri açılır.",
  },
  {
    q: "Sorularım neden yayınlanmıyor?",
    a: "Her içerik admin incelemesinden geçer. Onay süreci genellikle 24 saat içinde tamamlanır. Reddedilirse bildirim alırsın.",
  },
  {
    q: "Yer işareti nasıl kullanılır?",
    a: 'Soru kartlarında "Kaydet" butonuna tıklayarak soruyu yer işaretlerine ekleyebilirsin. Kaydettiklerini "/bookmarks" sayfasından veya profilindeki "Kaydedilen Kovanlar" sekmesinden görebilirsin.',
  },
  {
    q: "Profil bilgilerimi nasıl güncellerim?",
    a: 'Profil sayfandaki "Profili Düzenle" butonuna tıklayarak ya da sol menüdeki Ayarlar sayfasına giderek bilgilerini güncelleyebilirsin.',
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mb-2">
        ❓ Yardım Merkezi
      </h1>
      <p className="text-app-muted text-sm mb-8">
        UniHive hakkında sık sorulan sorular ve yanıtlar.
      </p>

      <div className="space-y-4 mb-10">
        {FAQ.map((item, i) => (
          <div key={i} className="post-card">
            <h2 className="font-bold text-sm text-app-text dark:text-dark-text mb-2">
              {item.q}
            </h2>
            <p className="text-sm text-app-muted leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="post-card text-center">
        <p className="text-sm text-app-muted mb-3">
          Yanıt bulamadın mı? Bir soru sor veya bize ulaş.
        </p>
        <Link href="/questions/new" className="btn-primary inline-flex">
          Soru Sor
        </Link>
      </div>
    </div>
  );
}
