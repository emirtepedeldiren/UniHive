import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const count = await prisma.notification.count({ where: { userId, isRead: false } });
  return NextResponse.json({ count });
}
