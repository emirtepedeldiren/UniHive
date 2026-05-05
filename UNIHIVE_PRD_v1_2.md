# 🐝 UNIHIVE — PRD v1.2

| | |
|---|---|
| **Proje** | UNIHIVE – Akademik Yardımlaşma Platformu |
| **Revizyon** | 4 Mayıs 2026 |
| **Demo** | 14 Mayıs 2026 |

---

## 0. Özet

Üniversite öğrencilerinin `.edu` mailiyle kayıt olup akademik soru sorup cevapladığı, admin onaylı, "Kovan" temalı gamifiye Q&A platformu.

---

## 1. Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| **Full-stack** | Next.js 15 (App Router) |
| **Veritabanı** | PostgreSQL |
| **ORM** | Prisma |
| **Stil** | Tailwind CSS |
| **Tasarım** | Stitch (`design.md`) |
| **Auth** | NextAuth.js (.edu mail + credential) |
| **Deploy** | Plesk (Node.js process + Nginx reverse proxy) |

**Neden Next.js full-stack?** API Routes ile ayrı backend gereksiz; Server Actions ile form işlemleri sunucuda; Prisma doğrudan server-side çağrılır. 10 günde MVP için en az yük bu yapıda.

---

## 2. Özellik Listesi

| # | Modül | MVP? |
|---|-------|------|
| 1 | Kayıt / Giriş (.edu doğrulama) | ✅ |
| 2 | Ana Feed – soru kartları, filtre, arama | ✅ |
| 3 | Soru oluşturma – metin, fotoğraf (max 3), etiket | ✅ |
| 4 | Soru detay – cevaplar, upvote/downvote, en iyi cevap | ✅ |
| 5 | Cevap gönderme | ✅ |
| 6 | Kullanıcı profili – puan, rozet, geçmiş | ✅ |
| 7 | Admin paneli – onayla / reddet / red gerekçesi | ✅ |
| 8 | Bildirim merkezi | 🔶 MVP+ |
| 9 | Liderboard & rozet sistemi | 🔶 MVP+ |
| 10 | Bölüm toplulukları | 🔵 V2 |

---

## 3. Moderasyon

AI yok. Admin kullanıcısı her gönderiyi elle onaylar.

```
Gönderi → status: PENDING → Admin paneli → APPROVED (feed'e çıkar) 
                                         → REJECTED (gerekçe bildirimi)
```

Puan tetikleyicileri Server Action içinde onay anında işlenir:

| Eylem | Puan |
|-------|------|
| Soru onaylandı | +5 |
| Cevap onaylandı | +10 |
| Upvote alındı | +2 |
| Downvote alındı | -1 |
| En iyi cevap | +20 |
| İçerik reddedildi | -5 |

---

## 4. Veritabanı (Prisma Schema Özeti)

```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  role        Role      @default(USER)
  university  String
  department  String?
  score       Int       @default(0)
  badge       String    @default("Drone")
  questions   Question[]
  answers     Answer[]
  votes       Vote[]
  notifications Notification[]
  createdAt   DateTime  @default(now())
}

model Question {
  id          String    @id @default(cuid())
  userId      String
  title       String
  body        String?
  imageUrls   String[]
  tags        String[]
  status      Status    @default(PENDING)
  rejectReason String?
  isResolved  Boolean   @default(false)
  voteScore   Int       @default(0)
  answers     Answer[]
  votes       Vote[]
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
}

model Answer {
  id           String   @id @default(cuid())
  questionId   String
  userId       String
  body         String
  imageUrls    String[]
  isBest       Boolean  @default(false)
  status       Status   @default(PENDING)
  rejectReason String?
  voteScore    Int      @default(0)
  question     Question @relation(fields: [questionId], references: [id])
  user         User     @relation(fields: [userId], references: [id])
  votes        Vote[]
  createdAt    DateTime @default(now())
}

model Vote {
  id         String   @id @default(cuid())
  userId     String
  targetType String
  targetId   String
  value      Int
  user       User     @relation(fields: [userId], references: [id])
  createdAt  DateTime @default(now())
  @@unique([userId, targetId])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  refId     String?
  message   String
  isRead    Boolean  @default(false)
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

enum Role   { USER ADMIN }
enum Status { PENDING APPROVED REJECTED }
```

---

## 5. 10 Günlük Sprint Planı

**Ekip:** FE (Frontend), BE (Backend/API), PM  
**Kural:** Tasarım Stitch `design.md`'den alınıyor — FE sıfırdan tasarım yapmaz, doğrudan implement eder.

| Gün | FE | BE | PM |
|-----|----|----|-----|
| **1** | Proje init, Tailwind, Stitch design.md entegrasyonu, layout/komponent iskelet | Next.js init, Prisma + PostgreSQL bağlantısı, schema migrate | Plesk sunucu + domain + SSL hazırlığı, Stitch MCP bağlantısı |
| **2** | Auth sayfaları (kayıt, giriş, mail doğrulama) | NextAuth kurulumu, .edu regex, domain whitelist, session | Test hesapları, auth uçtan uca QA |
| **3** | Feed sayfası, soru kartı, filtre, arama | Questions + Users CRUD API (Route Handlers) | API sözleşmesi, Postman koleksiyonu |
| **4** | Soru oluşturma formu, fotoğraf upload | Upload endpoint, görsel kaydetme, Server Actions | QA: soru akışı |
| **5** | Soru detay, cevap bileşeni, upvote/downvote UI | Answers CRUD, vote API, puan hesaplama, is_best | QA: cevap + oy akışı |
| **6** | Admin moderasyon paneli UI | Admin middleware, onayla/reddet Server Actions, bildirim oluşturma | Moderasyon akışı uçtan uca testi |
| **7** | Profil sayfası, bildirim merkezi | Notifications API, polling endpoint | Tam QA + bug triaj |
| **8** | Liderboard + rozet UI, responsive + dark mode | Liderboard sorgusu, rozet atama logic | Lighthouse audit, performans |
| **9** | Son polish, animasyonlar | Plesk deploy: Node.js process, Nginx config, env prod | Demo data seed, demo senaryosu |
| **10** | 🛡️ Buffer / hotfix | 🛡️ Buffer / hotfix | 🛡️ Sunum hazırlığı |

> ⚠️ **Kritik riskler:** Admin paneli (Gün 6) + Plesk deploy (Gün 9). Her ikisi için Gün 10 buffer kullanılabilir.

---

## 6. Riskler

| Risk | Önlem |
|------|-------|
| Plesk Node.js deploy sorunu | Gün 8'de kuru run; fallback: manuel SSH + PM2 |
| .edu mail atlatma | Regex + DB `emailVerified` çift kontrol |
| 10 günde yetişmeme | MVP+ kapsam dışı; demo data pre-seed; Gün 10 buffer |

---

*© 2026 UNIHIVE – Gizlidir*
