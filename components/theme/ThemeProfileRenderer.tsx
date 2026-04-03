"use client";

import type { ResolvedTheme } from "@/types/theme";
import { WALLPAPER_STYLE } from "@/lib/themes/theme-constants";
import { getFontClass } from "@/lib/themes/font-map";

import {
    getBackgroundStyle,
    getCardFrameClasses,
    getOuterBackdropClasses,
    getOuterStageClasses,
    getThemeTokens,
} from "@/lib/themes/theme-utils";

import ProfileHeader from "./parts/ProfileHeader"
import Footer from "./parts/Footer";
import PatternOverlay from "./parts/PatternOverlay";
import LinkSection from "./parts/LinkSection";

type RendererIcon = {
    id: string;
    type: string;
    url: string;
    label?: string | null;
};

type RendererLink = {
    id: string;
    name: string;
    url: string;
};

type RendererCollection = {
    id: string;
    name: string;
    links: RendererLink[];
};

type RendererProfile = {
    username?: string | null;
    displayName?: string | null;
    profileImgUrl?: string | null;
    bio?: string | null;
};

type ThemeProfileRendererProps = {
    theme: ResolvedTheme;
    profile: RendererProfile;
    icons: RendererIcon[];
    standaloneLinks: RendererLink[];
    collections: RendererCollection[];
    showBranding?: boolean;
    /** Compact phone-style frame for dashboard preview (no full-page stage). */
    layout?: "page" | "embed";
};

/** ~iPhone 14 logical portrait (390×844); dashboard preview matches real phone canvas. */
const embedFrameClasses =
    "relative mx-auto h-[min(844px,85dvh)] w-full max-w-[390px] shrink-0 overflow-hidden rounded-[44px] sm:h-[844px] sm:w-[390px]";

export default function ThemeProfileRenderer({
    theme,
    profile,
    icons,
    standaloneLinks,
    collections,
    showBranding = true,
    layout = "page",
}: ThemeProfileRendererProps) {

    const bgStyle = getBackgroundStyle(theme);
    const { patternColor, blurValue, titleColor, profileColor } = getThemeTokens(theme);

    const innerScrollClass =
        layout === "embed"
            ? "relative z-10 flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden px-7 pb-8 pt-11"
            : `relative z-10 flex h-full flex-col px-7 pb-8 pt-11`;

    const cardBody = (
        <>
            <div className="absolute inset-0" style={bgStyle} />

            {theme.wallpaperStyle === WALLPAPER_STYLE.PATTERN && (
                <PatternOverlay
                    patternStyle={theme.patternStyle}
                    patternColor={patternColor}
                />
            )}

            {theme.wallpaperStyle === WALLPAPER_STYLE.BLUR && (
                <>
                    <div
                        className="absolute -left-14 top-6 h-52 w-52 rounded-full"
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            filter: `blur(${blurValue})`,
                        }}
                    />
                    <div
                        className="absolute right-0 top-10 h-44 w-44 rounded-full"
                        style={{
                            background: "rgba(255,255,255,0.16)",
                            filter: `blur(${blurValue})`,
                        }}
                    />
                    <div
                        className="absolute bottom-12 left-16 h-56 w-56 rounded-full"
                        style={{
                            background: "rgba(255,255,255,0.12)",
                            filter: `blur(${blurValue})`,
                        }}
                    />
                    <div
                        className="absolute bottom-8 right-8 h-56 w-56 rounded-full"
                        style={{
                            background: "rgba(255,255,255,0.12)",
                            filter: `blur(${blurValue})`,
                        }}
                    />
                </>
            )}

            <div className={`${innerScrollClass} ${getFontClass(theme.fontFamily)}`}>
                <ProfileHeader theme={theme} profile={profile} icons={icons} />

                {standaloneLinks.length > 0 && (
                    <LinkSection
                        title="Websites"
                        links={standaloneLinks}
                        theme={theme}
                        titleColor={profileColor}
                    />
                )}

                {collections.map((collection) =>
                    collection.links.length > 0 ? (
                        <LinkSection
                            key={collection.id}
                            title={collection.name}
                            links={collection.links}
                            theme={theme}
                            titleColor={profileColor}
                            isCollection={true}
                            className="mt-10"
                        />
                    ) : null
                )}

                <div className="flex-1" />

                <Footer
                    username={profile.username}
                    titleColor={titleColor}
                    showBranding={showBranding}
                />
            </div>
        </>
    );

    if (layout === "embed") {
        return <div className={embedFrameClasses}>{cardBody}</div>;
    }

    return (
        <div className={getOuterStageClasses()}>
            <div className={getOuterBackdropClasses()} />

            <div className={getCardFrameClasses()}>{cardBody}</div>
        </div>
    );
}