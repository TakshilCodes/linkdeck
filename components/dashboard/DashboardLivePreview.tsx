"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";
import type { ResolvedTheme } from "@/types/theme";
import {
  getProfileUrlClipboard,
  getProfileUrlDisplay,
} from "@/utils/public-profile-url";
import type {
  ThemePreviewCollection,
  ThemePreviewIcon,
  ThemePreviewLink,
} from "@/utils/dashboard-theme-preview";

/** Logical phone size (matches ThemeProfileRenderer embed). */
const EMBED_W = 390;
const EMBED_H = 844;
/** Slightly smaller mockup in the pane, like Linktree preview (~82%). */
const PREVIEW_SCALE = 0.82;

type Props = {
  username: string;
  theme: ResolvedTheme | null;
  profile: {
    username?: string | null;
    displayName?: string | null;
    profileImgUrl?: string | null;
    bio?: string | null;
  };
  icons: ThemePreviewIcon[];
  standaloneLinks: ThemePreviewLink[];
  collections: ThemePreviewCollection[];
};

export default function DashboardLivePreview({
  username,
  theme,
  profile,
  icons,
  standaloneLinks,
  collections,
}: Props) {
  const displayUrl = getProfileUrlDisplay(username);

  const copyProfileUrl = async () => {
    try {
      const url = getProfileUrlClipboard(username);
      if (!url) {
        toast.error("No profile URL to copy");
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="flex h-full min-h-[min(760px,90vh)] flex-col rounded-[24px] border border-white/[0.08] bg-[#0a121c] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex shrink-0 items-center">
        <div className="flex w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-[#111b28] py-2 pl-4 pr-2 text-sm text-white/80 shadow-sm">
          <span className="min-w-0 flex-1 truncate font-medium text-white/90">{displayUrl}</span>
          <button
            type="button"
            onClick={copyProfileUrl}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label="Copy profile link"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 items-center justify-center overflow-auto py-4">
        {theme ? (
          <div
            className="shrink-0 overflow-hidden rounded-[40px] shadow-[0_20px_56px_rgba(0,0,0,0.48)] ring-1 ring-white/[0.12]"
            style={{
              width: EMBED_W * PREVIEW_SCALE,
              height: EMBED_H * PREVIEW_SCALE,
            }}
          >
            <div
              className="origin-top-left will-change-transform"
              style={{
                width: EMBED_W,
                height: EMBED_H,
                transform: `scale(${PREVIEW_SCALE})`,
              }}
            >
              <ThemeProfileRenderer
                layout="embed"
                theme={theme}
                profile={profile}
                icons={icons}
                standaloneLinks={standaloneLinks}
                collections={collections}
                showBranding
              />
            </div>
          </div>
        ) : (
          <div className="flex max-w-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-12 text-center">
            <p className="text-sm font-medium text-white/75">No theme selected</p>
            <p className="mt-2 text-xs leading-relaxed text-white/40">
              Finish onboarding or pick a theme so your preview matches your public page.
            </p>
            <Link
              href="/onboarding"
              className="mt-4 rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-[#03111f] transition hover:bg-cyan-300"
            >
              Set up theme
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
