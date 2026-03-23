"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon } from "lucide-react";
import {
  savePlatformLinksAction,
  skipLinksAction,
} from "@/actions/onboarding/action.addlinks";
import {
  PLATFORM_OPTIONS,
  type PlatformType,
} from "@/lib/social-icons";

type ExistingLink = {
  platform: PlatformType;
  value: string;
};

type AddLinksStepProps = {
  selectedPlatforms: PlatformType[];
  existingLinks?: ExistingLink[];
};

const PLATFORM_META: Record<
  PlatformType,
  {
    placeholder: string;
    prefix?: string;
    keyboard?: "default" | "url";
  }
> = {
  INSTAGRAM: { placeholder: "Username", prefix: "@", keyboard: "default" },
  X: { placeholder: "x.com/username", keyboard: "url" },
  LINKEDIN: { placeholder: "linkedin.com/in/username", keyboard: "url" },
  YOUTUBE: { placeholder: "youtube.com/@username", keyboard: "url" },
  GITHUB: { placeholder: "github.com/username", keyboard: "url" },
  DISCORD: { placeholder: "Discord username", keyboard: "default" },
  TELEGRAM: { placeholder: "t.me/username", keyboard: "url" },
  THREADS: { placeholder: "threads.net/@username", keyboard: "url" },
  TWITCH: { placeholder: "twitch.tv/username", keyboard: "url" },
  SNAPCHAT: { placeholder: "snapchat.com/add/username", keyboard: "url" },
  FACEBOOK: { placeholder: "facebook.com/username", keyboard: "url" },
  PINTEREST: { placeholder: "pinterest.com/username", keyboard: "url" },
  PATREON: { placeholder: "patreon.com/username", keyboard: "url" },
  KICK: { placeholder: "kick.com/username", keyboard: "url" },
  PERSONAL_WEBSITE: { placeholder: "https://yourwebsite.com", keyboard: "url" },
};

export default function AddLinksStep({
  selectedPlatforms,
  existingLinks = [],
}: AddLinksStepProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const initialPlatformValues = useMemo(() => {
    const map: Record<string, string> = {};

    for (const platform of selectedPlatforms) {
      const existing = existingLinks.find((item) => item.platform === platform);
      map[platform] = existing?.value ?? "";
    }

    return map;
  }, [selectedPlatforms, existingLinks]);

  const [platformValues, setPlatformValues] =
    useState<Record<string, string>>(initialPlatformValues);

  const [customLinks, setCustomLinks] = useState<string[]>(["", ""]);

  const handlePlatformChange = (platform: PlatformType, value: string) => {
    setPlatformValues((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleCustomChange = (index: number, value: string) => {
    setCustomLinks((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleContinue = () => {
    setError("");

    startTransition(async () => {
      try {
        const formattedPlatformLinks = selectedPlatforms
          .map((platform) => ({
            platform,
            value: platformValues[platform]?.trim() ?? "",
          }))
          .filter((item) => item.value.length > 0);

        const formattedCustomLinks = customLinks
          .map((item) => item.trim())
          .filter(Boolean);

        await savePlatformLinksAction({
          platformLinks: formattedPlatformLinks,
          customLinks: formattedCustomLinks,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save links.");
      }
    });
  };

  const handleSkip = () => {
    setError("");

    startTransition(async () => {
      try {
        await skipLinksAction();
      } catch {
        setError("Failed to skip this step.");
      }
    });
  };

  return (
    <section className="w-full">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-6 sm:px-6">
        {/* top */}
        <div className="relative mb-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 text-sm font-medium text-white/55 transition hover:text-white"
          >
            Back
          </button>

          <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[86%] rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500" />
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

        {/* content */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-4xl border border-white/10 bg-white/4 px-5 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-8 sm:py-10">
            {/* heading */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Add your links
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55 sm:text-base">
                Complete the fields below to connect your content to your new LinkDeck.
              </p>
            </div>

            {/* selected links */}
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center text-sm font-semibold text-white/80">
                Your selections
              </h2>

              <div className="space-y-4">
                {selectedPlatforms.map((platform) => {
                  const config = PLATFORM_META[platform];
                  const platformInfo = PLATFORM_OPTIONS.find(
                    (item) => item.type === platform
                  );

                  if (!platformInfo) return null;

                  return (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                        <Image
                          src={platformInfo.icon}
                          alt={platformInfo.label}
                          width={22}
                          height={22}
                          className="h-6 w-6 object-contain"
                          unoptimized
                        />
                      </div>

                      <div className="relative flex-1">
                        {config.prefix ? (
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/40">
                            {config.prefix}
                          </span>
                        ) : null}

                        <input
                          type="text"
                          value={platformValues[platform] ?? ""}
                          onChange={(e) =>
                            handlePlatformChange(platform, e.target.value)
                          }
                          placeholder={config.placeholder}
                          inputMode={config.keyboard === "url" ? "url" : "text"}
                          className={`h-12 w-full rounded-2xl border border-white/10 bg-[#0c1322] px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60 focus:bg-[#0f1729] focus:ring-4 focus:ring-fuchsia-500/10 ${
                            config.prefix ? "pl-8" : ""
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* additional links */}
              <div className="mt-9">
                <h3 className="mb-4 text-center text-sm font-semibold text-white/80">
                  Additional links
                </h3>

                <div className="space-y-4">
                  {customLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                        <LinkIcon className="h-5 w-5 text-black/75" />
                      </div>

                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handleCustomChange(index, e.target.value)}
                        placeholder="https://example.com"
                        inputMode="url"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1322] px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60 focus:bg-[#0f1729] focus:ring-4 focus:ring-fuchsia-500/10"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* error */}
              {error ? (
                <p className="mt-5 text-center text-sm font-medium text-red-400">
                  {error}
                </p>
              ) : null}

              {/* button */}
              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isPending}
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-linear-to-r from-violet-600 via-fuchsia-500 to-fuchsia-500 px-8 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.28)] transition hover:scale-[0.995] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Saving..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}