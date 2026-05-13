import { prisma } from "@/lib/prisma";

export function getSenderDisplayName(user: { name?: string | null; email?: string | null } | null): string {
  return user?.name || user?.email?.split("@")[0] || "Biri";
}

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  refId?: string
): Promise<void> {
  await prisma.notification.create({
    data: { userId, type, message, ...(refId ? { refId } : {}) },
  });
}

export function buildModerationMessage(
  contentType: "question" | "answer",
  action: "approve" | "reject",
  reason?: string
): string {
  if (contentType === "question") {
    return action === "approve"
      ? `Sorunuz onaylandı ve feed'e çıktı! +${5} puan kazandınız 🍯`
      : `Sorunuz reddedildi.${reason ? ` Gerekçe: ${reason}` : ""}`;
  }
  return action === "approve"
    ? `Cevabınız onaylandı! +${10} puan kazandınız 🍯`
    : `Cevabınız reddedildi.${reason ? ` Gerekçe: ${reason}` : ""}`;
}

export function buildMessageNotification(senderName: string): string {
  return `${senderName} sana bir mesaj gönderdi.`;
}

export function buildBestAnswerMessage(): string {
  return `Cevabın 'En İyi Cevap' olarak seçildi! +${20} puan kazandın 🍯`;
}
