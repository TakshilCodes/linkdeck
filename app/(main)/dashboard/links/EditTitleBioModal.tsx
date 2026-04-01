"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { updateProfileAction } from "@/actions/dashboard/profile";
import { useTransition } from "react";


type Props = {
    open: boolean;
    title: string;
    bio: string;
    onClose: () => void;
    onSave: () => void;
    onTitleChange: (value: string) => void;
    onBioChange: (value: string) => void;
};

export default function EditTitleBioModal({
    open,
    title,
    bio,
    onClose,
    onSave,
    onTitleChange,
    onBioChange,
}: Props) {

    const [mounted, setMounted] = useState(false);
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

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateProfileAction({
                displayName: title,
                bio: bio,
            });

            if (res.success) {
                onSave();
            } else {
                alert(res.message);
            }
        });
    };

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-99999">
            <button
                type="button"
                aria-label="Close modal backdrop"
                onClick={onClose}
                className="absolute inset-0 bg-[#020817]/70 backdrop-blur-md"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-140 overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,32,55,0.96)_0%,rgba(8,20,39,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.06)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative border-b border-white/10 px-6 py-5">
                        <h2 className="text-center text-[22px] font-semibold text-white">
                            Title and bio
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </div>

                    <div className="px-5 py-5">
                        <div className="space-y-5">
                            <div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 pb-2 pt-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                    <label className="mb-1 block text-[13px] font-medium text-white/55">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => onTitleChange(e.target.value)}
                                        maxLength={30}
                                        className="h-8 w-full bg-transparent text-[17px] font-medium text-white outline-none placeholder:text-white/25"
                                        placeholder="@takshilpandya"
                                    />
                                </div>

                                <p className="mt-1 text-right text-[12px] text-white/45">
                                    {title.length} / 30
                                </p>
                            </div>

                            <div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                    <label className="mb-2 block text-[13px] font-medium text-white/55">
                                        Bio
                                    </label>

                                    <textarea
                                        value={bio}
                                        onChange={(e) => onBioChange(e.target.value)}
                                        maxLength={160}
                                        rows={5}
                                        className="min-h-30 w-full resize-none bg-transparent text-[15px] text-white outline-none placeholder:text-white/25"
                                        placeholder="Write a short bio"
                                    />
                                </div>

                                <p className="mt-1 text-right text-[12px] text-white/45">
                                    {bio.length} / 160
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="flex h-12 w-full items-center justify-center rounded-full bg-cyan-500 text-[17px] font-semibold text-[#03111f] shadow-[0_10px_30px_rgba(6,182,212,0.35)] transition hover:bg-cyan-400 active:scale-[0.99]"
                            >
                                {isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}