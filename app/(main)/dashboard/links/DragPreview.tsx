"use client";

import { FolderClosed, GripVertical, Link2 } from "lucide-react";
import type { CollectionItem, LinkItem } from "@/types/board-types";

export function LinkCardPreview({
  link,
  variant = "root",
}: {
  link: LinkItem;
  variant?: "root" | "inner";
}) {
  const isInner = variant === "inner";
  return (
    <div
      className={
        isInner
          ? "rounded-[22px] border border-white/8 bg-[#0f1726] px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
          : "rounded-[26px] border border-white/8 bg-[#111827] px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="mt-1 rounded-full p-1 text-white/40">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[1.05rem] font-semibold text-white">
              {link.name}
            </p>
            <div className="mt-1 flex max-w-full items-center gap-2 text-sm text-white/55">
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{link.url}</span>
            </div>
          </div>
        </div>

        <div className="relative inline-flex items-center">
          <div className="h-7 w-12 rounded-full bg-emerald-500/90" />
          <span className="absolute left-6 top-1 h-5 w-5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

export function CollectionCardPreview({
  collection,
}: {
  collection: CollectionItem;
}) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[#151d2e] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="rounded-full p-1 text-white/40">
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/12 bg-cyan-400/8 text-cyan-300">
          <FolderClosed className="h-5 w-5" />
        </div>

        <div>
          <p className="text-[1.05rem] font-semibold text-white">
            {collection.name}
          </p>
          <p className="text-sm text-white/45">
            {collection.links.length}{" "}
            {collection.links.length === 1 ? "link" : "links"}
          </p>
        </div>
      </div>
    </div>
  );
}