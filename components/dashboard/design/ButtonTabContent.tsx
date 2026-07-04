"use client";

import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import CustomColorPicker from "./CustomColorPicker";
import type { CustomTheme, DefaultTheme } from "@/types/theme";
import type { ButtonRadiusValue, ButtonShadowValue, ButtonStyleValue } from "@/lib/themes/theme-constants";

type Props = {
  initialCustomization?: Partial<CustomTheme> | null;
  activeTheme: DefaultTheme;
};

export default function ButtonTabContent({ initialCustomization, activeTheme }: Props) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  const buttonStyle = previewCustomTheme?.buttonStyle ?? resolvedTheme.buttonStyle ?? "SOLID";
  const buttonRadius = previewCustomTheme?.buttonRadius ?? resolvedTheme.buttonRadius ?? "ROUND";
  const buttonShadow = previewCustomTheme?.buttonShadow ?? resolvedTheme.buttonShadow ?? "NONE";
  const buttonColor = previewCustomTheme?.buttonColor ?? resolvedTheme.buttonColor ?? "#9CA3AF";
  const buttonTextColor = previewCustomTheme?.buttonTextColor ?? resolvedTheme.buttonTextColor ?? "#ffffff";
  const outlineColor = previewCustomTheme?.outlineColor ?? resolvedTheme.outlineColor ?? "#111111";
  const shadowColor = previewCustomTheme?.shadowColor ?? resolvedTheme.shadowColor ?? "#000000";

  // Dispatch updates
  const handleStyleChange = (style: ButtonStyleValue) => updatePreviewCustomTheme({ buttonStyle: style });
  const handleRadiusChange = (radius: ButtonRadiusValue) => updatePreviewCustomTheme({ buttonRadius: radius });
  const handleShadowChange = (shadow: ButtonShadowValue) => updatePreviewCustomTheme({ buttonShadow: shadow });
  const handleColorChange = (color: string) => updatePreviewCustomTheme({ buttonColor: color });
  const handleTextColorChange = (color: string) => updatePreviewCustomTheme({ buttonTextColor: color });
  const handleOutlineColorChange = (color: string) => updatePreviewCustomTheme({ outlineColor: color });
  const handleShadowColorChange = (color: string) => updatePreviewCustomTheme({ shadowColor: color });

  return (
    <div className="flex flex-col gap-8 pb-20">
      
      {/* Button Style */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-white/90">Button style</h3>
        <div className="grid grid-cols-3 gap-3">
          
          {/* SOLID */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleStyleChange("SOLID")}
              className={`relative h-24 w-full rounded-2xl border transition-all duration-200 overflow-hidden flex items-center justify-center p-3 bg-[#1a1a1a] ${
                buttonStyle === "SOLID" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="w-full h-10 bg-[#333333] rounded-full" />
            </button>
            <span className="text-center text-sm font-medium text-white/70">Solid</span>
          </div>

          {/* GLASS */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleStyleChange("GLASS")}
              className={`relative h-24 w-full rounded-2xl border transition-all duration-200 overflow-hidden flex items-center justify-center p-3 bg-[#111111] ${
                buttonStyle === "GLASS" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="w-full h-10 border border-white/20 bg-white/5 rounded-full" />
            </button>
            <span className="text-center text-sm font-medium text-white/70">Glass</span>
          </div>

          {/* OUTLINE */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleStyleChange("OUTLINE")}
              className={`relative h-24 w-full rounded-2xl border transition-all duration-200 overflow-hidden flex items-center justify-center p-3 bg-[#1a1a1a] ${
                buttonStyle === "OUTLINE" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="w-full h-10 border-2 border-[#555555] rounded-full" />
            </button>
            <span className="text-center text-sm font-medium text-white/70">Outline</span>
          </div>

        </div>
      </section>

      {/* Corner Roundness */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-white/90">Corner roundness</h3>
        <div className="grid grid-cols-4 gap-2">
          
          {/* SQUARE */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRadiusChange("SQUARE")}
              className={`h-12 w-full rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#1a1a1a] ${
                buttonRadius === "SQUARE" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Square Corner Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M8 8h8v8" />
              </svg>
            </button>
            <span className="text-center text-[13px] font-medium text-white/70">Square</span>
          </div>

          {/* ROUND */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRadiusChange("ROUND")}
              className={`h-12 w-full rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#1a1a1a] ${
                buttonRadius === "ROUND" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Round Corner Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M8 16V12a4 4 0 0 1 4-4h4" />
              </svg>
            </button>
            <span className="text-center text-[13px] font-medium text-white/70">Round</span>
          </div>

          {/* ROUNDER */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRadiusChange("ROUNDER")}
              className={`h-12 w-full rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#1a1a1a] ${
                buttonRadius === "ROUNDER" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Rounder Corner Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M8 16v-2a6 6 0 0 1 6-6h2" />
              </svg>
            </button>
            <span className="text-center text-[13px] font-medium text-white/70">Rounder</span>
          </div>

          {/* FULL */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRadiusChange("FULL")}
              className={`h-12 w-full rounded-xl border transition-all duration-200 flex items-center justify-center bg-[#1a1a1a] ${
                buttonRadius === "FULL" 
                  ? "border-cyan-400 ring-1 ring-cyan-400" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Full Corner Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M8 16a8 8 0 0 1 8-8" />
              </svg>
            </button>
            <span className="text-center text-[13px] font-medium text-white/70">Full</span>
          </div>

        </div>
      </section>

      {/* Button Shadow (Only visible if style is SOLID) */}
      {buttonStyle === "SOLID" && (
        <section className="space-y-4">
          <h3 className="text-[15px] font-semibold text-white/90">Button shadow</h3>
          <div className="grid grid-cols-4 gap-2">
            {(["NONE", "SOFT", "STRONG", "HARD"] as const).map((shadowOpt) => (
              <button
                key={shadowOpt}
                onClick={() => handleShadowChange(shadowOpt)}
                className={`h-12 w-full rounded-xl border transition-all duration-200 flex items-center justify-center text-[13px] font-medium ${
                  buttonShadow === shadowOpt 
                    ? "border-cyan-400 bg-[#1a1a1a] text-white ring-1 ring-cyan-400" 
                    : "border-white/10 bg-[#1a1a1a] text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {shadowOpt.charAt(0) + shadowOpt.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Button Color */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-white/90">Button color</h3>
        <CustomColorPicker value={buttonColor} onChange={handleColorChange} />
      </section>

      {/* Button Text Color */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-white/90">Button text color</h3>
        <CustomColorPicker value={buttonTextColor} onChange={handleTextColorChange} />
      </section>

      {/* Outline Color (Only visible if style is OUTLINE) */}
      {buttonStyle === "OUTLINE" && (
        <section className="space-y-4">
          <h3 className="text-[15px] font-semibold text-white/90">Outline color</h3>
          <CustomColorPicker value={outlineColor} onChange={handleOutlineColorChange} />
        </section>
      )}

      {/* Shadow Color (Only visible if shadow is not NONE) */}
      {buttonStyle === "SOLID" && buttonShadow !== "NONE" && (
        <section className="space-y-4">
          <h3 className="text-[15px] font-semibold text-white/90">Shadow color</h3>
          <CustomColorPicker value={shadowColor} onChange={handleShadowColorChange} />
        </section>
      )}

    </div>
  );
}
