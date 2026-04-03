"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FolderClosed, GripVertical, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateCollectionAction } from "@/actions/dashboard/links";
import type { CollectionItem } from "@/types/board-types";
import SortableInnerLinkCard from "./SortableInnerLinkCard";
import AddItemModal from "./AddItemModal";

type Props = {
  sortableId: string;
  collection: CollectionItem;
};

export default function SortableCollectionCard({
  sortableId,
  collection,
}: Props) {
  const { active } = useDndContext();
  const draggingRootBoardLink =
    active?.id != null && String(active.id).startsWith("link-");

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

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  const [name, setName] = useState(collection.name);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const [, startTransition] = useTransition();

  const gapBeforeId = `collection-gap-before-${collection.id}`;
  const beforeZoneId = `collection-zone-before-${collection.id}`;
  const insideZoneId = `collection-zone-inside-${collection.id}`;
  const bodyDropId = `collection-body-drop-${collection.id}`;

  const { setNodeRef: setGapBeforeRef, isOver: isOverGapBefore } = useDroppable({
    id: gapBeforeId,
  });
  const { setNodeRef: setBeforeZoneRef, isOver: isOverBefore } = useDroppable({
    id: beforeZoneId,
  });
  const { setNodeRef: setInsideZoneRef, isOver: isOverInside } = useDroppable({
    id: insideZoneId,
  });
  const { setNodeRef: setBodyDropRef, isOver: isOverBodyDrop } = useDroppable({
    id: bodyDropId,
  });

  useEffect(() => {
    setName(collection.name);
  }, [collection.name]);

  const innerIds = useMemo(
    () => collection.links.map((link) => `collection-link-${link.id}`),
    [collection.links]
  );

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setName(collection.name);
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const res = await updateCollectionAction({
        id: collection.id,
        name: trimmed,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to update collection");
        return;
      }

      toast.success("Collection updated");
      setIsEditing(false);
      router.refresh();
    });
  };

  return (
    <>
      <div className="px-2 pb-2 pt-1">
        {/* Hit target in the board gap above the card + a bit of margin — "insert before this collection" */}
        <div
          ref={setGapBeforeRef}
          className={`relative z-10 -mt-3 mb-1 min-h-10 w-full rounded-xl transition ${
            isOverGapBefore ? "bg-cyan-400/15 ring-2 ring-cyan-400/35" : ""
          }`}
          aria-hidden
        />
        <div
          ref={setNodeRef}
          style={style}
          className={`relative rounded-[28px] border bg-[#151d2e] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-all duration-200 ${
            isDragging ? "opacity-0" : ""
          } ${isOver ? "border-cyan-400/30" : "border-white/8"}`}
        >
          {/* In-card zones: upper half-ish => before collection, lower => inside (not only the header row) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
            <div
              ref={setBeforeZoneRef}
              className={`absolute inset-x-0 top-0 h-[55%] transition ${
                isOverBefore ? "bg-cyan-400/10" : ""
              }`}
            />
            <div
              ref={setInsideZoneRef}
              className={`absolute inset-x-0 bottom-0 h-[45%] transition ${
                isOverInside ? "bg-cyan-400/6" : ""
              }`}
            />
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="cursor-grab rounded-full p-1 text-white/35 transition hover:bg-white/5 hover:text-white/60 active:cursor-grabbing"
              >
                <GripVertical className="h-5 w-5" />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/12 bg-cyan-400/8 text-cyan-300">
                <FolderClosed className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                {isEditing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                    }}
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base font-semibold text-white outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-left"
                  >
                    <span className="truncate text-[1.05rem] font-semibold text-white">
                      {collection.name}
                    </span>
                    <Pencil className="h-4 w-4 text-white/30" />
                  </button>
                )}

                <p className="mt-0.5 text-sm text-white/45">
                  {collection.links.length} {collection.links.length === 1 ? "link" : "links"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <SortableContext items={innerIds} strategy={verticalListSortingStrategy}>
            {/* Full-area droppable behind rows (z-0) so gaps between cards still register; link cards stay z-10. */}
            <div
              className={`relative min-h-[140px] rounded-[22px] ${
                collection.links.length > 0 ? "" : "min-h-[180px]"
              }`}
            >
              <div
                ref={setBodyDropRef}
                className={`absolute inset-0 z-0 rounded-[22px] transition ${
                  isOverBodyDrop
                    ? draggingRootBoardLink
                      ? "bg-cyan-400/12 ring-2 ring-cyan-400/30"
                      : "bg-cyan-400/8 ring-1 ring-cyan-400/15"
                    : draggingRootBoardLink
                      ? "ring-1 ring-inset ring-white/15"
                      : ""
                }`}
                aria-hidden
              />
              <div className="relative z-10 space-y-3">
                {collection.links.length === 0 ? (
                  <div
                    className={`rounded-[22px] border border-dashed px-5 py-5 text-center transition ${
                      draggingRootBoardLink
                        ? "border-cyan-400/35 bg-cyan-400/[0.06]"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <p className="mx-auto max-w-[360px] text-[14px] leading-6 text-white/65">
                      {draggingRootBoardLink
                        ? "Release to drop this link into the collection."
                        : "Add a new link or drag an existing link into this collection."}
                    </p>

                    <button
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Add link
                    </button>
                  </div>
                ) : (
                  collection.links.map((link) => (
                    <SortableInnerLinkCard
                      key={link.id}
                      sortableId={`collection-link-${link.id}`}
                      link={link}
                    />
                  ))
                )}
              </div>
            </div>
          </SortableContext>
        </div>
      </div>

      <AddItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        disableCollection
        collectionId={collection.id}
      />
    </>
  );
}