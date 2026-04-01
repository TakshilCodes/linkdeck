"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";
import { getIconByType } from "@/lib/social-icons";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SocialType =
  | "INSTAGRAM"
  | "X"
  | "LINKEDIN"
  | "FACEBOOK"
  | "YOUTUBE"
  | "GITHUB"
  | "PERSONAL_WEBSITE"
  | "PATREON"
  | "KICK"
  | "DISCORD"
  | "PINTEREST"
  | "TWITCH"
  | "TELEGRAM"
  | "THREADS"
  | "SNAPCHAT";

type SocialIconItem = {
  id: string;
  type: SocialType;
  value: string;
  label?: string | null;
  isVisible: boolean;
  position: number;
};

type Props = {
  open: boolean;
  icons: SocialIconItem[];
  onClose: () => void;
  onAddIcon: () => void;
  onEditIcon: (type: SocialType) => void;
  onToggleIcon?: (id: string, nextVisible: boolean) => void;
  onReorder?: (items: SocialIconItem[]) => void;
  onDeleteIcon?: (id: string) => void;
};

type SortableRowProps = {
  item: SocialIconItem;
  onEditIcon: (type: SocialType) => void;
  onToggleIcon?: (id: string, nextVisible: boolean) => void;
  onDeleteIcon?: (id: string) => void;
};

function SortableSocialIconRow({
  item,
  onEditIcon,
  onToggleIcon,
  onDeleteIcon,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const meta = getIconByType(item.type);
  if (!meta) return null;

  const Icon = meta.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between rounded-[18px] border border-white/8 bg-white/3 px-4 py-3 will-change-transform ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none select-none text-white/35 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[16px] font-medium text-white">
          {meta.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEditIcon(item.type)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDeleteIcon?.(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-red-300/80 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggleIcon?.(item.id, !item.isVisible)}
          className={`relative h-7 w-12 rounded-full transition ${
            item.isVisible ? "bg-emerald-500/90" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              item.isVisible ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function ManageSocialIconsModal({
  open,
  icons,
  onClose,
  onAddIcon,
  onEditIcon,
  onToggleIcon,
  onReorder,
  onDeleteIcon,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const sortedIcons = useMemo(() => {
    return [...icons].sort((a, b) => a.position - b.position);
  }, [icons]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sortedIcons.findIndex((item) => item.id === active.id);
    const newIndex = sortedIcons.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sortedIcons, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        position: index,
      })
    );

    onReorder?.(reordered);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-99999">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-[#030b18]/75 backdrop-blur-[6px]"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-140 overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[linear-gradient(180deg,#0d2340_0%,#08172d_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(10,132,255,0.04)]">
          <div className="relative border-b border-white/10 px-6 py-5">
            <h2 className="text-center text-[22px] font-semibold text-white">
              Social icons
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5">
            <h3 className="text-[18px] font-semibold text-white">
              Show visitors where to find you
            </h3>

            <p className="mt-2 text-[15px] leading-6 text-white/55">
              Add your social profiles, email and more as linked icons on your
              LinkDeck.
            </p>

            <div className="mt-7">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedIcons.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sortedIcons.map((item) => (
                      <SortableSocialIconRow
                        key={item.id}
                        item={item}
                        onEditIcon={onEditIcon}
                        onToggleIcon={onToggleIcon}
                        onDeleteIcon={onDeleteIcon}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <button
              type="button"
              onClick={onAddIcon}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full cursor-pointer bg-cyan-400 text-[16px] font-semibold text-[#03111f] shadow-[0_10px_24px_rgba(11,122,154,0.28)] transition hover:bg-cyan-500"
            >
              <Plus className="h-4 w-4" />
              Add social icon
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}