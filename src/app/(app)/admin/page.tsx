import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import ModerateButton from "./ModerateButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const pendingQuestions = await prisma.question.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, university: true } },
      _count: { select: { answers: true } },
    },
  });

  const pendingAnswers = await prisma.answer.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, university: true } },
      question: { select: { id: true, title: true } },
    },
  });

  const totalApproved = await prisma.question.count({ where: { status: "APPROVED" } });
  const totalRejected = await prisma.question.count({ where: { status: "REJECTED" } });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="headline-md text-hive-black flex items-center gap-2">
          🛡️ Admin Paneli
        </h1>
        <p className="body-sm text-on-surface-variant mt-1">
          İçerikleri incele, onayla veya reddet.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Bekleyen Soru", value: pendingQuestions.length, color: "bg-honey-pale text-on-primary-fixed" },
          { label: "Bekleyen Cevap", value: pendingAnswers.length, color: "bg-honey-pale text-on-primary-fixed" },
          { label: "Onaylanan", value: totalApproved, color: "bg-green-100 text-pollen-green" },
          { label: "Reddedilen", value: totalRejected, color: "bg-red-100 text-sting-red" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.color} rounded-xl p-4 text-center`}
          >
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="label-caps mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Questions */}
      <section className="mb-10">
        <h2 className="title-sm text-hive-black mb-4">
          📝 Bekleyen Sorular ({pendingQuestions.length})
        </h2>

        {pendingQuestions.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-outline-variant rounded-xl text-on-surface-variant body-sm">
            🎉 Bekleyen soru yok!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingQuestions.map((q) => {
              const tags = Array.isArray(q.tags) ? q.tags : [];
              return (
                <div
                  key={q.id}
                  id={`admin-q-${q.id}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-hive-black">{q.title}</p>
                      {q.body && (
                        <p className="body-sm text-on-surface-variant mt-1 line-clamp-2">
                          {q.body}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="label-caps text-on-surface-variant">
                          {q.user.name ?? q.user.email} · {q.user.university}
                        </span>
                        <span className="label-caps text-on-surface-variant">
                          {timeAgo(q.createdAt)}
                        </span>
                        {tags.map((t) => (
                          <span key={t} className="community-chip text-xs">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ModerateButton id={q.id} type="question" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pending Answers */}
      <section>
        <h2 className="title-sm text-hive-black mb-4">
          💬 Bekleyen Cevaplar ({pendingAnswers.length})
        </h2>

        {pendingAnswers.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-outline-variant rounded-xl text-on-surface-variant body-sm">
            🎉 Bekleyen cevap yok!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAnswers.map((a) => (
              <div
                key={a.id}
                id={`admin-a-${a.id}`}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="label-caps text-on-surface-variant mb-1">
                      Soru: {a.question.title}
                    </p>
                    <p className="body-sm text-hive-black line-clamp-3">{a.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="label-caps text-on-surface-variant">
                        {a.user.name ?? a.user.email} · {a.user.university}
                      </span>
                      <span className="label-caps text-on-surface-variant">
                        {timeAgo(a.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ModerateButton id={a.id} type="answer" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
