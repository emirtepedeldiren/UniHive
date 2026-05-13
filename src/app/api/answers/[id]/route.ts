import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  const answer = await prisma.answer.findUnique({ where: { id }, select: { userId: true } });
  if (!answer) return NextResponse.json({ message: "Cevap bulunamadı." }, { status: 404 });
  if (answer.userId !== userId) return NextResponse.json({ message: "Yetkisiz." }, { status: 403 });

  const { body, imageUrls } = await req.json();

  const updated = await prisma.answer.update({
    where: { id },
    data: {
      ...(body !== undefined && { body: body.trim() }),
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

  const answer = await prisma.answer.findUnique({ where: { id }, select: { userId: true } });
  if (!answer) return NextResponse.json({ message: "Cevap bulunamadı." }, { status: 404 });
  if (answer.userId !== userId && !isAdmin) {
    return NextResponse.json({ message: "Yetkisiz." }, { status: 403 });
  }

  await prisma.answer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
