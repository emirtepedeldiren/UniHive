"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface ModerateButtonProps {
  id: string;
  type: "question" | "answer";
}

export default function ModerateButton({ id, type }: ModerateButtonProps) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function moderate(action: "approve" | "reject") {
    startTransition(async () => {
      await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          type,
          action,
          reason: action === "reject" ? reason : undefined,
        }),
      });
      setShowReject(false);
      setReason("");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2 items-end flex-shrink-0">
      <div className="flex gap-2">
        <Button
          id={`approve-${type}-${id}`}
          variant="primary"
          size="sm"
          onClick={() => moderate("approve")}
          disabled={isPending}
          className="bg-pollen-green hover:bg-green-800"
        >
          ✓ Onayla
        </Button>
        <Button
          id={`reject-${type}-${id}`}
          variant="secondary"
          size="sm"
          onClick={() => setShowReject(!showReject)}
          disabled={isPending}
          className="border-sting-red text-sting-red hover:bg-red-50"
        >
          ✕ Reddet
        </Button>
      </div>

      {showReject && (
        <div className="w-72 animate-fade-in">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Red gerekçesi (isteğe bağlı)"
            className="input-enclosed text-sm mb-2"
          />
          <Button
            id={`confirm-reject-${id}`}
            variant="primary"
            size="sm"
            onClick={() => moderate("reject")}
            disabled={isPending}
            className="bg-sting-red w-full justify-center"
          >
            Red Onayla
          </Button>
        </div>
      )}
    </div>
  );
}
