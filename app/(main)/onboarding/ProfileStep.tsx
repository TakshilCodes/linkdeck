"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
    saveProfileAction,
    skipProfileAction,
} from "@/actions/onboarding/action.profile";

type ProfileStepProps = {
    initialDisplayName?: string;
    initialBio?: string;
    initialProfileImgUrl?: string;
};

export default function ProfileStep({
    initialDisplayName = "",
    initialBio = "",
    initialProfileImgUrl = "",
}: ProfileStepProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
    const [bio, setBio] = useState(initialBio ?? "");
    const [profileImgUrl, setProfileImgUrl] = useState(initialProfileImgUrl ?? "");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);

    const bioCount = bio?.length;

    const handlePickImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            setProfileImgUrl(data.imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleContinue = () => {
        setError("");

        startTransition(async () => {
            try {
                await saveProfileAction({
                    displayName,
                    bio,
                    profileImgUrl,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to save profile.");
            }
        });
    };

    const handleSkip = () => {
        setError("");

        startTransition(async () => {
            try {
                await skipProfileAction();
            } catch {
                setError("Failed to skip this step.");
            }
        });
    };

    return (
        <section className="w-full">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 pb-12 pt-4 sm:px-6">
                {/* top */}
                <div className="relative mb-10 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="absolute left-0 text-sm font-medium text-white/60 transition hover:text-white"
                    >
                        Back
                    </button>

                    <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500" />
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isPending || isUploading}
                        className="absolute right-0 text-sm font-medium text-white/60 transition hover:text-white disabled:opacity-50"
                    >
                        Skip
                    </button>
                </div>

                <div className="mx-auto w-full max-w-2xl rounded-4xl border border-white/10 bg-white/4 px-5 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-8 sm:py-10">
                    {/* heading */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Add profile details
                        </h1>
                        <p className="mt-3 text-sm text-white/55 sm:text-base">
                            Add your profile image, name, and bio.
                        </p>
                    </div>

                    {/* avatar */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={handlePickImage}
                                className="relative flex h-34 w-34 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0c1322] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                            >
                                {profileImgUrl ? (
                                    <Image
                                        src={profileImgUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#101827] text-white/25">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-20 w-20"
                                            fill="currentColor"
                                        >
                                            <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                                        </svg>
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handlePickImage}
                                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
                            >
                                <Plus className="h-5 w-5" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* form */}
                    <div className="mx-auto max-w-xl space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white/75">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your display name"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1322] px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60 focus:bg-[#0f1729] focus:ring-4 focus:ring-fuchsia-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white/75">
                                Bio
                            </label>
                            <div className="rounded-2xl border border-white/10 bg-[#0c1322] transition focus-within:border-fuchsia-400/60 focus-within:ring-4 focus-within:ring-fuchsia-500/10">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                                    placeholder="Tell people a little about yourself"
                                    rows={5}
                                    className="w-full resize-none bg-transparent px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/30"
                                />
                                <div className="px-4 pb-3 text-right text-xs text-white/40">
                                    {bioCount}/160
                                </div>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <p className="mt-5 text-center text-sm font-medium text-red-400">
                            {error}
                        </p>
                    ) : null}

                    <div className="mx-auto mt-10 max-w-xl">
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={isPending || isUploading}
                            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-linear-to-r from-violet-600 via-fuchsia-500 to-fuchsia-500 px-8 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.28)] transition hover:scale-[0.995] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUploading
                                ? "Uploading image..."
                                : isPending
                                    ? "Saving..."
                                    : "Continue"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}