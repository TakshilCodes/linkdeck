"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

type WarningModalVariant = "warning" | "danger";

type WarningModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: WarningModalVariant;
  isLoading?: boolean;
  hideCancel?: boolean;
  lockScroll?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function WarningModal({
  open,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  variant = "warning",
  isLoading = false,
  hideCancel = false,
  lockScroll = true,
  onClose,
  onConfirm,
}: WarningModalProps) {
  const isClient = useIsClient();
  const titleId = useId();
  const descriptionId = useId();
  const isDanger = variant === "danger";

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [isLoading, lockScroll, onClose, open]);

  if (!isClient || !open) return null;

  const Icon = isDanger ? Trash2 : AlertTriangle;

  return createPortal(
    <div className="fixed inset-0 z-[100000]">
      <button
        type="button"
        aria-label="Close warning modal"
        disabled={isLoading}
        onClick={onClose}
        className="absolute inset-0 bg-[#020817]/75 backdrop-blur-md disabled:cursor-not-allowed"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,32,55,0.98)_0%,rgba(8,20,39,0.99)_100%)] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isDanger
                ? "border-red-400/20 bg-red-500/10 text-red-300"
                : "border-amber-300/20 bg-amber-400/10 text-amber-200"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <h2 id={titleId} className="pr-10 text-[22px] font-semibold tracking-tight text-white">
            {title}
          </h2>

          <p id={descriptionId} className="mt-2 text-sm leading-6 text-white/60">
            {description}
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {!hideCancel ? (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onConfirm ?? onClose}
              disabled={isLoading}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${
                isDanger
                  ? "bg-red-500 text-white shadow-[0_12px_34px_rgba(239,68,68,0.24)] hover:bg-red-400"
                  : "bg-cyan-400 text-[#03111f] shadow-[0_12px_34px_rgba(34,211,238,0.22)] hover:bg-cyan-300"
              }`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Working..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
