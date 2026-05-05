"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface PollinateProps {
  targetId: string;
  targetType: "question" | "answer";
  initialScore: number;
  userVote: number; // -1, 0, 1
}

export default function Pollinate({
  targetId,
  targetType,
  initialScore,
  userVote: initialVote,
}: PollinateProps) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(initialVote);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleVote(value: 1 | -1) {
    const newVote = vote === value ? 0 : value;

    // Optimistic update
    const diff = newVote - vote;
    setScore((s) => s + diff);
    setVote(newVote);

    startTransition(async () => {
      try {
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId, targetType, value: newVote }),
        });
        if (!res.ok) {
          // Revert on error
          setScore(initialScore);
          setVote(initialVote);
        } else {
          router.refresh();
        }
      } catch {
        setScore(initialScore);
        setVote(initialVote);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {/* Pollinate (upvote) */}
      <button
        id={`pollinate-up-${targetId}`}
        onClick={() => handleVote(1)}
        disabled={isPending}
        title="Pollinate (Upvote)"
        className={`vote-btn ${vote === 1 ? "active-up" : ""}`}
        aria-label="Pollinate"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Score */}
      <span
        className={`text-xs font-bold min-w-[1.5rem] text-center ${
          score > 0
            ? "text-pollen-green"
            : score < 0
            ? "text-sting-red"
            : "text-on-surface-variant"
        }`}
      >
        {score}
      </span>

      {/* Sting (downvote) */}
      <button
        id={`pollinate-down-${targetId}`}
        onClick={() => handleVote(-1)}
        disabled={isPending}
        title="Sting (Downvote)"
        className={`vote-btn ${vote === -1 ? "active-down" : ""}`}
        aria-label="Sting"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
