import React from "react";
import Image from "next/image";

interface HexAvatarProps {
  name?: string | null;
  badge?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: "w-8 h-8", text: "text-xs" },
  md: { outer: "w-10 h-10", text: "text-sm" },
  lg: { outer: "w-14 h-14", text: "text-base" },
};

export default function HexAvatar({
  name,
  badge = "Drone",
  avatarUrl,
  size = "md",
  className = "",
}: HexAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const { outer, text } = SIZE_MAP[size];

  return (
    <div className={`relative flex-shrink-0 ${outer} ${className}`}>
      <div
        className={`hex-clip w-full h-full flex items-center justify-center font-bold ${text} bg-honey text-hive-black overflow-hidden`}
        title={`${name ?? "User"} — ${badge}`}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name ?? "avatar"} width={56} height={56} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
    </div>
  );
}
