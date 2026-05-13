import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateScoreAndBadge } from "@/lib/services/gamification.service";
import { POINTS } from "@/lib/constants/points";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { targetId, targetType, value } = await req.json();
  const userId = session.user.id;

  if (!["question", "answer"].includes(targetType)) {
    return NextResponse.json({ message: "Geçersiz hedef türü." }, { status: 400 });
  }
  if (![1, -1, 0].includes(value)) {
    return NextResponse.json({ message: "Geçersiz oy değeri." }, { status: 400 });
  }

  let ownerId: string | null = null;
  if (targetType === "question") {
    const q = await prisma.question.findUnique({ where: { id: targetId }, select: { userId: true } });
    ownerId = q?.userId ?? null;
  } else {
    const a = await prisma.answer.findUnique({ where: { id: targetId }, select: { userId: true } });
    ownerId = a?.userId ?? null;
  }

  if (ownerId === userId) {
    return NextResponse.json({ message: "Kendi içeriğinize oy veremezsiniz." }, { status: 403 });
  }

  const existingVote = await prisma.vote.findUnique({
    where: { userId_targetId: { userId, targetId } },
  });

  const oldValue = existingVote?.value ?? 0;
  const scoreDiff = value - oldValue;

  if (value === 0) {
    if (existingVote) {
      await prisma.vote.delete({ where: { userId_targetId: { userId, targetId } } });
    }
  } else {
    const voteData =
      targetType === "question"
        ? { userId, targetType, targetId, value, questionId: targetId }
        : { userId, targetType, targetId, value, answerId: targetId };

    await prisma.vote.upsert({
      where: { userId_targetId: { userId, targetId } },
      create: voteData,
      update: { value },
    });
  }

  if (scoreDiff !== 0) {
    if (targetType === "question") {
      await prisma.question.update({ where: { id: targetId }, data: { voteScore: { increment: scoreDiff } } });
    } else {
      await prisma.answer.update({ where: { id: targetId }, data: { voteScore: { increment: scoreDiff } } });
    }

    if (ownerId) {
      const pointDelta = scoreDiff > 0 ? POINTS.UPVOTE_RECEIVED : POINTS.DOWNVOTE_RECEIVED;
      await updateScoreAndBadge(ownerId, pointDelta);
    }
  }

  return NextResponse.json({ success: true });
}
