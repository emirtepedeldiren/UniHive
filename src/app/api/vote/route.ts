import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBadgeForScore } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { message: "Giriş yapmalısınız." },
      { status: 401 }
    );
  }

  const { targetId, targetType, value } = await req.json();
  const userId = (session.user as any).id as string;

  if (!["question", "answer"].includes(targetType)) {
    return NextResponse.json(
      { message: "Geçersiz hedef türü." },
      { status: 400 }
    );
  }
  if (![1, -1, 0].includes(value)) {
    return NextResponse.json(
      { message: "Geçersiz oy değeri." },
      { status: 400 }
    );
  }

  // Get owner to prevent self-voting and for score update
  let ownerId: string | null = null;
  if (targetType === "question") {
    const q = await prisma.question.findUnique({
      where: { id: targetId },
      select: { userId: true },
    });
    ownerId = q?.userId ?? null;
  } else {
    const a = await prisma.answer.findUnique({
      where: { id: targetId },
      select: { userId: true },
    });
    ownerId = a?.userId ?? null;
  }

  if (ownerId === userId) {
    return NextResponse.json(
      { message: "Kendi içeriğinize oy veremezsiniz." },
      { status: 403 }
    );
  }

  // Get existing vote
  const existingVote = await prisma.vote.findUnique({
    where: { userId_targetId: { userId, targetId } },
  });

  const oldValue = existingVote?.value ?? 0;
  const scoreDiff = value - oldValue;

  // Upsert or delete vote
  if (value === 0) {
    if (existingVote) {
      await prisma.vote.delete({
        where: { userId_targetId: { userId, targetId } },
      });
    }
  } else {
    if (targetType === "question") {
      await prisma.vote.upsert({
        where: { userId_targetId: { userId, targetId } },
        create: {
          userId,
          targetType,
          targetId,
          value,
          questionId: targetId,
        },
        update: { value },
      });
    } else {
      await prisma.vote.upsert({
        where: { userId_targetId: { userId, targetId } },
        create: {
          userId,
          targetType,
          targetId,
          value,
          answerId: targetId,
        },
        update: { value },
      });
    }
  }

  // Update voteScore on target
  if (scoreDiff !== 0) {
    if (targetType === "question") {
      await prisma.question.update({
        where: { id: targetId },
        data: { voteScore: { increment: scoreDiff } },
      });
    } else {
      await prisma.answer.update({
        where: { id: targetId },
        data: { voteScore: { increment: scoreDiff } },
      });
    }

    // Update owner's score: upvote = +2, downvote = -1 (PRD)
    if (ownerId) {
      const pointDelta = scoreDiff > 0 ? 2 : -1;
      const updatedOwner = await prisma.user.update({
        where: { id: ownerId },
        data: { score: { increment: pointDelta } },
      });
      const newBadge = getBadgeForScore(Math.max(0, updatedOwner.score));
      if (newBadge !== updatedOwner.badge) {
        await prisma.user.update({
          where: { id: ownerId },
          data: { badge: newBadge },
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
