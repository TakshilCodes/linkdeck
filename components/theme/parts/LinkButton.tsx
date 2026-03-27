"use client";

import { MoreVertical } from "lucide-react";
import type { ResolvedTheme } from "@/types/theme"
import {
  getButtonMode,
  getShellStyle,
  getThemeTokens,
  rgba,
} from "@/lib/themes/theme-utils";

type LinkButtonProps = {
  label: string;
  href: string;
  theme: ResolvedTheme;
};

export default function LinkButton({
  label,
  href,
  theme,
}: LinkButtonProps) {
  const {
    buttonColor,
    buttonTextColor,
    shadowColor,
    outlineColor,
    radiusClass,
  } = getThemeTokens(theme);

  const { isHard, isSoft, isStrong, isNone, isOutline, isGlass, isSolid } =
    getButtonMode(theme);

  return (
    <div className="group relative">
      {isHard && (
        <div
          className={`absolute inset-0 translate-x-0.75 translate-y-1 transition-transform duration-200 ease-out group-hover:translate-x-0.75 group-hover:translate-y-0.75 ${radiusClass}`}
          style={{ backgroundColor: shadowColor }}
        />
      )}

      <div
        className={`relative ${radiusClass}`}
        style={!isHard ? getShellStyle(theme.buttonShadow, shadowColor) : undefined}
      >
        {isHard ? (
          <div
            className={`relative p-0.5 ${radiusClass}`}
            style={{ background: shadowColor }}
          >
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`relative flex h-16 w-full items-center justify-between overflow-hidden px-7 text-[15px] font-semibold transition-all duration-200 ease-out group-hover:-translate-y-px active:translate-y-0 ${radiusClass}`}
              style={{
                background: buttonColor,
                color: buttonTextColor,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.08)",
              }}
            >
              <div
                className={`pointer-events-none absolute left-1.5 right-1.5 top-1 h-[42%] ${radiusClass}`}
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.08), rgba(255,255,255,0))",
                }}
              />

              <div
                className="pointer-events-none absolute left-3.5 right-3.5 top-1.75 h-px"
                style={{ background: "rgba(255,255,255,0.30)" }}
              />

              <div
                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${radiusClass}`}
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02), transparent 58%)",
                }}
              />

              <span className="relative z-10 w-6" />
              <span className="relative z-10 text-[15px] font-semibold">
                {label}
              </span>
              <MoreVertical className="relative z-10 h-4 w-4 opacity-60 transition-opacity duration-200 group-hover:opacity-75" />
            </a>
          </div>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`relative flex h-16 w-full items-center justify-between overflow-hidden px-7 text-[15px] font-semibold transition-all duration-200 ease-out ${radiusClass}`}
            style={{
              background: isOutline
                ? "transparent"
                : isGlass
                ? rgba(buttonColor, 0.18)
                : buttonColor,
              color: buttonTextColor,
              border: isOutline
                ? `2px solid ${outlineColor}`
                : isGlass
                ? `1px solid ${rgba("#ffffff", 0.22)}`
                : "none",
              backdropFilter: isGlass ? "blur(10px)" : "none",
              WebkitBackdropFilter: isGlass ? "blur(10px)" : "none",

              ...(isSolid && {
                boxShadow: isNone
                  ? "none"
                  : isSoft
                  ? `0 8px 18px ${rgba(shadowColor, 0.14)}`
                  : isStrong
                  ? `0 12px 26px ${rgba(shadowColor, 0.22)}`
                  : undefined,
              }),

              ...(isGlass && {
                boxShadow: isNone
                  ? `inset 0 1px 0 ${rgba("#ffffff", 0.16)}`
                  : isSoft
                  ? `0 8px 18px ${rgba(
                      shadowColor,
                      0.12
                    )}, inset 0 1px 0 ${rgba("#ffffff", 0.18)}`
                  : isStrong
                  ? `0 12px 28px ${rgba(
                      shadowColor,
                      0.18
                    )}, inset 0 1px 0 ${rgba("#ffffff", 0.2)}`
                  : undefined,
              }),

              ...(isOutline && {
                boxShadow: isNone
                  ? "none"
                  : isSoft
                  ? `0 6px 16px ${rgba(shadowColor, 0.1)}`
                  : isStrong
                  ? `0 10px 24px ${rgba(shadowColor, 0.16)}`
                  : undefined,
              }),
            }}
          >
            {isGlass && (
              <div
                className={`pointer-events-none absolute inset-0 ${radiusClass}`}
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0.05), transparent 42%)",
                }}
              />
            )}

            {isSolid && !isNone && (
              <div
                className="pointer-events-none absolute left-4 right-4 top-2 h-px"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            )}

            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${radiusClass}`}
              style={{
                background: isGlass
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0.06), transparent 60%)"
                  : isOutline
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03), transparent 65%)"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04), transparent 60%)",
              }}
            />

            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${radiusClass}`}
              style={{
                boxShadow: isOutline
                  ? `inset 0 0 0 1px ${rgba("#ffffff", 0.1)}`
                  : isGlass
                  ? `inset 0 0 0 1px ${rgba("#ffffff", 0.12)}`
                  : `inset 0 0 0 1px ${rgba("#ffffff", 0.08)}`,
              }}
            />

            <span className="relative z-10 w-6" />
            <span className="relative z-10">{label}</span>
            <MoreVertical className="relative z-10 h-4 w-4 opacity-60 transition-opacity duration-200 group-hover:opacity-75" />
          </a>
        )}
      </div>
    </div>
  );
}