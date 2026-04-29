"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Trash2, Camera } from "lucide-react";
import Image from "next/image";
import { updateProfileImageAction } from "@/actions/dashboard/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
    open: boolean;
    currentImgUrl?: string | null;
    username: string;
    onClose: () => void;
};

export default function ManageProfilePictureModal({
    open,
    currentImgUrl,
    username,
    onClose,
}: Props) {
    const [mounted, setMounted] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImgUrl ?? null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (open) {
            setPreviewUrl(currentImgUrl ?? null);
        }
    }, [open, currentImgUrl]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isUploading && !isPending) onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose, isUploading, isPending]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview locally first for immediacy
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/profile-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to upload image");
                setPreviewUrl(currentImgUrl ?? null); // Revert on failure
                return;
            }

            const data = await res.json();
            if (data.imageUrl) {
                setPreviewUrl(data.imageUrl); // Use remote URL
                saveProfileImage(data.imageUrl); // Auto-save
            }
        } catch (error) {
            toast.error("An error occurred during upload");
            setPreviewUrl(currentImgUrl ?? null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input
            }
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        saveProfileImage(null);
    };

    const saveProfileImage = (newUrl: string | null) => {
        startTransition(async () => {
            const res = await updateProfileImageAction(newUrl);

            if (res.success) {
                toast.success(newUrl ? "Profile picture updated" : "Profile picture removed");
                router.refresh();
                if (!newUrl) {
                    onClose(); // Optional: close if removed
                }
            } else {
                toast.error(res.message || "Failed to update profile picture");
                setPreviewUrl(currentImgUrl ?? null); // Revert on failure
            }
        });
    };

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999]">
            <button
                type="button"
                aria-label="Close modal backdrop"
                onClick={onClose}
                disabled={isUploading || isPending}
                className="absolute inset-0 bg-[#020817]/70 backdrop-blur-md"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-sm overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(15,32,55,0.96)_0%,rgba(8,20,39,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.06)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative border-b border-white/10 px-6 py-5">
                        <h2 className="text-center text-[22px] font-semibold text-white">
                            Profile Picture
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUploading || isPending}
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </div>

                    <div className="px-6 py-8">
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/10 bg-white/5 shadow-inner">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt={username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-4xl text-white/60">
                                        {username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                
                                {(isUploading || isPending) && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                                    </div>
                                )}
                            </div>

                            <div className="flex w-full flex-col gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    disabled={isUploading || isPending}
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading || isPending}
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-[15px] font-medium text-white transition hover:bg-white/15 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Upload size={18} />
                                    {isUploading ? "Uploading..." : "Upload new image"}
                                </button>

                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={isUploading || isPending}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-[15px] font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                        Remove image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
