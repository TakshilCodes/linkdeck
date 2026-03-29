"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { selectThemeAction, skipThemeAction } from "@/actions/onboarding/action.selecttheme";

type ThemeItem = {
  id: string;
  name: string;
  slug: string;
  previewImgUrl: string | null;
  isDefault: boolean;
};

type SelectThemeStepProps = {
  themes: ThemeItem[];
};

export default function SelectThemeStep({ themes }: SelectThemeStepProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const defaultSelected =
    themes.find((theme) => theme.isDefault)?.id ?? themes[0]?.id ?? "";

  const [selectedThemeId, setSelectedThemeId] = useState(defaultSelected);

  const selectedTheme = useMemo(() => {
    return themes.find((theme) => theme.id === selectedThemeId) ?? null;
  }, [themes, selectedThemeId]);

  const handleContinue = async () => {
  if (!selectedThemeId) {
    setError("Please select a theme.");
    return;
  }

  try {
    await selectThemeAction(selectedThemeId);
  } catch (e) {
    setError("Something went wrong");
  }
};

const handleSkip = async () => {
  try {
    await skipThemeAction();
  } catch {
    setError("Something went wrong");
  }
};

  return (
    <section className="w-full max-w-6xl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        {/* top row */}
        <div className="relative mb-8 flex items-center justify-center pt-2">

          <button
            type="button"
            onClick={handleSkip}
            className="absolute right-0 text-sm font-medium text-white/60 transition hover:text-white"
          >
            Skip
          </button>
        </div>

        {/* heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Select a theme
          </h1>
          <p className="mt-3 text-sm text-white/60 sm:text-base">
            Pick the style that feels right — you can add your content later
          </p>
        </div>

        {/* themes */}
        <div className="flex-1">
          {themes.length === 0 ? (
            <div className="flex min-h-75 items-center justify-center rounded-[28px] border border-white/10 bg-white/3 text-white/50">
              No themes found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {themes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedThemeId(theme.id)}
                    className="group text-left"
                  >
                    <div
                      className={`relative overflow-hidden rounded-[26px] border transition-all duration-200 ${
                        isSelected
                          ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      {/* phone preview ratio */}
                      <div className="relative aspect-9/16 w-full overflow-hidden rounded-[26px]">
                        {theme.previewImgUrl ? (
                          <Image
                            src={theme.previewImgUrl}
                            alt={theme.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/4 text-sm text-white/35">
                            No preview
                          </div>
                        )}

                        {/* dark overlay for better text */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

                        {/* badges */}
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                          {theme.isDefault ? (
                            <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                              Default
                            </span>
                          ) : null}
                        </div>

                        {isSelected ? (
                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-lg">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : null}

                        {/* bottom label */}
                        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                          <p className="truncate text-sm font-semibold text-white">
                            {theme.name}
                          </p>
                          <p className="truncate text-xs text-white/60">
                            @{theme.slug}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* bottom action */}
        <div className="sticky bottom-0 mt-8 pb-2 pt-6">
          <div className="mx-auto max-w-xl">
            <div className="rounded-4xl border border-white/10 bg-black/30 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 px-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                    Selected theme
                  </p>
                  <p className="truncate text-sm font-semibold text-white">
                    {selectedTheme?.name ?? "No theme selected"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isPending || !selectedThemeId}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 px-6 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-60"
                >
                  {isPending ? "Saving..." : "Start with this template"}
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