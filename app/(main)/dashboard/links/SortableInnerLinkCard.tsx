"use client";

import { useEffect, useState, useTransition } from "react";
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Link2, Pencil, Share, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateLinkAction } from "@/actions/dashboard/links";
import type { LinkItem } from "@/types/board-types";

type Props = {
  sortableId: string;
  link: LinkItem;
};

function isDraggingRootBoardLink(activeId: string | number | null | undefined): boolean {
  if (activeId == null) return false;
  return String(activeId).startsWith("link-");
}

export default function SortableInnerLinkCard({ sortableId, link }: Props) {
  const { active } = useDndContext();
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: sortableId });

  const showRootLinkDropHighlight =
    isDraggingRootBoardLink(active?.id) && isOver && !isDragging;

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  const [name, setName] = useState(link.name);
  const [url, setUrl] = useState(link.url);
  const [editingName, setEditingName] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    setName(link.name);
    setUrl(link.url);
  }, [link.name, link.url]);

  const save = () => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      setName(link.name);
      setUrl(link.url);
      setEditingName(false);
      setEditingUrl(false);
      return;
    }

    startTransition(async () => {
      const res = await updateLinkAction({
        id: link.id,
        name: trimmedName,
        url: trimmedUrl,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to update link");
        return;
      }

      toast.success("Link updated");
      setEditingName(false);
      setEditingUrl(false);
      router.refresh();
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-[22px] border px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-all duration-200 ${
        showRootLinkDropHighlight
          ? "border-cyan-400/45 bg-cyan-400/[0.08] ring-2 ring-cyan-400/25 ring-offset-2 ring-offset-[#151d2e]"
          : "border-white/8 bg-[#0f1726]"
      } ${isDragging ? "opacity-0" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab rounded-full p-1 text-white/30 transition hover:bg-white/5 hover:text-white/55 active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            {editingName ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={save}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                }}
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base font-semibold text-white outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="flex max-w-full items-center gap-2 text-left"
              >
                <span className="truncate text-[1rem] font-semibold text-white">
                  {name}
                </span>
                <Pencil className="h-4 w-4 shrink-0 text-white/30" />
              </button>
            )}

            <div className="mt-1">
              {editingUrl ? (
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={save}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save();
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingUrl(true)}
                  className="flex max-w-full items-center gap-2 text-left text-sm text-white/55 transition hover:text-white/75"
                >
                  <Link2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{url}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={link.isVisible}
            readOnly
            className="peer sr-only"
          />
          <div className="h-7 w-12 rounded-full bg-white/12 transition peer-checked:bg-emerald-500/90" />
          <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:left-6" />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/6 pt-2.5 text-sm">
        <button
          type="button"
          className="flex items-center gap-2 text-white/55 transition hover:text-white"
        >
          <Share className="h-4 w-4" />
          Share
        </button>

        <span className="text-white/55">{link.clickCount} clicks</span>

        <button
          type="button"
          className="flex items-center gap-2 text-red-300/75 transition hover:text-red-200"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}