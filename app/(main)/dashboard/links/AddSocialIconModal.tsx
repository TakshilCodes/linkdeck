"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ChevronRight, Plus, X } from "lucide-react";
import { IconType } from "@/app/generated/prisma/enums";
import { ICONS, getIconByType } from "@/lib/social-icons";
import { addSocialIconAction } from "@/actions/dashboard/social-icon"

type Props = {
  open: boolean;
  onClose: () => void;
  initialType?: IconType | null;
};

export default function AddSocialIconModal({ open, onClose, initialType }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<IconType | null>(initialType ?? null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  if (open) {
    setSelectedType(initialType ?? null);
    setValue("");
    setError("");
  }
}, [open, initialType]);

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

  useEffect(() => {
    if (!open) {
      setSelectedType(null);
      setValue("");
      setError("");
    }
  }, [open]);

  const selectedMeta = useMemo(() => {
    if (!selectedType) return null;
    return getIconByType(selectedType) ?? null;
  }, [selectedType]);

  const handleSubmit = () => {
    if (!selectedType) return;

    setError("");

    startTransition(async () => {
      const res = await addSocialIconAction({
        type: selectedType,
        value,
      });

      if (!res.success) {
        setError(res.message || "Something went wrong");
        return;
      }

      setSelectedType(null);
      setValue("");
      onClose();
    });
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 ">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-[#020817]/70 backdrop-blur-md"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-140 overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,32,55,0.96)_0%,rgba(8,20,39,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.06)]">
          {!selectedType ? (
            <>
              <div className="relative border-b border-white/10  px-6 py-5">
                <h2 className="text-center text-[22px] font-semibold text-white">
                  Add social icon
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-105 overflow-y-auto scrollbar-hide px-4 py-4">
                <div className="space-y-1">
                  {ICONS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setSelectedType(item.type)}
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition hover:bg-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[18px] font-medium text-white">
                            {item.label}
                          </span>
                        </div>

                        <ChevronRight className="h-5 w-5 text-white/50" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative border-b border-white/10 px-6 py-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType(null);
                    setValue("");
                    setError("");
                  }}
                  className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <h2 className="text-center text-[22px] font-semibold text-white">
                  Add {selectedMeta?.label} icon
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-5 py-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={selectedMeta?.placeholder}
                    className="w-full bg-transparent text-[17px] text-white outline-none placeholder:text-white/30"
                  />
                </div>

                {selectedMeta?.example && (
                  <p className="mt-3 text-sm text-white/55">
                    Example: {selectedMeta.example}
                  </p>
                )}

                {error && (
                  <p className="mt-3 text-sm text-red-400">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!value.trim() || isPending}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-cyan-500 text-[17px] font-semibold text-[#03111f] shadow-[0_10px_30px_rgba(6,182,212,0.35)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}