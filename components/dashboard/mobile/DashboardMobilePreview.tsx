"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import ThemeProfileRenderer from "@/components/theme/ThemeProfileRenderer";
import { useDesignStore } from "@/store/design";
import type { ResolvedTheme } from "@/types/theme";
import type {
  ThemePreviewCollection,
  ThemePreviewIcon,
  ThemePreviewLink,
  ThemePreviewSection,
} from "@/utils/dashboard-theme-preview";

type Props = {
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
  sections: ThemePreviewSection[];
};

type ViewportSize = {
  width: number;
  height: number;
};

const FRAME_W = 390;
const MAX_FRAME_H = 844;
const MOBILE_HORIZONTAL_PADDING = 16;
const CLOSED_VERTICAL_RESERVED = 112;
const PANEL_OPEN_VERTICAL_RESERVED = 72;
const CLOSED_MAX_SCALE = 0.82;
const PANEL_OPEN_MAX_SCALE = 0.38;

function getViewportSize(): ViewportSize {
  if (typeof window === "undefined") {
    return { width: 390, height: 844 };
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

function getRendererFrameHeight(viewport: ViewportSize) {
  return Math.min(MAX_FRAME_H, viewport.height * 0.85);
}

function getPreviewScale(viewport: ViewportSize, panelOpen: boolean, frameHeight: number) {
  const availableWidth = Math.max(0, viewport.width - MOBILE_HORIZONTAL_PADDING);
  const availableHeight = panelOpen
    ? Math.max(0, viewport.height * 0.52 - PANEL_OPEN_VERTICAL_RESERVED)
    : Math.max(0, viewport.height - CLOSED_VERTICAL_RESERVED);
  const maxScale = panelOpen ? PANEL_OPEN_MAX_SCALE : CLOSED_MAX_SCALE;

  return Math.max(
    0.28,
    Math.min(maxScale, availableWidth / FRAME_W, availableHeight / frameHeight)
  );
}

export default function DashboardMobilePreview({
  theme,
  profile,
  icons,
  standaloneLinks,
  collections,
  sections,
}: Props) {
  const pathname = usePathname();
  const [viewport, setViewport] = useState(getViewportSize);
  const {
    previewTheme,
    previewProfile,
    previewCustomTheme,
    mobileDesignPanelOpen,
  } = useDesignStore();

  useEffect(() => {
    const updateViewport = () => setViewport(getViewportSize());

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  if (pathname !== "/dashboard/design") return null;

  const activeTheme = previewTheme || theme;
  if (!activeTheme) return null;

  const mergedTheme = { ...activeTheme, ...previewCustomTheme } as ResolvedTheme;
  const mergedProfile = { ...profile, ...previewProfile };
  const frameHeight = getRendererFrameHeight(viewport);
  const scale = getPreviewScale(viewport, mobileDesignPanelOpen, frameHeight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex justify-center border-b border-white/10 bg-[#07101C] px-2 md:hidden ${
        mobileDesignPanelOpen
          ? "h-[calc(52dvh-4rem)] items-center py-2"
          : "h-[calc(100dvh-8rem)] items-center py-2"
      }`}
    >
      <motion.div
        className="mx-auto overflow-hidden rounded-[30px] border border-white/10 shadow-[0_18px_46px_rgba(0,0,0,0.34)]"
        animate={{ width: FRAME_W * scale, height: frameHeight * scale }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div
          className="origin-top-left"
          style={{ width: FRAME_W, height: frameHeight, transform: `scale(${scale})` }}
        >
          <ThemeProfileRenderer
            key={mobileDesignPanelOpen ? "compact-preview" : "full-preview"}
            layout="embed"
            theme={mergedTheme}
            profile={mergedProfile}
            icons={icons}
            standaloneLinks={standaloneLinks}
            collections={collections}
            sections={sections}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
