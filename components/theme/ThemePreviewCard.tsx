"use client";

import {
  Instagram,
  MessageCircle,
  MoreVertical,
  Twitter,
} from "lucide-react";

import ProfileImg from "@/public/preview/profile_picture.jpg"

type ThemePreview = {
  name: string;
  wallpaperStyle: "FILL" | "GRADIENT" | "BLUR" | "PATTERN";
  backgroundColor: string | null;
  backgroundColor2: string | null;
  gradientDirection: "LINEAR_UP" | "LINEAR_DOWN" | "RADIAL" | null;
  patternStyle: "GRID" | "MORPH" | "ORGANIC" | "MATRIX" | null;
  blurStrength: string | null;
  buttonStyle: "SOLID" | "GLASS" | "OUTLINE";
  buttonRadius: "SQUARE" | "ROUND" | "ROUNDER" | "FULL";
  buttonShadow: "NONE" | "SOFT" | "STRONG" | "HARD";
  buttonColor: string | null;
  buttonTextColor: string | null;
  shadowColor: string | null;
  patternColor: string | null;
  outlineColor: string | null;
  titleColor: string | null;
  titleFontSize: string | null;
  titleFontWeight: string | null;
  profileFontSize: string | null;
  profileColor: string | null;
  fontFamily: string | null;
};

