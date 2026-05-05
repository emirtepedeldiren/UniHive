import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBadgeForScore } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const { answerId, questionId } = await req.json();

  // Verify the user owns the question
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { userId: true, isResolved: true },
  });

  if (!question) {
    return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  }

  if (question.userId !== userId) {
    return NextResponse.json(
      { message: "Yalnızca soru sahibi en iyi cevabı seçebilir." },
      { status: 403 }
    );
  }

  if (question.isResolved) {
    return NextResponse.json(
      { message: "Bu soru zaten çözüldü olarak işaretlendi." },
      { status: 400 }
    );
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { userId: true, status: true },
  });

  if (!answer || answer.status !== "APPROVED") {
    return NextResponse.json(
      { message: "Cevap bulunamadı veya onaylı değil." },
      { status: 404 }
    );
  }

  // Mark answer as best and question as resolved
  await prisma.$transaction([
    prisma.answer.updateMany({
      where: { questionId },
      data: { isBest: false },
    }),
    prisma.answer.update({
      where: { id: answerId },
      data: { isBest: true },
    }),
    prisma.question.update({
      where: { id: questionId },
      data: { isResolved: true },
    }),
  ]);

  // Award +20 points to answer author
  const updatedUser = await prisma.user.update({
    where: { id: answer.userId },
    data: { score: { increment: 20 } },
  });

  const newBadge = getBadgeForScore(updatedUser.score);
  if (newBadge !== updatedUser.badge) {
    await prisma.user.update({
      where: { id: answer.userId },
      data: { badge: newBadge },
    });
  }

  // Notification
  await prisma.notification.create({
    data: {
      userId: answer.userId,
      type: "BEST_ANSWER",
      refId: questionId,
      message: "Cevabın 'En İyi Cevap' olarak seçildi! +20 puan kazandın 🍯",
    },
  });

  return NextResponse.json({ success: true });
}
