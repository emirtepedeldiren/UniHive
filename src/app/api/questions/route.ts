import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const { title, body, tags, imageUrls } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json({ message: "Başlık zorunludur." }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      userId,
      title: title.trim(),
      body: body?.trim() || null,
      tags: JSON.stringify(Array.isArray(tags) ? tags.slice(0, 5) : []),
      imageUrls: JSON.stringify(Array.isArray(imageUrls) ? imageUrls.slice(0, 3) : []),
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: question.id }, { status: 201 });
}
