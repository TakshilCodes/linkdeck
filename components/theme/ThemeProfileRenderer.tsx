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
};

export default function ThemeProfileRenderer({
    theme,
    profile,
    icons,
    standaloneLinks,
    collections,
    showBranding = true,
}: ThemeProfileRendererProps) {
    console.log({
        wallpaperStyle: theme.wallpaperStyle,
        patternStyle: theme.patternStyle,
        patternColor: theme.patternColor,
    });
    const bgStyle = getBackgroundStyle(theme);
    const { patternColor, blurValue, titleColor, profileColor } =
        getThemeTokens(theme);

    const groupedSections = [
        ...(standaloneLinks.length > 0
            ? [{ id: "standalone", name: "Websites", links: standaloneLinks }]
            : []),
        ...collections.filter((collection) => collection.links.length > 0),
    ];

    return (
        <div className={getOuterStageClasses()}>
            <div className={getOuterBackdropClasses()} />

            <div className={getCardFrameClasses()}>
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

                <div
                    className={`relative z-10 flex h-full flex-col px-7 pb-8 pt-11 ${getFontClass(
                        theme.fontFamily
                    )}`}
                >
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
            </div>
        </div>
    );
}