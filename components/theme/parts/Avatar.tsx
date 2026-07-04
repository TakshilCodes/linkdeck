"use client";

import Image from "next/image";
import { useState } from "react";

type AvatarProps = {
  profileImgUrl?: string | null;
  displayName: string;
  /** Dashboard phone preview - smaller, closer to real device proportions */
  compact?: boolean;
};

export default function Avatar({
  profileImgUrl,
  displayName,
  compact = false,
}: AvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const imageUrl = profileImgUrl?.trim() || null;

  const shell =
    "relative flex items-center justify-center overflow-hidden rounded-full bg-white/90 shadow-md " +
    (compact ? "mb-2.5 h-[72px] w-[72px]" : "mb-4 h-23 w-23");

  if (imageUrl && failedImageUrl !== imageUrl) {
    return (
      <div className={shell}>
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          sizes={compact ? "72px" : "92px"}
          referrerPolicy="no-referrer"
          onError={() => setFailedImageUrl(imageUrl)}
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className={shell}>
      <span
        className={`font-medium text-slate-800 ${compact ? "text-[15px]" : "text-[24px]"}`}
      >
        {initials}
      </span>
    </div>
  );
}
