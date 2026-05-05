# UniHive Design System (Design.md)

## Marka & Stil Özeti
UniHive, üniversite öğrencileri için tasarlanmış, Reddit'in topluluk yapısını, Twitter'ın hızını ve Kunduz'un akademik yardım odaklılığını birleştiren bir "Akademik Kovan" platformudur. Tasarım dili, arı ve kovan metaforu etrafında şekillenmiştir: Öğrenciler "Arı", platform "Kovan", içerikler ise "Polen" olarak tanımlanır.

## Renk Paleti (Dual-Theme)

### Aydınlık Mod (Light Mode)
- **Ana Arka Plan:** #FFF8F0 (Sıcak Beyaz / Kağıt)
- **Yüzeyler (Kartlar):** #FFFFFF (Saf Beyaz)
- **Primary (Bal Sarısı):** #FFD54F
- **Metin (Obsidyen Siyah):** #1F1B12
- **İkincil Aksan (Pembe):** #AB2C5D (Bildirimler ve Sosyal Vurgular)
- **Başarı (Yeşil):** #4CAF50 (Pollinate / Upvote)
- **Uyarı (Kırmızı):** #F44336 (Sting / Downvote)

### Karanlık Mod (Dark Mode)
- **Ana Arka Plan:** #121212 (Derin Siyah)
- **Yüzeyler (Kartlar):** #1E1E1E (Antrasit / Koyu Gri)
- **Primary (Bal Sarısı):** #FFD54F (Yüksek Kontrastlı)
- **Metin (Kar Beyazı):** #F8F0E1
- **Kenarlıklar:** #2C2C2C

## Tipografi
- **Yazı Tipi:** Plus Jakarta Sans
- **Headline (Başlıklar):** Bold/Extra Bold, Sıkı harf aralığı (-0.02em)
- **Body (Gövde):** Regular, Rahat satır yüksekliği (1.6)
- **Labels (Etiketler):** Uppercase, Bold, 0.05em harf aralığı (Metadata vurgusu için)

## Bileşen Standartları

### 1. Kovan Kartları (The Hive Card)
Twitter benzeri akış kartları. 
- **Light:** 1px #EAE2D3 kenarlık, 20px padding.
- **Dark:** 1px #2C2C2C kenarlık, hafif derinlik (elevation).
- **Profil:** Altıgen (Hexagon) maskeli avatar kullanımı zorunludur.

### 2. Etkileşim Butonları
- **Pollinate (Upvote):** Aktif olduğunda Yeşil (#4CAF50) yanar.
- **Sting (Downvote):** Aktif olduğunda Kırmızı (#F44336) yanar.
- **Tekrarla (Re-hive):** Döngüsel ok ikonlu altıgen buton. Aktifken Bal Sarısı.

### 3. Navigasyon
- **Sol Kenar Çubuğu:** Sabit, ikon ve metin bazlı. Aktif sayfa sarı dikey çizgi ile belirtilir.
- **Üst Çubuk:** Yarı şeffaf, backdrop-blur (buzlu cam) efektli arama çubuğu merkezi.

## Şekil Dili
- **Hexagon (Altıgen):** Avatarlar, "Re-hive" ikon arka planları ve başarı rozetlerinde kullanılır.
- **Radius:** Standart kartlar ve giriş alanları için 0.5rem (8px) yuvarlatma uygulanır.

## Katmanlama (Elevation)
- **Level 0:** Arka plan.
- **Level 1:** Standart kartlar ve içerik blokları.
- **Level 2:** Hover durumları (4px yukarı kayma etkisi) ve modal pencereler.