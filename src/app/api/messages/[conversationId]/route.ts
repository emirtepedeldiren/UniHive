import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages/[conversationId] — fetch message history
export async function GET(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { conversationId } = await params;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: userId } },
    },
    include: {
      participants: { select: { id: true, name: true, email: true, avatarUrl: true, badge: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      },
    },
  });

  if (!conversation) return NextResponse.json({ message: "Konuşma bulunamadı." }, { status: 404 });

  // Mark incoming messages as read
  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json(conversation);
}

// POST /api/messages/[conversationId] — send a message
export async function POST(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { conversationId } = await params;

  const { body } = await req.json() as { body?: string };
  if (!body?.trim()) return NextResponse.json({ message: "Mesaj boş olamaz." }, { status: 400 });

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, participants: { some: { id: userId } } },
    include: { participants: { select: { id: true } } },
  });

  if (!conversation) return NextResponse.json({ message: "Konuşma bulunamadı." }, { status: 404 });

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, body: body.trim() },
    include: { sender: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Notify the other participant
  const recipientId = conversation.participants.find((p) => p.id !== userId)?.id;
  if (recipientId) {
    const sender = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    const senderName = sender?.name || sender?.email?.split("@")[0] || "Biri";
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: "message",
        refId: conversationId,
        message: `${senderName} sana bir mesaj gönderdi.`,
      },
    });
  }

  return NextResponse.json(message);
}
