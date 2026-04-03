"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Folder, Link2, Plus, X } from "lucide-react";
import {
  createCollectionAction,
  createRootLinkAction,
  createLinkInCollectionAction,
} from "@/actions/dashboard/links";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  disableCollection?: boolean;
  collectionId?: string | null;
};

type AddItemMode = "root" | "link";

export default function AddItemModal({
  open,
  onClose,
  disableCollection = false,
  collectionId = null,
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AddItemMode>("root");
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    if (!open) return;
    setMode("root");
    setUrl("");
  }, [open]);

  const handleAddLink = () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    startTransition(async () => {
      const res = collectionId
        ? await createLinkInCollectionAction({
            rawUrl: trimmed,
            collectionId,
          })
        : await createRootLinkAction({
            rawUrl: trimmed,
          });

      if (!res.success) {
        toast.error(res.message || "Failed to add link");
        return;
      }

      toast.success("Link added");
      router.refresh();
      onClose();
    });
  };

  const handleCreateCollection = () => {
    startTransition(async () => {
      const res = await createCollectionAction();

      if (!res.success) {
        toast.error(res.message || "Failed to create collection");
        return;
      }

      toast.success("Collection created");
      router.refresh();
      onClose();
    });
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#020817]/70 backdrop-blur-md"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[720px] overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,32,55,0.96)_0%,rgba(8,20,39,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="relative border-b border-white/10 px-6 py-5">
            {mode === "link" && (
              <button
                type="button"
                onClick={() => setMode("root")}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            <h2 className="text-center text-[24px] font-semibold text-white">
              Add
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste or search a link"
                className="w-full bg-transparent text-[17px] text-white outline-none placeholder:text-white/35"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
              />
            </div>

            {mode === "root" ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setMode("link")}
                    className="rounded-3xl border border-white/10 bg-white/4 p-5 text-left transition hover:bg-white/[0.07]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                      <Link2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">Link</h3>
                    <p className="mt-1 text-sm text-white/55">
                      Add a normal link from any website.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateCollection}
                    disabled={disableCollection || isPending}
                    className="rounded-3xl border border-white/10 bg-white/4 p-5 text-left transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                      <Folder className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">Collection</h3>
                    <p className="mt-1 text-sm text-white/55">
                      Create a collection first and edit it later.
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!url.trim() || isPending}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan-500 text-[17px] font-semibold text-[#03111f] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isPending ? "Adding..." : "Add link"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!url.trim() || isPending}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan-500 text-[17px] font-semibold text-[#03111f] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {isPending ? "Adding..." : "Add link"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}