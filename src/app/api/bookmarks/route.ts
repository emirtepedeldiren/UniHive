import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      question: {
        include: {
          user: { select: { id: true, name: true, badge: true, university: true, department: true } },
          _count: { select: { answers: true } },
        },
      },
    },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const { questionId } = body;
  if (!questionId) {
    return NextResponse.json({ message: "questionId gerekli." }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_questionId: { userId, questionId } },
    update: {},
    create: { userId, questionId },
  });

  return NextResponse.json(bookmark, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get("questionId");
  if (!questionId) {
    return NextResponse.json({ message: "questionId gerekli." }, { status: 400 });
  }

  await prisma.bookmark.deleteMany({ where: { userId, questionId } });

  return NextResponse.json({ success: true });
}
