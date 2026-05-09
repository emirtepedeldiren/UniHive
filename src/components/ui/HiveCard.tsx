import React from "react";
import Link from "next/link";
import Image from "next/image";
import HexAvatar from "./HexAvatar";
import CommunityChip from "./CommunityChip";
import Pollinate from "./Pollinate";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";
import { timeAgo } from "@/lib/utils";

interface HiveCardProps {
  question: {
    id: string;
    title: string;
    body?: string | null;
    tags: string[];
    imageUrls: string[];
    voteScore: number;
    isResolved: boolean;
    createdAt: Date | string;
    status: string;
    _count?: { answers: number };
    user: {
      id: string;
      name?: string | null;
      badge: string;
      university: string;
      department?: string | null;
    };
  };
  userVote?: number;
  userBookmarked?: boolean;
  showStatus?: boolean;
  showBookmark?: boolean;
}

export default function HiveCard({
  question,
  userVote = 0,
  userBookmarked = false,
  showStatus = false,
  showBookmark = false,
}: HiveCardProps) {
  const tags = question.tags;
  const images = question.imageUrls;

  return (
    <article
      id={`question-${question.id}`}
      className="hive-card flex gap-4 animate-fade-in"
    >
      {/* Pollinate column */}
      <div className="flex-shrink-0">
        <Pollinate
          targetId={question.id}
          targetType="question"
          initialScore={question.voteScore}
          userVote={userVote}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <HexAvatar
            name={question.user.name}
            badge={question.user.badge}
            size="sm"
          />
          <div>
            <Link
              href={`/profile/${question.user.id}`}
              className="text-sm font-semibold text-hive-black hover:text-primary transition-colors"
            >
              {question.user.name ?? "Anonim"}
            </Link>
            <p className="label-caps text-on-surface-variant">
              {question.user.university}
              {question.user.department ? ` · ${question.user.department}` : ""}
            </p>
          </div>
          <span className="ml-auto label-caps text-on-surface-variant">
            {timeAgo(question.createdAt)}
          </span>
          {showStatus && (
            <span
              className={
                question.status === "PENDING"
                  ? "status-pending"
                  : question.status === "APPROVED"
                  ? "status-approved"
                  : "status-rejected"
              }
            >
              {question.status}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/questions/${question.id}`} className="group">
          <h2 className="title-sm text-hive-black group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {question.isResolved && (
              <span className="inline-flex items-center gap-1 text-pollinate text-xs font-bold mr-2 align-middle">
                ✓ Çözüldü
              </span>
            )}
            {question.title}
          </h2>
        </Link>

        {/* Body preview */}
        {question.body && (
          <p className="body-sm text-on-surface-variant mb-3 line-clamp-2">
            {question.body}
          </p>
        )}

        {/* Images preview */}
        {images.length > 0 && (
          <div className="flex gap-2 mb-3">
            {images.slice(0, 3).map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`Görsel ${i + 1}`}
                width={80}
                height={80}
                className="object-cover rounded-md border border-outline-variant"
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 flex-wrap">
          {tags.map((tag) => (
            <CommunityChip key={tag} tag={tag} />
          ))}
          <div className="ml-auto flex items-center gap-3">
            <span className="label-caps text-on-surface-variant flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {question._count?.answers ?? 0} cevap
            </span>
            <ShareButton path={`/questions/${question.id}`} title={question.title} />
            {showBookmark && (
              <BookmarkButton questionId={question.id} initialBookmarked={userBookmarked} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
