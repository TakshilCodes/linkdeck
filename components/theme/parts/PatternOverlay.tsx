"use client";

import { PATTERN_STYLE } from "@/lib/themes/theme-constants";
import type { ResolvedTheme } from "@/types/theme";
import { hexToRgb, rgba } from "@/lib/themes/theme-utils";

type PatternOverlayProps = {
    patternStyle: ResolvedTheme["patternStyle"];
    patternColor: string;
    backgroundColor?: string | null;
};

export default function PatternOverlay({
    patternStyle,
    patternColor,
    backgroundColor,
}: PatternOverlayProps) {
    if (patternStyle === PATTERN_STYLE.GRID) {
        const gridBase = backgroundColor ?? "#111111";
        const { r, g, b } = hexToRgb(gridBase);
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const lineAlpha = luminance < 0.2 ? 0.42 : luminance < 0.45 ? 0.34 : 0.24;

        return (
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(${rgba(patternColor, lineAlpha)} 1px, transparent 1px),
            linear-gradient(90deg, ${rgba(patternColor, lineAlpha)} 1px, transparent 1px)
          `,
                    backgroundSize: "55px 55px",
                }}
            />
        );
    }

    if (patternStyle === PATTERN_STYLE.MATRIX) {
  return (
    <>
      {/* tiny dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${rgba(
            patternColor,
            0.5
          )} 2px, transparent 2px)`,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />

      {/* ultra soft square structure */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(${rgba(patternColor, 0.5)} 1px, transparent 1px),
            linear-gradient(90deg, ${rgba(patternColor, 0.5)} 1px, transparent 1px)
          `,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />
    </>
  );
}

    if (patternStyle === PATTERN_STYLE.MORPH) {
        return (
            <>
                <div
                    className="absolute -left-10 top-8 h-44 w-44 rounded-full blur-3xl"
                    style={{ background: rgba(patternColor, 0.16) }}
                />
                <div
                    className="absolute right-0 top-24 h-40 w-40 rounded-full blur-3xl"
                    style={{ background: rgba(patternColor, 0.14) }}
                />
                <div
                    className="absolute bottom-10 left-12 h-52 w-52 rounded-full blur-[80px]"
                    style={{ background: rgba(patternColor, 0.14) }}
                />
            </>
        );
    }

    if (patternStyle === PATTERN_STYLE.ORGANIC) {
        return (
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 18% 20%, ${rgba(
                        patternColor,
                        0.42
                    )} 0 12%, transparent 13%),
            radial-gradient(circle at 80% 18%, ${rgba(
                        patternColor,
                        0.38
                    )} 0 10%, transparent 11%),
            radial-gradient(circle at 32% 78%, ${rgba(
                        patternColor,
                        0.34
                    )} 0 14%, transparent 15%),
            radial-gradient(circle at 76% 72%, ${rgba(
                        patternColor,
                        0.3
                    )} 0 16%, transparent 17%)
          `,
                }}
            />
        );
    }

    return null;
}
