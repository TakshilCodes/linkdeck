"use client";

import React, { useMemo, useState } from "react";
import {
  Instagram,
  MessageCircle,
  Twitter,
  MoreVertical,
  Share2,
  Sparkles,
} from "lucide-react";
import profilePic from '@/public/preview/profile_picture.jpg'
import Link from "next/link";

const wallpaperStyles = ["FILL", "GRADIENT", "BLUR", "PATTERN"] as const;
const gradientDirections = ["LINEAR_DOWN", "LINEAR_UP", "RADIAL"] as const;
const patternStyles = ["GRID", "MORPH", "ORGANIC", "MATRIX"] as const;
const blurStrengths = ["NONE", "SOFT", "MEDIUM", "STRONG"] as const;
const buttonStyles = ["SOLID", "GLASS", "OUTLINE"] as const;
const buttonRadii = ["SQUARE", "ROUND", "ROUNDER", "FULL"] as const;
const buttonShadows = ["NONE", "SOFT", "STRONG", "HARD"] as const;

type WallpaperStyle = (typeof wallpaperStyles)[number];
type GradientDirection = (typeof gradientDirections)[number];
type PatternStyle = (typeof patternStyles)[number];
type BlurStrength = (typeof blurStrengths)[number];
type ButtonStyle = (typeof buttonStyles)[number];
type ButtonRadius = (typeof buttonRadii)[number];
type ButtonShadow = (typeof buttonShadows)[number];

type StaticThemeState = {
  wallpaperStyle: WallpaperStyle;
  gradientDirection: GradientDirection;
  patternStyle: PatternStyle;
  blurStrength: BlurStrength;
  buttonStyle: ButtonStyle;
  buttonRadius: ButtonRadius;
  buttonShadow: ButtonShadow;
};

const initialState: StaticThemeState = {
  wallpaperStyle: "GRADIENT",
  gradientDirection: "LINEAR_DOWN",
  patternStyle: "GRID",
  blurStrength: "MEDIUM",
  buttonStyle: "SOLID",
  buttonRadius: "FULL",
  buttonShadow: "HARD",
};

const initialDynamic = {
  backgroundColor: "#8f9496",
  backgroundColor2: "#a7adb0",
  buttonColor: "#969b9e",
  buttonTextColor: "#ffffff",
  titleColor: "#ffffff",
  profileColor: "#ffffff",
  shadowColor: "#000000",
  patternColor: "#ffffff",
  outlineColor: "#111111",
};

const links = ["ShopKart", "volt.in", "dub.sh"];

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
  direction: GradientDirection,
  color1: string,
  color2: string
) {
  switch (direction) {
    case "LINEAR_DOWN":
      return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;

    case "LINEAR_UP":
      return `linear-gradient(0deg, ${color1} 0%, ${color2} 100%)`;

    case "RADIAL":
      return `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)`;

    default:
      return `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`;
  }
}

