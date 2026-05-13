import { prisma } from "@/lib/prisma";
import { getBadgeForScore } from "@/lib/utils";

export async function updateScoreAndBadge(userId: string, delta: number): Promise<void> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { score: { increment: delta } },
    select: { score: true, badge: true },
  });

  const effectiveScore = Math.max(0, updated.score);
  const newBadge = getBadgeForScore(effectiveScore);
  if (newBadge !== updated.badge) {
    await prisma.user.update({
      where: { id: userId },
      data: { badge: newBadge },
    });
  }
}
