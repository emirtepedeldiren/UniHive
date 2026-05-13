import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      badge: true,
      score: true,
      university: true,
      department: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
  return NextResponse.json(user);
}
