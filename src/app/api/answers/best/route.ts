import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateScoreAndBadge } from "@/lib/services/gamification.service";
import { createNotification, buildBestAnswerMessage } from "@/lib/services/notification.service";
import { POINTS } from "@/lib/constants/points";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = session.user.id;
  const { answerId, questionId } = await req.json();

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { userId: true, isResolved: true },
  });

  if (!question) {
    return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  }
  if (question.userId !== userId) {
    return NextResponse.json({ message: "Yalnızca soru sahibi en iyi cevabı seçebilir." }, { status: 403 });
  }
  if (question.isResolved) {
    return NextResponse.json({ message: "Bu soru zaten çözüldü olarak işaretlendi." }, { status: 400 });
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { userId: true, status: true },
  });

  if (!answer || answer.status !== "APPROVED") {
    return NextResponse.json({ message: "Cevap bulunamadı veya onaylı değil." }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.answer.updateMany({ where: { questionId }, data: { isBest: false } }),
    prisma.answer.update({ where: { id: answerId }, data: { isBest: true } }),
    prisma.question.update({ where: { id: questionId }, data: { isResolved: true } }),
  ]);

  await updateScoreAndBadge(answer.userId, POINTS.BEST_ANSWER);
  await createNotification(answer.userId, "BEST_ANSWER", buildBestAnswerMessage(), questionId);

  return NextResponse.json({ success: true });
}
