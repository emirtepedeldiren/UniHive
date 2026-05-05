import React from "react";

interface CommunityChipProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}

export default function CommunityChip({
  tag,
  onClick,
  active = false,
}: CommunityChipProps) {
  return (
    <button
      onClick={onClick}
      className={`community-chip transition-all duration-150 ${
        active
          ? "ring-2 ring-tertiary/40 bg-tertiary/20"
          : "hover:scale-105"
      }`}
    >
      #{tag}
    </button>
  );
}
