import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = session.user.id;
  const { questionId, body, imageUrls } = await req.json();

  if (!questionId || !body?.trim()) {
    return NextResponse.json(
      { message: "Soru ID ve cevap metni zorunludur." },
      { status: 400 }
    );
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { status: true },
  });

  if (!question || question.status !== "APPROVED") {
    return NextResponse.json(
      { message: "Soru bulunamadı veya onaylı değil." },
      { status: 404 }
    );
  }

  const answer = await prisma.answer.create({
    data: {
      questionId,
      userId,
      body: body.trim(),
      imageUrls: Array.isArray(imageUrls) ? imageUrls.slice(0, 3) : [],
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: answer.id }, { status: 201 });
}
