import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBadgeForScore } from "@/lib/utils";

// Point rules (PRD Section 3)
const POINTS = {
  question_approved: 5,
  answer_approved: 10,
  content_rejected: -5,
};

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

  if (type === "question") {
    const q = await prisma.question.update({
      where: { id },
      data: { status, rejectReason: reason ?? null },
      select: { userId: true, title: true },
    });
    ownerId = q.userId;

    // Notification
    await prisma.notification.create({
      data: {
        userId: q.userId,
        type: action === "approve" ? "QUESTION_APPROVED" : "QUESTION_REJECTED",
        refId: id,
        message:
          action === "approve"
            ? `Sorunuz onaylandı ve feed'e çıktı! +5 puan kazandınız 🍯`
            : `Sorunuz reddedildi. ${reason ? `Gerekçe: ${reason}` : ""}`,
      },
    });
  } else {
    const a = await prisma.answer.update({
      where: { id },
      data: { status, rejectReason: reason ?? null },
      select: { userId: true, questionId: true },
    });
    ownerId = a.userId;

    await prisma.notification.create({
      data: {
        userId: a.userId,
        type: action === "approve" ? "ANSWER_APPROVED" : "ANSWER_REJECTED",
        refId: a.questionId,
        message:
          action === "approve"
            ? `Cevabınız onaylandı! +10 puan kazandınız 🍯`
            : `Cevabınız reddedildi. ${reason ? `Gerekçe: ${reason}` : ""}`,
      },
    });
  }

  // Award / deduct points
  if (ownerId) {
    const pointKey = action === "approve"
      ? type === "question" ? "question_approved" : "answer_approved"
      : "content_rejected";

    const delta = POINTS[pointKey as keyof typeof POINTS];

    const updatedUser = await prisma.user.update({
      where: { id: ownerId },
      data: { score: { increment: delta } },
    });

    const newBadge = getBadgeForScore(Math.max(0, updatedUser.score));
    if (newBadge !== updatedUser.badge) {
      await prisma.user.update({
        where: { id: ownerId },
        data: { badge: newBadge },
      });
    }
  }

  return NextResponse.json({ success: true });
}
