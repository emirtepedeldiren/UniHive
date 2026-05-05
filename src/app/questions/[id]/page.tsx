import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pollinate from "@/components/ui/Pollinate";
import AnswerForm from "./AnswerForm";
import BestAnswerButton from "./BestAnswerButton";
import { parseJsonArray, timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          badge: true,
          university: true,
          department: true,
          score: true,
        },
      },
      answers: {
        where: { status: "APPROVED" },
        orderBy: [{ isBest: "desc" }, { voteScore: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              badge: true,
              university: true,
              department: true,
            },
          },
        },
      },
      _count: { select: { answers: true } },
    },
  });

  if (!question || question.status !== "APPROVED") {
    notFound();
  }

  const tags = parseJsonArray(question.tags);
  const images = parseJsonArray(question.imageUrls);

  // Fetch user votes
  let userVotes: Record<string, number> = {};
  if (userId) {
    const allIds = [question.id, ...question.answers.map((a) => a.id)];
    const votes = await prisma.vote.findMany({
      where: { userId, targetId: { in: allIds } },
    });
    votes.forEach((v) => {
      userVotes[v.targetId] = v.value;
    });
  }

  const isQuestionOwner = userId === question.userId;
  const qHandle = (question.user.name || question.user.email?.split("@")[0] || "?");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-app-muted hover:text-app-text transition-colors mb-4">
          ← Bilgisayar Bilimleri Kovana Geri Dön
        </Link>

        {/* Question */}
        <article className="post-card mb-6 relative">
          {/* Top decorative tags area from mockup */}
          {tags.length > 0 && (
            <div className="absolute top-0 right-0 p-4 flex gap-2">
               {tags.map((tag) => (
                  <Link key={tag} href={`/?tag=${tag}`} className="bg-pink-light/50 text-pink-accent text-xs font-bold px-3 py-1 rounded-full hover:bg-pink-light transition-colors">
                    #{tag}
                  </Link>
                ))}
            </div>
          )}

          <div className="flex gap-4">
            {/* Vote */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <Pollinate
                targetId={question.id}
                targetType="question"
                initialScore={question.voteScore}
                userVote={userVotes[question.id] ?? 0}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-sm flex-shrink-0">
                  {qHandle.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link
                    href={`/profile/${question.user.id}`}
                    className="font-bold text-base text-app-text dark:text-dark-text hover:text-honey transition-colors block"
                  >
                    {question.user.name ?? "Anonim"}
                  </Link>
                  <p className="text-xs text-app-muted">
                    {question.user.department || "Bölüm Yok"} · {timeAgo(question.createdAt)}
                  </p>
                </div>
              </div>

              <h1 className="font-extrabold text-2xl text-app-text dark:text-dark-text mb-4 leading-snug pr-24">
                {question.isResolved && <span className="text-pollinate mr-2">✓</span>}
                {question.title}
              </h1>

              {question.body && (
                <div className="text-[15px] text-app-text dark:text-dark-text leading-relaxed whitespace-pre-wrap space-y-4 mb-6">
                  {question.body}
                </div>
              )}

              {images.length > 0 && (
                <div className="flex gap-3 flex-wrap mb-4">
                  {images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={url}
                        alt={`Görsel ${i + 1}`}
                        className="w-full max-w-sm rounded-lg border border-app-border dark:border-dark-border"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-app-border dark:border-dark-border">
                <button className="flex items-center gap-2 text-app-muted text-sm hover:text-app-text transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  {question._count.answers} Tekrarla
                </button>
                <div className="flex items-center gap-2 text-app-muted text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {question._count.answers} Yanıt
                </div>
                <button className="flex items-center gap-2 text-app-muted text-sm hover:text-app-text transition-colors ml-auto">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Paylaş
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Answer Form */}
        {session ? (
           <div className="compose-box mb-8 animate-fade-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                  {((session.user as any)?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <AnswerForm questionId={question.id} />
                </div>
              </div>
           </div>
        ) : (
          <div className="text-center py-6 mb-8 border border-dashed border-app-border rounded-xl">
            <p className="text-sm text-app-muted">
              Bu arıya yardım et! Bilgini paylaşmak için{" "}
              <Link href="/login" className="text-honey font-semibold">giriş yap</Link>.
            </p>
          </div>
        )}

        {/* Answers */}
        <h3 className="font-bold text-lg text-app-text dark:text-dark-text mb-4">
          Çözümler ({question._count.answers})
        </h3>
        
        <div className="space-y-4 mb-10">
          {question.answers.map((answer) => {
            const answerImages = parseJsonArray(answer.imageUrls);
            const aHandle = (answer.user.name || "?");
            return (
              <div key={answer.id} id={`answer-${answer.id}`} className="post-card">
                <div className="flex gap-4">
                  {/* Vote */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <Pollinate
                      targetId={answer.id}
                      targetType="answer"
                      initialScore={answer.voteScore}
                      userVote={userVotes[answer.id] ?? 0}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                          {aHandle.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <Link href={`/profile/${answer.user.id}`} className="font-bold text-sm text-app-text dark:text-dark-text hover:underline">
                                {answer.user.name ?? "Anonim"}
                             </Link>
                             {answer.user.badge === "TA" && (
                               <span className="bg-green-100 text-pollinate text-[10px] font-bold px-1.5 py-0.5 rounded">✓ TA</span>
                             )}
                          </div>
                          <p className="text-xs text-app-muted">{timeAgo(answer.createdAt)}</p>
                        </div>
                        {answer.isBest && (
                           <div className="ml-auto flex items-center gap-1 text-pollinate text-sm font-bold bg-green-50 px-2 py-1 rounded">
                              ✓ En İyi Cevap
                           </div>
                        )}
                     </div>

                     <div className="text-sm text-app-text dark:text-dark-text leading-relaxed whitespace-pre-wrap space-y-3 mb-4">
                        {answer.body}
                     </div>

                     {answerImages.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                          {answerImages.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt={`Görsel ${i + 1}`} className="w-32 h-32 object-cover rounded-lg border border-app-border" />
                            </a>
                          ))}
                        </div>
                     )}

                     {isQuestionOwner && !question.isResolved && session && (
                        <div className="mt-3">
                          <BestAnswerButton answerId={answer.id} questionId={question.id} isBest={answer.isBest} />
                        </div>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-72 flex-shrink-0 space-y-4">
        {/* Related topics */}
        <div className="sidebar-card">
           <h3 className="font-bold text-sm flex items-center gap-2 text-app-text dark:text-dark-text mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-honey">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              İlgili Konular
           </h3>
           <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full border border-app-border text-app-text dark:text-dark-text">Veri Yapıları</span>
              <span className="text-xs px-3 py-1.5 rounded-full border border-app-border text-app-text dark:text-dark-text">Sıralama Algoritmaları</span>
              <span className="text-xs px-3 py-1.5 rounded-full border border-app-border text-app-text dark:text-dark-text">Big O Gösterimi</span>
              <span className="text-xs px-3 py-1.5 rounded-full border border-app-border text-app-text dark:text-dark-text">CS201</span>
           </div>
        </div>

        {/* Top Contributors for this tag */}
        <div className="sidebar-card">
           <h3 className="font-bold text-sm flex items-center gap-2 text-app-text dark:text-dark-text mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-honey">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              En Çok Katkı Sağlayanlar
           </h3>
           <div className="space-y-3">
              {/* Dummy data to match mockup */}
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs">D</div>
                 <div>
                    <p className="font-bold text-sm text-app-text dark:text-dark-text">David Chen</p>
                    <p className="text-xs text-app-muted">240 Polen Puanı</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs">S</div>
                 <div>
                    <p className="font-bold text-sm text-app-text dark:text-dark-text">Sarah Jenkins</p>
                    <p className="text-xs text-app-muted">185 Polen Puanı</p>
                 </div>
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
}
