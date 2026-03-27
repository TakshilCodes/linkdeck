import type { CSSProperties } from "react";
import type { ResolvedTheme } from "@/types/theme";
import {
    BLUR_STRENGTH,
    BUTTON_RADIUS,
    BUTTON_SHADOW,
    GRADIENT_DIRECTION,
    WALLPAPER_STYLE,
} from "@/lib/themes/theme-constants";

export function hexToRgb(hex: string) {
    const cleaned = hex.replace("#", "");
    const full =
        cleaned.length === 3
            ? cleaned
                .split("")
                .map((c) => c + c)
                .join("")
            : cleaned;

    const num = parseInt(full, 16);

    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

export function rgba(hex: string, alpha: number) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getGradient(
    direction: ResolvedTheme["gradientDirection"],
    color1: string,
    color2: string
) {
    switch (direction) {
        case GRADIENT_DIRECTION.LINEAR_UP:
            return `linear-gradient(0deg, ${color1} 0%, ${color2} 100%)`;

        case GRADIENT_DIRECTION.RADIAL:
            return `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)`;

        case GRADIENT_DIRECTION.LINEAR_DOWN:
        default:
            return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;
    }
}

export function getBackgroundStyle(theme: ResolvedTheme): CSSProperties {
    const color1 = theme.backgroundColor ?? "#f5f5f4";
    const color2 = theme.backgroundColor2 ?? color1;

    if (theme.wallpaperStyle === WALLPAPER_STYLE.FILL) {
        return {
            background: color1,
        };
    }

    return {
        background: getGradient(theme.gradientDirection, color1, color2),
    };
}

export function getRadiusClass(radius: ResolvedTheme["buttonRadius"]) {
    switch (radius) {
        case BUTTON_RADIUS.SQUARE:
            return "rounded-[16px]";

        case BUTTON_RADIUS.ROUND:
            return "rounded-[22px]";

        case BUTTON_RADIUS.ROUNDER:
            return "rounded-[28px]";

        case BUTTON_RADIUS.FULL:
        default:
            return "rounded-full";
    }
}

export function getShellStyle(
    shadow: ResolvedTheme["buttonShadow"],
    shadowColor: string
): CSSProperties | undefined {
    switch (shadow) {
        case BUTTON_SHADOW.NONE:
            return undefined;

        case BUTTON_SHADOW.SOFT:
            return {
                boxShadow: `0 8px 24px ${rgba(shadowColor, 0.18)}`,
            };

        case BUTTON_SHADOW.STRONG:
            return {
                boxShadow: `0 14px 30px ${rgba(shadowColor, 0.28)}`,
            };

        case BUTTON_SHADOW.HARD:
        default:
            return undefined;
    }
}

export function getBlurValue(blurStrength: ResolvedTheme["blurStrength"]) {
    switch (blurStrength) {
        case BLUR_STRENGTH.NONE:
            return "0px";

        case BLUR_STRENGTH.SOFT:
            return "12px";

        case BLUR_STRENGTH.MEDIUM:
            return "22px";

        case BLUR_STRENGTH.STRONG:
            return "34px";

        default:
            return "22px";
    }
}

export function getTitleFontSizeValue(theme: ResolvedTheme) {
    switch (theme.titleFontSize) {
        case "SMALL":
            return "22px";
        case "MEDIUM":
            return "26px";
        case "LARGE":
            return "32px";
        default:
            return "26px";
    }
}

export function getTitleFontWeightValue(theme: ResolvedTheme) {
    switch (theme.titleFontWeight) {
        case "NONE":
            return 400;
        case "SOFT":
            return 500;
        case "MEDIUM":
            return 600;
        case "STRONG":
            return 700;
        default:
            return 700;
    }
}

export function getProfileFontSizeValue(theme: ResolvedTheme) {
    switch (theme.profileFontSize) {
        case "SMALL":
            return "14px";
        case "MEDIUM":
            return "17px";
        case "LARGE":
            return "19px";
        default:
            return "17px";
    }
}

export function getThemeTokens(theme: ResolvedTheme) {
    return {
        buttonColor: theme.buttonColor ?? "#9ca3af",
        buttonTextColor: theme.buttonTextColor ?? "#ffffff",
        titleColor: theme.titleColor ?? "#ffffff",
        profileColor: theme.profileColor ?? "#ffffff",
        shadowColor: theme.shadowColor ?? "#000000",
        patternColor: theme.patternColor ?? "#6b7280",
        outlineColor: theme.outlineColor ?? "#111111",
        blurValue: getBlurValue(theme.blurStrength),
        radiusClass: getRadiusClass(theme.buttonRadius),
    };
}

export function getWallpaperOverlayMode(theme: ResolvedTheme) {
    return {
        isPattern: theme.wallpaperStyle === WALLPAPER_STYLE.PATTERN,
        isBlur: theme.wallpaperStyle === WALLPAPER_STYLE.BLUR,
    };
}

export function getButtonMode(theme: ResolvedTheme) {
    return {
        isHard:
            theme.buttonShadow === BUTTON_SHADOW.HARD &&
            theme.buttonStyle === "SOLID",
        isSoft: theme.buttonShadow === BUTTON_SHADOW.SOFT,
        isStrong: theme.buttonShadow === BUTTON_SHADOW.STRONG,
        isNone: theme.buttonShadow === BUTTON_SHADOW.NONE,
        isOutline: theme.buttonStyle === "OUTLINE",
        isGlass: theme.buttonStyle === "GLASS",
        isSolid: theme.buttonStyle === "SOLID",
    };
}

export function getCardFrameClasses() {
    return `
    relative w-full
    h-screen sm:h-[815px]
    max-w-none sm:max-w-[542px]
    overflow-hidden
    rounded-none sm:rounded-[30px]
    shadow-none sm:shadow-[0_40px_100px_rgba(0,0,0,0.22),0_12px_30px_rgba(0,0,0,0.10)]
    ring-0 sm:ring-1 sm:ring-black/5
  `;
}

export function getOuterStageClasses() {
    return "relative flex min-h-screen w-full items-center justify-center overflow-hidden p-0 sm:p-10";
}

export function getOuterBackdropClasses() {
    return "absolute inset-0 hidden bg-white/10 backdrop-blur-sm sm:block";
}