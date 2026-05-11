import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages — list conversations for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { id: userId } } },
    orderBy: { updatedAt: "desc" },
    include: {
      participants: { select: { id: true, name: true, email: true, avatarUrl: true, badge: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderId: true, isRead: true },
      },
    },
  });

  const result = conversations.map((c) => ({
    id: c.id,
    updatedAt: c.updatedAt,
    other: c.participants.find((p) => p.id !== userId),
    lastMessage: c.messages[0] ?? null,
    unreadCount: c.messages.filter((m) => !m.isRead && m.senderId !== userId).length,
  }));

  return NextResponse.json(result);
}

// POST /api/messages — start or get conversation, then send first message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { recipientId, body } = await req.json() as { recipientId?: string; body?: string };
  if (!recipientId || !body?.trim()) {
    return NextResponse.json({ message: "Alıcı ve mesaj zorunludur." }, { status: 400 });
  }
  if (recipientId === userId) {
    return NextResponse.json({ message: "Kendinize mesaj gönderemezsiniz." }, { status: 400 });
  }

  // Find existing conversation between these two users
  let conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId } } },
        { participants: { some: { id: recipientId } } },
      ],
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: { connect: [{ id: userId }, { id: recipientId }] },
      },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: userId,
      body: body.trim(),
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  // Notify recipient
  const sender = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  const senderName = sender?.name || sender?.email?.split("@")[0] || "Biri";
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "message",
      refId: conversation.id,
      message: `${senderName} sana bir mesaj gönderdi.`,
    },
  });

  return NextResponse.json({ conversationId: conversation.id, message });
}
