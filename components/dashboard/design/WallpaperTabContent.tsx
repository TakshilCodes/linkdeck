"use client";

import {
  ArrowDown,
  ArrowUp,
  Blend,
  CircleDot,
  Rows3,
  Sparkles,
  Square,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import CustomColorPicker from "./CustomColorPicker";
import type { CustomTheme, DefaultTheme } from "@/types/theme";
import type {
  BlurStrengthValue,
  GradientDirectionValue,
  PatternStyleValue,
  WallpaperStyleValue,
} from "@/lib/themes/theme-constants";

type Props = {
  initialCustomization?: Partial<CustomTheme> | null;
  activeTheme: DefaultTheme;
};

type Option<T extends string> = {
  id: T;
  name: string;
  Icon: LucideIcon;
};

const WALLPAPER_STYLES: Option<WallpaperStyleValue>[] = [
  { id: "FILL", name: "Fill", Icon: Square },
  { id: "GRADIENT", name: "Gradient", Icon: Blend },
  { id: "BLUR", name: "Blur", Icon: Waves },
  { id: "PATTERN", name: "Pattern", Icon: Rows3 },
];

const GRADIENT_DIRECTIONS: Option<GradientDirectionValue>[] = [
  { id: "LINEAR_UP", name: "Linear Up", Icon: ArrowUp },
  { id: "LINEAR_DOWN", name: "Linear Down", Icon: ArrowDown },
  { id: "RADIAL", name: "Radial", Icon: CircleDot },
];

const PATTERN_STYLES: Option<PatternStyleValue>[] = [
  { id: "GRID", name: "Grid", Icon: Rows3 },
  { id: "ORGANIC", name: "Organic", Icon: Sparkles },
  { id: "MATRIX", name: "Matrix", Icon: CircleDot },
];

const BLUR_STRENGTHS: BlurStrengthValue[] = ["SOFT", "MEDIUM", "STRONG"];

function selectionClass(isSelected: boolean) {
  return isSelected
    ? "border-cyan-400 bg-white/[0.08] text-white shadow-[0_0_26px_rgba(0,184,219,0.18)] ring-1 ring-cyan-400/40"
    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]";
}

function WallpaperPreview({ style }: { style: WallpaperStyleValue }) {
  if (style === "GRADIENT") {
    return <div className="h-full w-full bg-gradient-to-br from-cyan-500 via-blue-500 to-fuchsia-500" />;
  }

  if (style === "BLUR") {
    return (
      <div className="relative h-full w-full bg-gradient-to-br from-cyan-900 to-slate-950">
        <div className="absolute left-3 top-3 h-8 w-8 rounded-full bg-cyan-300/35 blur-md" />
        <div className="absolute bottom-4 right-4 h-7 w-7 rounded-full bg-white/20 blur-sm" />
      </div>
    );
  }

  if (style === "PATTERN") {
    return (
      <div className="h-full w-full bg-[#06141d]">
        <div
          className="h-full w-full opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
      </div>
    );
  }

  return <div className="h-full w-full bg-gradient-to-br from-cyan-600 to-slate-900" />;
}

function PatternPreview({ style }: { style: PatternStyleValue }) {
  if (style === "ORGANIC") {
    return (
      <div className="h-full w-full bg-gradient-to-br from-cyan-900 to-slate-950">
        <div
          className="h-full w-full opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 22%, rgba(255,255,255,0.28) 0 13%, transparent 14%), radial-gradient(circle at 78% 24%, rgba(255,255,255,0.22) 0 10%, transparent 11%), radial-gradient(circle at 34% 76%, rgba(255,255,255,0.2) 0 16%, transparent 17%), radial-gradient(circle at 76% 72%, rgba(255,255,255,0.18) 0 17%, transparent 18%)",
          }}
        />
      </div>
    );
  }

  if (style === "MATRIX") {
    return (
      <div className="h-full w-full bg-gradient-to-br from-cyan-900 to-slate-950">
        <div
          className="h-full w-full opacity-70"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.42) 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-cyan-900 to-slate-950">
      <div
        className="h-full w-full opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.26) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.26) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
}