function hexToRgb(hex: string) {
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

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getGradient(
  direction: ThemePreview["gradientDirection"],
  color1: string,
  color2: string
) {
  switch (direction) {
    case "LINEAR_UP":
      return `linear-gradient(0deg, ${color1} 0%, ${color2} 100%)`;
    case "RADIAL":
      return `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)`;
    case "LINEAR_DOWN":
    default:
      return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;
  }
}

function getBackgroundStyle(theme: ThemePreview) {
  if (theme.wallpaperStyle === "FILL") {
    return {
      background: theme.backgroundColor ?? "#9ca3af",
    };
  }

  return {
    background: getGradient(
      theme.gradientDirection,
      theme.backgroundColor ?? "#9ca3af",
      theme.backgroundColor2 ?? "#b4b8bb"
    ),
  };
}

function getRadiusClass(radius: ThemePreview["buttonRadius"]) {
  switch (radius) {
    case "SQUARE":
      return "rounded-[16px]";
    case "ROUND":
      return "rounded-[22px]";
    case "ROUNDER":
      return "rounded-[28px]";
    case "FULL":
    default:
      return "rounded-full";
  }
}

function getShellStyle(
  shadow: ThemePreview["buttonShadow"],
  shadowColor: string
) {
  switch (shadow) {
    case "NONE":
      return undefined;
    case "SOFT":
      return {
        boxShadow: `0 8px 24px ${rgba(shadowColor, 0.18)}`,
      };
    case "STRONG":
      return {
        boxShadow: `0 14px 30px ${rgba(shadowColor, 0.28)}`,
      };
    case "HARD":
    default:
      return undefined;
  }
}

function getBlurValue(blurStrength: ThemePreview["blurStrength"]) {
  switch (blurStrength) {
    case "NONE":
      return "0px";
    case "SOFT":
      return "12px";
    case "MEDIUM":
      return "22px";
    case "STRONG":
      return "34px";
    default:
      return "22px";
  }
}

function PatternOverlay({
  patternStyle,
  patternColor,
}: {
  patternStyle: ThemePreview["patternStyle"];
  patternColor: string;
}) {
  if (patternStyle === "GRID") {
    return (
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.25,
          backgroundImage: `
            linear-gradient(${rgba(patternColor, 0.55)} 1px, transparent 1px),
            linear-gradient(90deg, ${rgba(patternColor, 0.55)} 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />
    );
  }

  if (patternStyle === "MATRIX") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage: `
              radial-gradient(${rgba(patternColor, 0.9)} 1.1px, transparent 1.1px)
            `,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.08,
            backgroundImage: `
              linear-gradient(to bottom, transparent 0%, ${rgba(
              patternColor,
              0.28
            )} 45%, transparent 100%)
            `,
            backgroundSize: "100% 24px",
          }}
        />
      </>
    );
  }

  if (patternStyle === "MORPH") {
    return (
      <>
        <div
          className="absolute -left-10 top-8 h-44 w-44 rounded-full blur-3xl"
          style={{ background: rgba(patternColor, 0.12) }}
        />
        <div
          className="absolute right-0 top-24 h-40 w-40 rounded-full blur-3xl"
          style={{ background: rgba(patternColor, 0.1) }}
        />
        <div
          className="absolute bottom-10 left-12 h-52 w-52 rounded-full blur-[80px]"
          style={{ background: rgba(patternColor, 0.1) }}
        />
      </>
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.18,
        backgroundImage: `
          radial-gradient(circle at 18% 20%, ${rgba(
          patternColor,
          0.55
        )} 0 12%, transparent 13%),
          radial-gradient(circle at 80% 18%, ${rgba(
          patternColor,
          0.5
        )} 0 10%, transparent 11%),
          radial-gradient(circle at 32% 78%, ${rgba(
          patternColor,
          0.45
        )} 0 14%, transparent 15%),
          radial-gradient(circle at 76% 72%, ${rgba(
          patternColor,
          0.4
        )} 0 16%, transparent 17%)
        `,
      }}
    />
  );
}

export default function ThemePreviewCard({ theme }: { theme: ThemePreview }) {
  const radiusClass = getRadiusClass(theme.buttonRadius);
  const bgStyle = getBackgroundStyle(theme);
  const blurValue = getBlurValue(theme.blurStrength);

  const buttonColor = theme.buttonColor ?? "#9ca3af";
  const buttonTextColor = theme.buttonTextColor ?? "#ffffff";
  const titleColor = theme.titleColor ?? "#ffffff";
  const profileColor = theme.profileColor ?? "#ffffff";
  const shadowColor = theme.shadowColor ?? "#000000";
  const patternColor = theme.patternColor ?? "#ffffff";
  const outlineColor = theme.outlineColor ?? "#111111";

  const links = ["Create Next App", "Instagram", "X"];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-0 sm:p-10">
  <div className="absolute inset-0 hidden sm:block bg-white/10 backdrop-blur-[8px]" />

  <div
    className="
      relative w-full
      h-screen sm:h-[815px]
      max-w-none sm:max-w-[542px]
      overflow-hidden
      rounded-none sm:rounded-[30px]
      shadow-none sm:shadow-[0_40px_100px_rgba(0,0,0,0.22),0_12px_30px_rgba(0,0,0,0.10)]
      ring-0 sm:ring-1 sm:ring-black/5
    "
  >
    <div className="absolute inset-0" style={bgStyle} />

        {theme.wallpaperStyle === "PATTERN" && (
          <PatternOverlay
            patternStyle={theme.patternStyle}
            patternColor={patternColor}
          />
        )}

        {theme.wallpaperStyle === "BLUR" && (
          <>
            <div
              className="absolute -left-14 top-6 h-52 w-52 rounded-full"
              style={{
                background: rgba("#ffffff", 0.2),
                filter: `blur(${blurValue})`,
              }}
            />
            <div
              className="absolute right-0 top-10 h-44 w-44 rounded-full"
              style={{
                background: rgba("#ffffff", 0.16),
                filter: `blur(${blurValue})`,
              }}
            />
            <div
              className="absolute bottom-12 left-16 h-56 w-56 rounded-full"
              style={{
                background: rgba("#ffffff", 0.12),
                filter: `blur(${blurValue})`,
              }}
            />
            <div
              className="absolute bottom-8 right-8 h-56 w-56 rounded-full"
              style={{
                background: rgba("#ffffff", 0.12),
                filter: `blur(${blurValue})`,
              }}
            />
          </>
        )}

        <div
          className="relative z-10 flex h-full flex-col px-7 pb-8 pt-11"
          style={{ fontFamily: theme.fontFamily ?? "Inter, sans-serif" }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white/90 shadow-md">
              <img src={ProfileImg.src} alt="profile" className="rounded-full" />
            </div>

            <h1
              className="text-[26px] font-bold"
              style={{
                color: titleColor,
                fontSize: theme.titleFontSize ?? "26px",
                fontWeight: theme.titleFontWeight ?? "700",
              }}
            >
              takshil.dev
            </h1>

            <div
              className="mt-3 flex items-center gap-5"
              style={{ color: profileColor }}
            >
              <button
                type="button"
                className="rounded-full p-1 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:scale-105 active:scale-95"
              >
                <Instagram className="h-7 w-7" />
              </button>
              <button
                type="button"
                className="rounded-full p-1 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-7 w-7" />
              </button>
              <button
                type="button"
                className="rounded-full p-1 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:scale-105 active:scale-95"
              >
                <Twitter className="h-7 w-7" />
              </button>
            </div>

            <p
              className="mt-10 text-[17px] font-bold"
              style={{ color: profileColor }}
            >
              Websites
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-9">
            {links.map((link) => {
              const isHard =
                theme.buttonShadow === "HARD" && theme.buttonStyle === "SOLID";
              const isSoft = theme.buttonShadow === "SOFT";
              const isStrong = theme.buttonShadow === "STRONG";
              const isNone = theme.buttonShadow === "NONE";
              const isOutline = theme.buttonStyle === "OUTLINE";
              const isGlass = theme.buttonStyle === "GLASS";
              const isSolid = theme.buttonStyle === "SOLID";

              return (
                <div key={link} className="group relative">
                  {isHard && (
                    <div
                      className={`absolute inset-0 translate-x-[3px] translate-y-[4px] transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:translate-y-[3px] ${radiusClass}`}
                      style={{ backgroundColor: shadowColor }}
                    />
                  )}

                  <div
                    className={`relative ${radiusClass}`}
                    style={!isHard ? getShellStyle(theme.buttonShadow, shadowColor) : undefined}
                  >
                    {isHard ? (
                      <div
                        className={`relative p-[2px] ${radiusClass}`}
                        style={{ background: shadowColor }}
                      >
                        <button
                          className={`relative flex h-[64px] w-full items-center justify-between overflow-hidden px-7 text-[15px] font-semibold transition-all duration-200 ease-out group-hover:-translate-y-[1px] active:translate-y-0 ${radiusClass}`}
                          style={{
                            background: buttonColor,
                            color: buttonTextColor,
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.08)",
                          }}
                        >
                          <div
                            className={`pointer-events-none absolute left-[6px] right-[6px] top-[4px] h-[42%] ${radiusClass}`}
                            style={{
                              background:
                                "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.08), rgba(255,255,255,0))",
                            }}
                          />
                          <div
                            className="pointer-events-none absolute left-[14px] right-[14px] top-[7px] h-[1px]"
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
                            {link}
                          </span>
                          <MoreVertical className="relative z-10 h-4 w-4 opacity-60 transition-opacity duration-200 group-hover:opacity-75" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`relative flex h-[64px] w-full items-center justify-between overflow-hidden px-7 text-[15px] font-semibold transition-all duration-200 ease-out ${radiusClass}`}
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
                            className="pointer-events-none absolute left-[16px] right-[16px] top-[8px] h-[1px]"
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
                        <span className="relative z-10">{link}</span>
                        <MoreVertical className="relative z-10 h-4 w-4 opacity-60 transition-opacity duration-200 group-hover:opacity-75" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="flex flex-col items-center">
            <button className="mb-8 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black shadow-[0_10px_22px_rgba(0,0,0,0.20)] transition-all duration-200 ease-out hover:scale-[1.04] hover:-translate-y-[2px] hover:shadow-[0_16px_30px_rgba(0,0,0,0.28)] active:scale-[0.96] active:translate-y-[1px]">
              Join takshil.dev on LinkDeck
            </button>

            <p
              className="text-center text-[12px] font-medium"
              style={{ color: rgba(titleColor ?? "#ffffff", 0.8) }}
            >
              Cookie Preferences • Report • Privacy • Explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}