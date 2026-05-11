# UniHive — Görev Listesi

## P0 · Kırık Linkler

- [x] `/notifications` sayfası oluştur (Sidebar + TopBar'da linklenmiş, 404 veriyor)
- [x] `/bookmarks` sayfası oluştur (Sidebar + TopBar'da linklenmiş, 404 veriyor)
- [x] `/messages` sayfası oluştur — mesajlaşma sistemi tam olarak uygulandı
- [x] `/settings` sayfası oluştur (avatar + bio desteğiyle)
- [x] `/help` sayfası oluştur

## P1 · Eksik İşlevsellik

- [x] Profil düzenleme — avatar yükleme, biyografi, profil bilgileri düzenleme eklendi
- [ ] Re-hive (paylaşım) — `HiveCard.tsx` içindeki Share/Re-hive butonuna işlevsellik ekle; gerekirse DB modeli ekle
- [ ] Compose box ekleri — Ana sayfadaki compose kutusundaki foto/grafik/ek butonlarını işlevsel yap
- [x] Yer işaretleri (Bookmark) — model + API + UI tamamlandı

## P2 · Veri Kalitesi

- [ ] Sağ sidebar "İlgili Konular" ve "Katkıda Bulunanlar" — statik dummy veriden API'ye taşı
- [x] Bildirim sayacı — TopBar zil ikonuna `Notification` tablosundan okunmamış sayı çekiliyor
- [ ] `/hives` sayfası — `explore/page.tsx` içindeki "Tümünü Gör" linki bu sayfaya gidiyor; oluştur

## P3 · Teknik Borç

- [ ] ESLint hataları — `any` tiplerini düzelt, kullanılmayan `totalUsers` / `hives` / `BADGE_EMOJI` değişkenlerini temizle, JSX apostroflarını (`'` → `&apos;`) kaçır
- [ ] `Navbar.tsx` sil — Hiçbir yerde kullanılmıyor
- [ ] `MainLayout.tsx` sil — Route group refaktörüyle gereksiz kaldı
- [ ] `<img>` → `<Image>` — `HiveCard.tsx` ve `questions/new/page.tsx` içindeki `<img>` taglarını `next/image` ile değiştir (LCP iyileştirmesi)
- [ ] Email doğrulama — `User.emailVerified` alanı var ama hiçbir yerde zorunlu tutulmuyor; kayıt akışına veya oturum kontrolüne ekle

## P4 · Yeni Özellikler

- [ ] Gerçek zamanlı bildirimler — WebSocket veya polling ile anlık bildirim akışı
- [x] Dark mode tamamlanması — Token'lar `tailwind.config.ts`'de tanımlı; tüm sayfalarda `dark:` class'ları mevcut
- [x] Tam metin arama — `mode: 'insensitive'` ile başlık ve body'de büyük/küçük harf duyarsız arama
- [x] Profil dropdown — TopBar'da avatar'a tıklayınca Profil / Ayarlar / Yardım / Çıkış Yap menüsü
- [x] Mesajlaşma — Conversation + Message modelleri, API routes, tam mesajlaşma UI
- [x] Sidebar temizliği — Ayarlar/Yardım/Çıkış dropdown'a taşındı
