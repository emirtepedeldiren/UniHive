import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      user: { select: { id: true, name: true, badge: true, university: true, department: true } },
      _count: { select: { answers: true } },
    },
  });

  if (!question) return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  return NextResponse.json(question);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  const question = await prisma.question.findUnique({ where: { id }, select: { userId: true } });
  if (!question) return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  if (question.userId !== userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 403 });

  const { title, body, tags, imageUrls } = await req.json();

  const updated = await prisma.question.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(body !== undefined && { body: body?.trim() || null }),
      ...(tags !== undefined && { tags: (tags as string[]).slice(0, 5) }),
      ...(imageUrls !== undefined && { imageUrls: (imageUrls as string[]).slice(0, 3) }),
      status: "PENDING",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const question = await prisma.question.findUnique({ where: { id }, select: { userId: true } });
  if (!question) return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  if (question.userId !== userId && !isAdmin) {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 403 });
  }

  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
