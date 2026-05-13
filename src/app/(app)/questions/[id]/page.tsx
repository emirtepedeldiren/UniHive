import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pollinate from "@/components/ui/Pollinate";
import AnswerForm from "./AnswerForm";
import BestAnswerButton from "./BestAnswerButton";
import ShareButton from "@/components/ui/ShareButton";
import QuestionActions from "./QuestionActions";
import AnswerActions from "./AnswerActions";
import { timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  const tags = Array.isArray(question.tags) ? question.tags : [];
  const images = question.imageUrls;

  // Fetch user votes
  const userVotes: Record<string, number> = {};
  if (userId) {
    const allIds = [question.id, ...question.answers.map((a) => a.id)];
    const votes = await prisma.vote.findMany({
      where: { userId, targetId: { in: allIds } },
    });
    votes.forEach((v) => {
      userVotes[v.targetId] = v.value;
    });
  }

  // Fetch related questions by shared tags
  const relatedQuestions =
    tags.length > 0
      ? await prisma.question.findMany({
          where: {
            status: "APPROVED",
            id: { not: question.id },
            tags: { hasSome: tags },
          },
          select: { id: true, title: true, tags: true },
          orderBy: { voteScore: "desc" },
          take: 5,
        })
      : [];

  // Fetch top contributors for this question's tags
  const topContributors =
    tags.length > 0
      ? await prisma.user.findMany({
          where: {
            answers: {
              some: {
                status: "APPROVED",
                question: { tags: { hasSome: tags } },
              },
            },
          },
          select: { id: true, name: true, email: true, score: true, badge: true },
          orderBy: { score: "desc" },
          take: 3,
        })
      : [];

  const isQuestionOwner = userId === question.userId;
  const qHandle = question.user.name || "?";

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
                      <Image
                        src={url}
                        alt={`Görsel ${i + 1}`}
                        width={384}
                        height={256}
                        className="w-full max-w-sm rounded-lg border border-app-border dark:border-dark-border object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-app-border dark:border-dark-border">
                <div className="flex items-center gap-2 text-app-muted text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {question._count.answers} Yanıt
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <ShareButton path={`/questions/${question.id}`} title={question.title} />
                </div>
              </div>
              {isQuestionOwner && (
                <QuestionActions
                  questionId={question.id}
                  initialTitle={question.title}
                  initialBody={question.body ?? null}
                />
              )}
            </div>
          </div>
        </article>

        {/* Answer Form */}
        {session ? (
           <div className="compose-box mb-8 animate-fade-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                  {(session.user?.name || "?").charAt(0).toUpperCase()}
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
            const answerImages = answer.imageUrls;
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
                              <Image src={url} alt={`Görsel ${i + 1}`} width={128} height={128} className="object-cover rounded-lg border border-app-border" />
                            </a>
                          ))}
                        </div>
                     )}

                     <div className="flex items-center gap-4 mt-3">
                       {isQuestionOwner && !question.isResolved && session && (
                         <BestAnswerButton answerId={answer.id} questionId={question.id} isBest={answer.isBest} />
                       )}
                       {userId === answer.user.id && (
                         <AnswerActions answerId={answer.id} initialBody={answer.body} />
                       )}
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-72 flex-shrink-0 space-y-4">
        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <div className="sidebar-card">
            <h3 className="font-bold text-sm flex items-center gap-2 text-app-text dark:text-dark-text mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-honey">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              İlgili Sorular
            </h3>
            <div className="space-y-2">
              {relatedQuestions.map((rq) => (
                <Link
                  key={rq.id}
                  href={`/questions/${rq.id}`}
                  className="block text-xs text-app-text dark:text-dark-text hover:text-honey transition-colors line-clamp-2"
                >
                  {rq.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Contributors for this question's tags */}
        {topContributors.length > 0 && (
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
              {topContributors.map((u) => {
                const handle = u.name || u.email?.split("@")[0] || "?";
                return (
                  <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full hex-clip bg-honey flex items-center justify-center font-bold text-hive-black text-xs flex-shrink-0">
                      {handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-app-text dark:text-dark-text">{handle}</p>
                      <p className="text-xs text-app-muted">{u.score} Polen Puanı</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
