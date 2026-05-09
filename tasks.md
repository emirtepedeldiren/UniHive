# UniHive — Görev Listesi

## P0 · Kırık Linkler

- [ ] `/notifications` sayfası oluştur (Sidebar + TopBar'da linklenmiş, 404 veriyor)
- [ ] `/bookmarks` sayfası oluştur (Sidebar + TopBar'da linklenmiş, 404 veriyor)
- [ ] `/messages` sayfası oluştur (Sidebar'da linklenmiş, 404 veriyor)
- [ ] `/settings` sayfası oluştur (Sidebar'da linklenmiş, 404 veriyor)
- [ ] `/help` sayfası oluştur (Sidebar'da linklenmiş, 404 veriyor)

## P1 · Eksik İşlevsellik

- [ ] Profil düzenleme — `profile/[id]/page.tsx` içindeki "Profili Düzenle" butonuna handler ve sayfa/modal ekle
- [ ] Re-hive (paylaşım) — `HiveCard.tsx` içindeki Share/Re-hive butonuna işlevsellik ekle; gerekirse DB modeli ekle
- [ ] Compose box ekleri — Ana sayfadaki compose kutusundaki foto/grafik/ek butonlarını işlevsel yap
- [ ] Yer işaretleri (Bookmark) — `prisma/schema.prisma`'ya `Bookmark` modeli ekle, API route yaz, profil "Kaydedilenler" sekmesini ve `/bookmarks` sayfasını gerçek veriyle doldur

## P2 · Veri Kalitesi

- [ ] Sağ sidebar "İlgili Konular" ve "Katkıda Bulunanlar" — statik dummy veriden API'ye taşı
- [ ] Bildirim sayacı — TopBar zil ikonuna `Notification` tablosundan okunmamış sayı çek ve göster
- [ ] `/hives` sayfası — `explore/page.tsx` içindeki "Tümünü Gör" linki bu sayfaya gidiyor; oluştur

## P3 · Teknik Borç

- [ ] ESLint hataları — `any` tiplerini düzelt, kullanılmayan `totalUsers` / `hives` / `BADGE_EMOJI` değişkenlerini temizle, JSX apostroflarını (`'` → `&apos;`) kaçır
- [ ] `Navbar.tsx` sil — Hiçbir yerde kullanılmıyor
- [ ] `MainLayout.tsx` sil — Route group refaktörüyle gereksiz kaldı
- [ ] `<img>` → `<Image>` — `HiveCard.tsx` ve `questions/new/page.tsx` içindeki `<img>` taglarını `next/image` ile değiştir (LCP iyileştirmesi)
- [ ] Email doğrulama — `User.emailVerified` alanı var ama hiçbir yerde zorunlu tutulmuyor; kayıt akışına veya oturum kontrolüne ekle

## P4 · Yeni Özellikler

- [ ] Gerçek zamanlı bildirimler — WebSocket veya polling ile anlık bildirim akışı
- [ ] Dark mode tamamlanması — Token'lar `tailwind.config.ts`'de tanımlı; eksik kalan sayfa ve bileşenlerde `dark:` class'larını tamamla
- [ ] Tam metin arama — TopBar arama şu an sadece `/?q=` ile başlık filtresi yapıyor; PostgreSQL `ILIKE` veya full-text search ile genişlet
