"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface BestAnswerButtonProps {
  answerId: string;
  questionId: string;
  isBest: boolean;
}

export default function BestAnswerButton({
  answerId,
  questionId,
  isBest,
}: BestAnswerButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await fetch("/api/answers/best", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId, questionId }),
      });
      router.refresh();
    });
  }

  if (isBest) {
    return (
      <span className="text-pollen-green text-xs font-bold flex items-center gap-1">
        ✓ En iyi cevap olarak işaretlendi
      </span>
    );
  }

  return (
    <button
      id={`best-answer-${answerId}`}
      onClick={handleClick}
      disabled={isPending}
      className="text-xs font-semibold text-pollen-green border border-pollen-green/40 rounded-full px-3 py-1 hover:bg-green-50 transition-colors disabled:opacity-50"
    >
      ✓ En İyi Cevap Seç
    </button>
  );
}
