import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding UniHive database...");

  // Admin user
  const adminHash = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@unihive.edu.tr" },
    update: {},
    create: {
      email: "admin@unihive.edu.tr",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      university: "UniHive",
      score: 999,
      badge: "Queen Bee",
    },
  });

  // Student users
  const hash = await bcrypt.hash("student1234", 12);

  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: "ada@itu.edu.tr" },
      update: {},
      create: {
        email: "ada@itu.edu.tr",
        name: "Ada Lovelace",
        passwordHash: hash,
        role: "USER",
        university: "İstanbul Teknik Üniversitesi",
        department: "Bilgisayar Mühendisliği",
        score: 145,
        badge: "Worker Bee",
      },
    }),
    prisma.user.upsert({
      where: { email: "alan@metu.edu.tr" },
      update: {},
      create: {
        email: "alan@metu.edu.tr",
        name: "Alan Turing",
        passwordHash: hash,
        role: "USER",
        university: "Orta Doğu Teknik Üniversitesi",
        department: "Matematik",
        score: 520,
        badge: "Queen Bee",
      },
    }),
    prisma.user.upsert({
      where: { email: "grace@boun.edu.tr" },
      update: {},
      create: {
        email: "grace@boun.edu.tr",
        name: "Grace Hopper",
        passwordHash: hash,
        role: "USER",
        university: "Boğaziçi Üniversitesi",
        department: "Elektrik Elektronik Mühendisliği",
        score: 75,
        badge: "Worker Bee",
      },
    }),
  ]);

  // Questions
  const q1 = await prisma.question.upsert({
    where: { id: "seed-q1" },
    update: {},
    create: {
      id: "seed-q1",
      userId: students[0].id,
      title: "Dinamik programlama ile en uzun artan alt dizi nasıl bulunur?",
      body:
        "Algoritmalar dersinde LIS problemini ödevde işliyoruz. O(n log n) çözümü anlamak istiyorum, O(n²) versiyonunu anlıyorum ama daha verimli yolu tam çözemedim.",
      tags: JSON.stringify(["algoritmalar", "dinamik-programlama", "yazılım"]),
      imageUrls: JSON.stringify([]),
      status: "APPROVED",
      voteScore: 12,
    },
  });

  const q2 = await prisma.question.upsert({
    where: { id: "seed-q2" },
    update: {},
    create: {
      id: "seed-q2",
      userId: students[1].id,
      title: "Fourier dönüşümünün sinyaller teorisindeki önemi nedir?",
      body:
        "Sinyaller ve Sistemler dersinde Fourier dönüşümü işliyoruz. Gerçek hayatta hangi alanlarda kullanılıyor ve neden bu kadar temel bir araç?",
      tags: JSON.stringify(["matematik", "sinyaller", "mühendislik"]),
      imageUrls: JSON.stringify([]),
      status: "APPROVED",
      voteScore: 8,
    },
  });

  const q3 = await prisma.question.upsert({
    where: { id: "seed-q3" },
    update: {},
    create: {
      id: "seed-q3",
      userId: students[2].id,
      title: "React'te useEffect bağımlılık dizisi neden bu kadar önemli?",
      body:
        "Web Programlama projesinde React kullanıyorum. useEffect hook'undaki dependency array konusunda kafam karıştı, ne zaman ne eklemeliyim?",
      tags: JSON.stringify(["react", "javascript", "web"]),
      imageUrls: JSON.stringify([]),
      status: "APPROVED",
      voteScore: 15,
    },
  });

  const q4 = await prisma.question.upsert({
    where: { id: "seed-q4" },
    update: {},
    create: {
      id: "seed-q4",
      userId: students[0].id,
      title: "Veri tabanı normalizasyonu için iyi Türkçe kaynak var mı?",
      body: "Veritabanı dersinde 3NF, BCNF konularını çalışıyorum. Türkçe kaynak önerisi bekliyorum.",
      tags: JSON.stringify(["veritabanı", "sql", "akademik"]),
      imageUrls: JSON.stringify([]),
      status: "PENDING",
      voteScore: 0,
    },
  });

  // Answers
  await prisma.answer.upsert({
    where: { id: "seed-a1" },
    update: {},
    create: {
      id: "seed-a1",
      questionId: q1.id,
      userId: students[1].id,
      body:
        "O(n log n) LIS için patience sorting ve binary search kullanılır. Her eleman için geçerli dizilerin en küçük sonunu tutan bir `tails` dizisi tutarsın. Her yeni eleman için binary search ile doğru konumu bulup tails'i güncellersin. Sonuç olarak tails.length LIS uzunluğunu verir.",
      imageUrls: JSON.stringify([]),
      status: "APPROVED",
      voteScore: 7,
      isBest: true,
    },
  });

  await prisma.answer.upsert({
    where: { id: "seed-a2" },
    update: {},
    create: {
      id: "seed-a2",
      questionId: q3.id,
      userId: students[1].id,
      body:
        "useEffect bağımlılık dizisi, efektin hangi state/prop değişikliklerinde yeniden çalışacağını belirler. Boş dizi [] = sadece mount'ta çalışır. Hiç verilmezse = her render'da çalışır. İçine bir değer koyarsan = o değer değiştiğinde çalışır. Temel kural: efekt içinde kullandığın her state ve prop'u bağımlılık dizisine ekle.",
      imageUrls: JSON.stringify([]),
      status: "APPROVED",
      voteScore: 11,
      isBest: false,
    },
  });

  // Update q1 as resolved
  await prisma.question.update({
    where: { id: q1.id },
    data: { isResolved: true },
  });

  console.log("✅ Seed tamamlandı!");
  console.log("👤 Admin: admin@unihive.edu.tr / admin1234");
  console.log("👤 Student: ada@itu.edu.tr / student1234");
  console.log("👤 Student: alan@metu.edu.tr / student1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
