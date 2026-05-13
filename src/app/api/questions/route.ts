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
  const { title, body, tags, imageUrls, skipApproval } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json({ message: "Başlık zorunludur." }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      userId,
      title: title.trim(),
      body: body?.trim() || null,
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
      imageUrls: Array.isArray(imageUrls) ? imageUrls.slice(0, 3) : [],
      status: skipApproval ? "APPROVED" : "PENDING",
    },
  });

  return NextResponse.json({ id: question.id }, { status: 201 });
}