export default function WallpaperTabContent({ initialCustomization, activeTheme }: Props) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  const wallpaperStyle = previewCustomTheme?.wallpaperStyle ?? resolvedTheme.wallpaperStyle ?? "FILL";
  const backgroundColor = previewCustomTheme?.backgroundColor ?? resolvedTheme.backgroundColor ?? "#FFFFFF";
  const backgroundColor2 = previewCustomTheme?.backgroundColor2 ?? resolvedTheme.backgroundColor2 ?? "#000000";
  const gradientDirection = previewCustomTheme?.gradientDirection ?? resolvedTheme.gradientDirection ?? "LINEAR_UP";
  const patternStyle = previewCustomTheme?.patternStyle ?? resolvedTheme.patternStyle ?? "GRID";
  const blurStrength = previewCustomTheme?.blurStrength ?? resolvedTheme.blurStrength ?? "MEDIUM";
  const patternColor = previewCustomTheme?.patternColor ?? resolvedTheme.patternColor ?? "#FFFFFF";

  return (
    <div className="flex flex-col gap-8 pb-20">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Wallpaper style</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WALLPAPER_STYLES.map(({ id, name, Icon }) => {
            const isSelected = wallpaperStyle === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => updatePreviewCustomTheme({ wallpaperStyle: id })}
                className={`group overflow-hidden rounded-2xl border text-left transition ${selectionClass(isSelected)}`}
              >
                <div className="h-24 overflow-hidden rounded-t-2xl">
                  <WallpaperPreview style={id} />
                </div>
                <div className="flex items-center gap-2 px-3 py-3 text-sm font-medium">
                  <Icon className="h-4 w-4" />
                  {name}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Background color</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-sm font-medium text-white/80">Color</label>
            <div className="flex-1">
              <CustomColorPicker
                value={backgroundColor}
                onChange={(color) => updatePreviewCustomTheme({ backgroundColor: color })}
              />
            </div>
          </div>

          {wallpaperStyle === "GRADIENT" && (
            <div className="flex items-center gap-4">
              <label className="min-w-[120px] text-sm font-medium text-white/80">Color 2</label>
              <div className="flex-1">
                <CustomColorPicker
                  value={backgroundColor2 || backgroundColor}
                  onChange={(color) => updatePreviewCustomTheme({ backgroundColor2: color })}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {wallpaperStyle === "GRADIENT" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Gradient direction</h3>
          <div className="flex flex-wrap gap-3">
            {GRADIENT_DIRECTIONS.map(({ id, name, Icon }) => {
              const isSelected = gradientDirection === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => updatePreviewCustomTheme({ gradientDirection: id })}
                  className={`flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${selectionClass(isSelected)}`}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {wallpaperStyle === "BLUR" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Blur strength</h3>
          <div className="flex flex-wrap gap-3">
            {BLUR_STRENGTHS.map((strength) => {
              const isSelected = blurStrength === strength;

              return (
                <button
                  key={strength}
                  type="button"
                  onClick={() => updatePreviewCustomTheme({ blurStrength: strength })}
                  className={`h-12 rounded-full border px-5 text-sm font-medium transition ${selectionClass(isSelected)}`}
                >
                  {strength}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {wallpaperStyle === "PATTERN" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Pattern style</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {PATTERN_STYLES.map(({ id, name, Icon }) => {
              const isSelected = patternStyle === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => updatePreviewCustomTheme({ patternStyle: id })}
                  className={`overflow-hidden rounded-2xl border text-left transition ${selectionClass(isSelected)}`}
                >
                  <div className="h-24 overflow-hidden rounded-t-2xl">
                    <PatternPreview style={id} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-3 text-sm font-medium">
                    <Icon className="h-4 w-4" />
                    {name}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {wallpaperStyle === "PATTERN" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Pattern color</h3>
          <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-sm font-medium text-white/80">Color</label>
            <div className="flex-1">
              <CustomColorPicker
                value={patternColor}
                onChange={(color) => updatePreviewCustomTheme({ patternColor: color })}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}