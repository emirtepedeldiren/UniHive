import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateScoreAndBadge } from "@/lib/services/gamification.service";
import { createNotification, buildModerationMessage } from "@/lib/services/notification.service";
import { POINTS } from "@/lib/constants/points";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 403 });
  }

  const { id, type, action, reason } = await req.json();

  if (!["question", "answer"].includes(type)) {
    return NextResponse.json({ message: "Geçersiz tür." }, { status: 400 });
  }
  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ message: "Geçersiz işlem." }, { status: 400 });
  }

  const status = action === "approve" ? "APPROVED" : "REJECTED";
  let ownerId: string | null = null;
  let refId: string = id;

  if (type === "question") {
    const q = await prisma.question.update({
      where: { id },
      data: { status, rejectReason: reason ?? null },
      select: { userId: true },
    });
    ownerId = q.userId;
  } else {
    const a = await prisma.answer.update({
      where: { id },
      data: { status, rejectReason: reason ?? null },
      select: { userId: true, questionId: true },
    });
    ownerId = a.userId;
    refId = a.questionId;
  }

  if (ownerId) {
    const notifType =
      action === "approve"
        ? type === "question" ? "QUESTION_APPROVED" : "ANSWER_APPROVED"
        : type === "question" ? "QUESTION_REJECTED" : "ANSWER_REJECTED";

    await createNotification(
      ownerId,
      notifType,
      buildModerationMessage(type as "question" | "answer", action as "approve" | "reject", reason),
      refId
    );

    const delta =
      action === "approve"
        ? type === "question" ? POINTS.QUESTION_APPROVED : POINTS.ANSWER_APPROVED
        : POINTS.CONTENT_REJECTED;

    await updateScoreAndBadge(ownerId, delta);
  }

  return NextResponse.json({ success: true });
}