function getBlurValue(blurStrength: BlurStrength) {
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

function getRadiusClass(radius: ButtonRadius) {
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

function getShellStyle(shadow: ButtonShadow, shadowColor: string) {
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

function getButtonStyleObject({
  buttonStyle,
  buttonColor,
  buttonTextColor,
  outlineColor,
}: {
  buttonStyle: ButtonStyle;
  buttonColor: string;
  buttonTextColor: string;
  outlineColor: string;
}) {
  switch (buttonStyle) {
    case "GLASS":
      return {
        background: rgba(buttonColor, 0.18),
        color: buttonTextColor,
        border: `1px solid ${rgba("#ffffff", 0.28)}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      };
    case "OUTLINE":
      return {
        background: "transparent",
        color: buttonTextColor,
        border: `2px solid ${outlineColor}`,
      };
    case "SOLID":
    default:
      return {
        background: buttonColor,
        color: buttonTextColor,
        border: "none",
      };
  }
}

function PatternOverlay({
  patternStyle,
  patternColor,
}: {
  patternStyle: PatternStyle;
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
          backgroundSize: "45px 45px",
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
            backgroundSize: "18px 18px",
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

export default function LinkDeckThemePlayground() {
  const [dynamic, setDynamic] = useState(initialDynamic);
  const [theme, setTheme] = useState<StaticThemeState>(initialState);

  const wallpaperStyleValue = useMemo(() => {
    if (theme.wallpaperStyle === "FILL") {
      return {
        background: dynamic.backgroundColor,
      };
    }

    if (
      theme.wallpaperStyle === "GRADIENT" ||
      theme.wallpaperStyle === "BLUR" ||
      theme.wallpaperStyle === "PATTERN"
    ) {
      return {
        background: getGradient(
          theme.gradientDirection,
          dynamic.backgroundColor,
          dynamic.backgroundColor2
        ),
      };
    }

    return {
      background: dynamic.backgroundColor,
    };
  }, [
    theme.wallpaperStyle,
    theme.gradientDirection,
    dynamic.backgroundColor,
    dynamic.backgroundColor2,
  ]);

  const blurValue = getBlurValue(theme.blurStrength);
  const radiusClass = getRadiusClass(theme.buttonRadius);

  return (
    <div className="min-h-screen bg-[#111214] p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/20 p-2">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">LinkDeck Theme Playground</h1>
              <p className="text-sm text-white/60">
                Tune every static option before saving themes to DB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="mb-3 text-sm font-medium text-white/80">
                Dynamic Values
              </p>

              <ColorInput
                label="Background 1"
                value={dynamic.backgroundColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, backgroundColor: v }))
                }
              />
              <ColorInput
                label="Background 2"
                value={dynamic.backgroundColor2}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, backgroundColor2: v }))
                }
              />
              <ColorInput
                label="Button"
                value={dynamic.buttonColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, buttonColor: v }))
                }
              />
              <ColorInput
                label="Button Text"
                value={dynamic.buttonTextColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, buttonTextColor: v }))
                }
              />
              <ColorInput
                label="Title"
                value={dynamic.titleColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, titleColor: v }))
                }
              />
              <ColorInput
                label="Profile Icons"
                value={dynamic.profileColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, profileColor: v }))
                }
              />
              <ColorInput
                label="Shadow"
                value={dynamic.shadowColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, shadowColor: v }))
                }
              />
              <ColorInput
                label="Pattern"
                value={dynamic.patternColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, patternColor: v }))
                }
              />
              <ColorInput
                label="Outline"
                value={dynamic.outlineColor}
                onChange={(v) =>
                  setDynamic((prev) => ({ ...prev, outlineColor: v }))
                }
              />
            </div>

            <SelectRow
              label="Wallpaper Style"
              value={theme.wallpaperStyle}
              options={wallpaperStyles}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  wallpaperStyle: value as WallpaperStyle,
                }))
              }
            />

            <SelectRow
              label="Gradient Direction"
              value={theme.gradientDirection}
              options={gradientDirections}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  gradientDirection: value as GradientDirection,
                }))
              }
            />

            <SelectRow
              label="Pattern Style"
              value={theme.patternStyle}
              options={patternStyles}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  patternStyle: value as PatternStyle,
                }))
              }
            />

            <SelectRow
              label="Blur Strength"
              value={theme.blurStrength}
              options={blurStrengths}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  blurStrength: value as BlurStrength,
                }))
              }
            />

            <SelectRow
              label="Button Style"
              value={theme.buttonStyle}
              options={buttonStyles}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  buttonStyle: value as ButtonStyle,
                }))
              }
            />

            <SelectRow
              label="Button Radius"
              value={theme.buttonRadius}
              options={buttonRadii}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  buttonRadius: value as ButtonRadius,
                }))
              }
            />

            <SelectRow
              label="Button Shadow"
              value={theme.buttonShadow}
              options={buttonShadows}
              onChange={(value) =>
                setTheme((prev) => ({
                  ...prev,
                  buttonShadow: value as ButtonShadow,
                }))
              }
            />
          </div>
        </aside>

        <section className="rounded-3xl border border-white/10 bg-[#17191d] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-sm text-white/60">
                Live LinkDeck shell for testing static CSS decisions.
              </p>
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
              {theme.wallpaperStyle} / {theme.buttonStyle} / {theme.buttonShadow}
            </div>
          </div>

          <div className="flex min-h-[820px] items-center justify-center rounded-[28px] bg-[#0d0f12] p-6">
            <div className="relative h-[860px] w-[390px] overflow-hidden rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0" style={wallpaperStyleValue} />

              {theme.wallpaperStyle === "BLUR" && (
                <>
                  <div
                    className="absolute -left-20 top-0 h-64 w-64 rounded-full"
                    style={{
                      background: rgba("#ffffff", 0.22),
                      filter: `blur(${blurValue})`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 h-72 w-72 rounded-full"
                    style={{
                      background: rgba("#ffffff", 0.16),
                      filter: `blur(${blurValue})`,
                    }}
                  />
                  <div
                    className="absolute left-20 top-48 h-40 w-40 rounded-full"
                    style={{
                      background: rgba("#000000", 0.08),
                      filter: `blur(${blurValue})`,
                    }}
                  />
                </>
              )}

              {theme.wallpaperStyle === "PATTERN" && (
                <PatternOverlay
                  patternStyle={theme.patternStyle}
                  patternColor={dynamic.patternColor}
                />
              )}

              <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-8">

                <div className="flex flex-col items-center text-center pt-10">
                  <img
                    src={profilePic.src}
                    alt="profile"
                    className="mb-4 h-24 w-24 rounded-full object-cover"
                  />

                  <h1
                    className="text-[22px] font-semibold"
                    style={{ color: dynamic.titleColor }}
                  >
                    takshil.dev
                  </h1>

                  <div
                    className="mt-3 flex gap-5"
                    style={{ color: dynamic.profileColor }}
                  >
                    <Instagram className="h-6 w-6" />
                    <MessageCircle className="h-6 w-6" />
                    <Twitter className="h-6 w-6" />
                  </div>

                  <p className={`mt-6 font-semibold`} style={{ color: dynamic.profileColor }}>Websites</p>
                </div>

                <div className="mt-6 flex flex-col gap-7">
                  {links.map((link) => {
                    const buttonStyleObject = getButtonStyleObject({
                      buttonStyle: theme.buttonStyle,
                      buttonColor: dynamic.buttonColor,
                      buttonTextColor: dynamic.buttonTextColor,
                      outlineColor: dynamic.outlineColor,
                    });

                    const isHard = theme.buttonShadow === "HARD";
                    const isSoft = theme.buttonShadow === "SOFT";
                    const isStrong = theme.buttonShadow === "STRONG";
                    const isNone = theme.buttonShadow === "NONE";
                    const isOutline = theme.buttonStyle === "OUTLINE";
                    const isGlass = theme.buttonStyle === "GLASS";
                    const isSolid = theme.buttonStyle === "SOLID";

                    const useHardPillLook = isHard && isSolid;

                    return (
                      <div
                        key={link}
                        className="group relative"
                      >
                        {/* hard shadow back plate */}
                        {useHardPillLook && (
                          <div
                            className={`absolute inset-0 translate-x-[3px] translate-y-[4px] transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:translate-y-[3px] ${radiusClass}`}
                            style={{ backgroundColor: dynamic.shadowColor }}
                          />
                        )}

                        <div
                          className={`relative ${radiusClass}`}
                          style={
                            !useHardPillLook
                              ? getShellStyle(theme.buttonShadow, dynamic.shadowColor)
                              : undefined
                          }
                        >
                          {useHardPillLook ? (
                            /* HARD + SOLID */
                            <div
                              className={`relative p-[2px] ${radiusClass}`}
                              style={{ background: dynamic.shadowColor }}
                            >
                              <button
                                className={`relative flex h-[58px] w-full items-center justify-between overflow-hidden px-6 transition-all duration-200 ease-out group-hover:-translate-y-[1px] active:translate-y-0 ${radiusClass}`}
                                style={{
                                  ...buttonStyleObject,
                                  boxShadow:
                                    "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.08)",
                                }}
                              >
                                {/* fixed top highlight */}
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

                                {/* very slight hover brighten for hard */}
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
                            /* ALL NON-HARD STATES */
                            <button
                              className={`relative flex h-[58px] w-full items-center justify-between overflow-hidden px-6 transition-all duration-200 ease-out cursor-pointer ${radiusClass}`}
                              style={{
                                ...buttonStyleObject,

                                ...(isSolid && {
                                  boxShadow: isNone
                                    ? "none"
                                    : isSoft
                                      ? `0 8px 18px ${rgba(dynamic.shadowColor, 0.14)}`
                                      : isStrong
                                        ? `0 12px 26px ${rgba(dynamic.shadowColor, 0.22)}`
                                        : undefined,
                                }),

                                ...(isGlass && {
                                  border: `1px solid ${rgba("#ffffff", 0.22)}`,
                                  boxShadow: isNone
                                    ? `inset 0 1px 0 ${rgba("#ffffff", 0.16)}`
                                    : isSoft
                                      ? `0 8px 18px ${rgba(dynamic.shadowColor, 0.12)}, inset 0 1px 0 ${rgba(
                                        "#ffffff",
                                        0.18
                                      )}`
                                      : isStrong
                                        ? `0 12px 28px ${rgba(dynamic.shadowColor, 0.18)}, inset 0 1px 0 ${rgba(
                                          "#ffffff",
                                          0.2
                                        )}`
                                        : `0 14px 32px ${rgba(dynamic.shadowColor, 0.2)}, inset 0 1px 0 ${rgba(
                                          "#ffffff",
                                          0.2
                                        )}`,
                                }),

                                ...(isOutline && {
                                  border: `2px solid ${dynamic.outlineColor}`,
                                  boxShadow: isNone
                                    ? "none"
                                    : isSoft
                                      ? `0 6px 16px ${rgba(dynamic.shadowColor, 0.10)}`
                                      : isStrong
                                        ? `0 10px 24px ${rgba(dynamic.shadowColor, 0.16)}`
                                        : `0 12px 28px ${rgba(dynamic.shadowColor, 0.18)}`,
                                }),
                              }}
                            >
                              {/* base glass shine */}
                              {isGlass && (
                                <div
                                  className={`pointer-events-none absolute inset-0 ${radiusClass}`}
                                  style={{
                                    background:
                                      "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0.05), transparent 42%)",
                                  }}
                                />
                              )}

                              {/* slight top line for non-hard solid */}
                              {isSolid && !isNone && (
                                <div
                                  className="pointer-events-none absolute left-[16px] right-[16px] top-[8px] h-[1px]"
                                  style={{ background: "rgba(255,255,255,0.12)" }}
                                />
                              )}

                              {/* ONLY slight color/highlight change on hover */}
                              <div
                                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${radiusClass}`}
                                style={{
                                  background: isGlass
                                    ? "linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0.06), transparent 60%)"
                                    : isOutline
                                      ? "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03), transparent 65%)"
                                      : "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04), transparent 60%)"
                                }}
                              />

                              {/* very small border clarification on hover */}
                              <div
                                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${radiusClass}`}
                                style={{
                                  boxShadow: isOutline
                                    ? `inset 0 0 0 1px ${rgba("#ffffff", 0.10)}`
                                    : isGlass
                                      ? `inset 0 0 0 1px ${rgba("#ffffff", 0.12)}`
                                      : `inset 0 0 0 1px ${rgba("#ffffff", 0.08)}`
                                }}
                              />

                              <span className="relative z-10 w-6" />
                              <span className="relative z-10 text-[15px] font-semibold">
                                {link}
                              </span>
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
                  <Link href={'/'} className="mb-6 rounded-full bg-white px-6 py-3 font-semibold text-black shadow-[0_10px_22px_rgba(0,0,0,0.20)]">
                    Join takshil.dev on LinkDeck
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-xs text-white/60">{label}</div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
      />
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-white/80">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#101114] text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}