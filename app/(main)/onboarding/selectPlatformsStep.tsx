"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    PLATFORM_OPTIONS,
    type PlatformType,
} from "@/lib/social-icons";
import {
    savePlatformsAction,
    skipPlatformsAction,
} from "@/actions/onboarding/action.selectplatforms";

type SelectPlatformsStepProps = {
    preselectedPlatforms?: PlatformType[];
};

export default function SelectPlatformsStep({
    preselectedPlatforms = [],
}: SelectPlatformsStepProps) {
    const router = useRouter();
    const [selectedPlatforms, setSelectedPlatforms] =
        useState<PlatformType[]>(preselectedPlatforms);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const selectedCount = selectedPlatforms.length;

    const selectedLabels = useMemo(() => {
        return PLATFORM_OPTIONS.filter((platform) =>
            selectedPlatforms.includes(platform.type)
        ).map((platform) => platform.label);
    }, [selectedPlatforms]);

    const togglePlatform = (platform: PlatformType) => {
        setError("");

        setSelectedPlatforms((prev) => {
            const isSelected = prev.includes(platform);

            if (isSelected) {
                return prev.filter((item) => item !== platform);
            }

            return [...prev, platform];
        });
    };

    const handleContinue = () => {
        setError("");

        if (selectedPlatforms.length === 0) {
            setError("Please select at least one platform or skip this step.");
            return;
        }

        startTransition(async () => {
            try {
                await savePlatformsAction(selectedPlatforms as any);
            } catch {
                setError("Failed to save platforms.");
            }
        });
    };

    const handleSkip = () => {
        setError("");

        startTransition(async () => {
            try {
                await skipPlatformsAction();
            } catch {
                setError("Failed to skip this step.");
            }
        });
    };

    return (
        <section className="w-full">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 pb-36 sm:px-6">
                {/* top */}
                <div className="relative mb-8 flex items-center justify-center pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="absolute left-0 text-sm font-medium text-white/55 transition hover:text-white"
                    >
                        Back
                    </button>

                    <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500" />
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isPending}
                        className="absolute right-0 text-sm font-medium text-white/55 transition hover:text-white disabled:opacity-50"
                    >
                        Skip
                    </button>
                </div>

                {/* heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Which platforms are you on?
                    </h1>
                    <p className="mt-3 text-sm text-white/55 sm:text-base">
                        Pick up to five to get started.
                    </p>
                </div>

                {/* cards */}
                <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
                    {PLATFORM_OPTIONS.map((platform) => {
                        const isSelected = selectedPlatforms.includes(platform.type);

                        return (
                            <button
                                key={platform.type}
                                type="button"
                                onClick={() => togglePlatform(platform.type)}
                                className={`group relative flex h-36 w-44 flex-col items-center justify-center rounded-[22px] border overflow-hidden transition-all duration-200 ${isSelected
                                        ? "border-fuchsia-400/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] shadow-[0_12px_30px_rgba(168,85,247,0.16)]"
                                        : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5 hover:-translate-y-0.5"
                                    }`}
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${isSelected
                                            ? "opacity-100 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.12),transparent_60%)]"
                                            : "opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]"
                                        }`}
                                />

                                <div
                                    className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full transition-all ${isSelected
                                            ? "bg-fuchsia-500 text-white opacity-100 scale-100"
                                            : "bg-white/8 text-transparent opacity-0 scale-90 group-hover:opacity-100"
                                        }`}
                                >
                                    <Check className="h-3.5 w-3.5" />
                                </div>

                                <div
                                    className={`relative z-10 mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all ${isSelected ? "bg-white/10 ring-1 ring-white/10" : "bg-white/5"
                                        }`}
                                >
                                    <Image
                                        src={platform.icon}
                                        alt={platform.label}
                                        width={30}
                                        height={30}
                                        className="h-8 w-8 object-contain"
                                    />
                                </div>

                                <span className="relative z-10 text-[15px] font-semibold text-white">
                                    {platform.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* bottom cta */}
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#030712] via-[#030712]/85 to-transparent" />

                    <div className="relative mx-auto max-w-3xl px-4 pb-4">
                        <div className="rounded-3xl border border-white/10 bg-[#071120]/85 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 px-2">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                                        Selected platforms
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                                        {selectedCount === 0
                                            ? "No platforms selected"
                                            : `${selectedCount} selected`}
                                    </p>
                                    {selectedCount > 0 ? (
                                        <p className="mt-1 hidden truncate text-sm text-white/45 sm:block">
                                            {selectedLabels.join(", ")}
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleContinue}
                                    disabled={isPending || selectedCount === 0}
                                    className="inline-flex h-12 min-w-35 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 px-6 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                                >
                                    {isPending ? "Saving..." : "Continue"}
                                </button>
                            </div>

                            {error ? (
                                <p className="mt-3 px-2 text-sm text-red-400">{error}</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}