"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type BottomSheetProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxHeightClassName?: string;
  contentMaxHeightClassName?: string;
  backdropClassName?: string;
};

export default function BottomSheet({
  open,
  title,
  children,
  onClose,
  maxHeightClassName = "max-h-[82dvh]",
  contentMaxHeightClassName = "max-h-[calc(82dvh-82px)]",
  backdropClassName = "bg-black/55",
}: BottomSheetProps) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.24;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          <motion.button
            type="button"
            aria-label="Close settings"
            className={`absolute inset-0 ${backdropClassName}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <motion.section
            drag={shouldReduceMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.25 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 650) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration, ease: "easeOut" }}
            className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[32px] border border-white/10 bg-[#07101C] text-white shadow-[0_-24px_80px_rgba(0,0,0,0.5)] ${maxHeightClassName}`}
            style={{ touchAction: "pan-y" }}
          >
            <div className="cursor-grab px-5 pb-2 pt-3 active:cursor-grabbing" aria-label="Drag down to close settings">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-white/25" />
            </div>
            <div className="flex items-center justify-between border-b border-white/10 px-5 pb-4">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className={`overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 scrollbar-hide ${contentMaxHeightClassName}`}>
              {children}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
