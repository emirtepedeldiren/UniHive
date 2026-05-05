/**
 * Badge thresholds matching PRD gamification system
 */
export const BADGE_THRESHOLDS = [
  { min: 0, badge: "Drone" },
  { min: 50, badge: "Worker Bee" },
  { min: 200, badge: "Scout Bee" },
  { min: 500, badge: "Queen Bee" },
] as const;

export function getBadgeForScore(score: number): string {
  const sorted = [...BADGE_THRESHOLDS].sort((a, b) => b.min - a.min);
  return sorted.find((t) => score >= t.min)?.badge ?? "Drone";
}

export const BADGE_EMOJI: Record<string, string> = {
  Drone: "🤖",
  "Worker Bee": "🐝",
  "Scout Bee": "🔍",
  "Queen Bee": "👑",
};

/**
 * Parse JSON arrays stored as strings in SQLite
 */
export function parseJsonArray(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifyJsonArray(arr: string[]): string {
  return JSON.stringify(arr);
}

/**
 * .edu email validation
 */
export function isEduEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.edu(\.[a-zA-Z]{2,})?$/.test(
    email
  );
}

/**
 * Format relative time
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "az önce";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return d.toLocaleDateString("tr-TR");
}
