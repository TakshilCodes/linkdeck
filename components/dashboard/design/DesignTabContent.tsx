"use client";

import { useState, useTransition, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Undo2, Redo2, Paintbrush, LayoutTemplate, Image as ImageIcon, Type, Square, Palette, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import CustomColorPicker from "./CustomColorPicker";
import HeaderTabContent from "./HeaderTabContent";
import TextTabContent from "./TextTabContent";
import ButtonTabContent from "./ButtonTabContent";

import type { DefaultTheme } from "@/types/theme";
import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import { saveThemeAction } from "@/actions/dashboard/design";
import { saveHeaderDesignAction } from "@/actions/dashboard/header";
import { saveWallpaperDesignAction } from "@/actions/dashboard/wallpaper";
import { saveButtonsDesignAction } from "@/actions/dashboard/buttons";

type ThemeItem = DefaultTheme;

type Props = {
  themes: ThemeItem[];
  currentThemeId?: string | null;
  initialProfile?: any;
  initialCustomization?: any;
};

const CUSTOM_BASE_THEME: ThemeItem = {
  id: "custom",
  name: "Custom",
  slug: "custom",
  previewImgUrl: null,
  isDefault: false,
  wallpaperStyle: "FILL",
  backgroundColor: "#ffffff",
  backgroundColor2: null,
  gradientDirection: null,
  patternStyle: null,
  blurStrength: null,
  fontFamily: "INTER",
  titleFontFamily: "INTER",
  buttonStyle: "SOLID",
  buttonRadius: "ROUND",
  buttonShadow: "NONE",
  buttonColor: "#000000",
  buttonTextColor: "#ffffff",
  shadowColor: null,
  patternColor: null,
  outlineColor: null,
  titleFontSize: "MEDIUM",
  titleColor: "#000000",
  titleFontWeight: "MEDIUM",
  profileFontSize: "SMALL",
  profileColor: "#666666",
  bioColor: "#ffffff",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const SIDEBAR_ITEMS = [
  { id: "theme", label: "Theme", icon: LayoutTemplate },
  { id: "header", label: "Header", icon: MousePointerClick },
  { id: "wallpaper", label: "Wallpaper", icon: ImageIcon },
  { id: "text", label: "Text", icon: Type },
  { id: "buttons", label: "Buttons", icon: Square },
  { id: "colors", label: "Colors", icon: Palette },
];

// Wallpaper Tab Content Component
function WallpaperTabContent({
  initialCustomization,
  activeTheme,
}: {
  initialCustomization: any;
  activeTheme: ThemeItem;
}) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();
  
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  const wallpaperStyle = previewCustomTheme?.wallpaperStyle ?? resolvedTheme.wallpaperStyle;
  const backgroundColor = previewCustomTheme?.backgroundColor ?? resolvedTheme.backgroundColor ?? "#FFFFFF";
  const backgroundColor2 = previewCustomTheme?.backgroundColor2 ?? resolvedTheme.backgroundColor2 ?? "#000000";
  const gradientDirection = previewCustomTheme?.gradientDirection ?? resolvedTheme.gradientDirection ?? "LINEAR_UP";
  const patternStyle = previewCustomTheme?.patternStyle ?? resolvedTheme.patternStyle ?? "GRID";
  const blurStrength = previewCustomTheme?.blurStrength ?? resolvedTheme.blurStrength ?? "MEDIUM";
  const patternColor = previewCustomTheme?.patternColor ?? resolvedTheme.patternColor ?? "#FFFFFF";
  const shadowColor = previewCustomTheme?.shadowColor ?? resolvedTheme.shadowColor ?? "#000000";
  const outlineColor = previewCustomTheme?.outlineColor ?? resolvedTheme.outlineColor ?? "#FFFFFF";

  const wallpaperStyles = [
    { id: 'FILL', name: 'Fill', icon: '■' },
    { id: 'GRADIENT', name: 'Gradient', icon: '▬' },
    { id: 'BLUR', name: 'Blur', icon: '◉' },
    { id: 'PATTERN', name: 'Pattern', icon: '▦' }
  ];

  const gradientDirections = [
    { id: 'LINEAR_UP', name: 'Linear Up', icon: '↑' },
    { id: 'LINEAR_DOWN', name: 'Linear Down', icon: '↓' },
    { id: 'RADIAL', name: 'Radial', icon: '⊙' }
  ];

  const patternStyles = [
    { id: 'GRID', name: 'Grid', icon: '⊞' },
    { id: 'ORGANIC', name: 'Organic', icon: '✦' },
    { id: 'MATRIX', name: 'Matrix', icon: '⊡' }
  ];

  const handleWallpaperStyleChange = (style: string) => {
    updatePreviewCustomTheme({ wallpaperStyle: style as any });
  };

  const handleBackgroundColorChange = (color: string) => {
    updatePreviewCustomTheme({ backgroundColor: color });
  };

  const handleBackgroundColor2Change = (color: string) => {
    updatePreviewCustomTheme({ backgroundColor2: color });
  };

  const handleGradientDirectionChange = (direction: string) => {
    updatePreviewCustomTheme({ gradientDirection: direction as any });
  };

  const handlePatternStyleChange = (style: string) => {
    updatePreviewCustomTheme({ patternStyle: style as any });
  };

  const handleBlurStrengthChange = (strength: string) => {
    updatePreviewCustomTheme({ blurStrength: strength as any });
  };

  const handlePatternColorChange = (color: string) => {
    updatePreviewCustomTheme({ patternColor: color });
  };

  const handleShadowColorChange = (color: string) => {
    updatePreviewCustomTheme({ shadowColor: color });
  };

  const handleOutlineColorChange = (color: string) => {
    updatePreviewCustomTheme({ outlineColor: color });
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Wallpaper Style Section */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Wallpaper style</h3>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {wallpaperStyles.map((style) => {
            const isSelected = wallpaperStyle === style.id;
            return (
              <div key={style.id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleWallpaperStyleChange(style.id)}
                  className={`relative h-24 w-24 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isSelected 
                      ? 'border-violet-500 bg-gradient-to-br from-violet-900 to-purple-900 shadow-lg shadow-violet-500/25 ring-2 ring-violet-400 ring-offset-2 ring-offset-violet-900' 
                      : 'border-violet-300/50 bg-gradient-to-br from-violet-800 to-purple-800 hover:border-violet-400 hover:from-violet-700 hover:to-purple-700'
                  }`}
                >
                  {/* Visual preview of wallpaper style */}
                  <div className="h-full w-full">
                    {style.id === 'FILL' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-700 to-purple-700" />
                    )}
                    {style.id === 'GRADIENT' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500" />
                    )}
                    {style.id === 'BLUR' && (
                      <div className="relative h-full w-full bg-gradient-to-br from-violet-700 to-purple-700">
                        <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-white/20 blur-sm" />
                        <div className="absolute bottom-3 right-3 h-4 w-4 rounded-full bg-white/15 blur-xs" />
                      </div>
                    )}
                    {style.id === 'PATTERN' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-700 to-purple-700">
                        <div className="h-full w-full opacity-40" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 8px)',
                        }} />
                      </div>
                    )}
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-500 shadow-md flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
                
                {/* Label below button */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isSelected ? 'text-violet-400' : 'text-gray-400'
                }`}>
                  {style.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Background Color Section */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Background color</h3>
        
        <div className="space-y-4">
          {/* Primary Background Color */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-white/80 min-w-[120px]">Color</label>
            <div className="flex-1">
              <CustomColorPicker
                value={backgroundColor || "#f5f5f4"}
                onChange={handleBackgroundColorChange}
              />
            </div>
          </div>

          {/* Secondary Background Color (for gradients) */}
          {(wallpaperStyle === 'GRADIENT') && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-white/80 min-w-[120px]">Color 2</label>
              <div className="flex-1">
                <CustomColorPicker
                  value={backgroundColor2 || backgroundColor || "#f5f5f4"}
                  onChange={handleBackgroundColor2Change}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gradient Direction Section (only show when gradient is selected) */}
      {wallpaperStyle === 'GRADIENT' && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Gradient direction</h3>
        <div className="flex flex-wrap gap-3">
          {gradientDirections.map((direction) => {
            const isSelected = gradientDirection === direction.id;
            return (
              <div key={direction.id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGradientDirectionChange(direction.id)}
                  className={`h-12 w-20 rounded-full border-2 transition-all duration-200 overflow-hidden ${
                    isSelected 
                      ? 'border-violet-500 bg-gradient-to-br from-violet-900 to-purple-900 shadow-lg shadow-violet-500/25 scale-105' 
                      : 'border-violet-300/50 bg-gradient-to-br from-violet-800 to-purple-800 hover:border-violet-400 hover:from-violet-700 hover:to-purple-700'
                  }`}
                >
                  {/* Visual preview of gradient direction */}
                  <div className="h-full w-full">
                    {direction.id === 'LINEAR_UP' && (
                      <div className="h-full w-full bg-gradient-to-t from-violet-600 to-purple-600" />
                    )}
                    {direction.id === 'LINEAR_DOWN' && (
                      <div className="h-full w-full bg-gradient-to-b from-violet-600 to-purple-600" />
                    )}
                    {direction.id === 'RADIAL' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-600 to-purple-600" />
                    )}
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-violet-500 shadow-md flex items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-white" />
                    </div>
                  )}
                </button>
                
                {/* Label below button */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isSelected ? 'text-violet-400' : 'text-gray-400'
                }`}>
                  {direction.name}
                </span>
              </div>
            );
          })}
        </div>
        </section>
      )}

      {/* Blur Strength Section (only show when blur is selected) */}
      {wallpaperStyle === 'BLUR' && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Blur strength</h3>
        <div className="flex flex-wrap gap-3">
          {(['SOFT', 'MEDIUM', 'STRONG'] as const).map((strength) => {
            const isSelected = blurStrength === strength;
            return (
              <button
                key={strength}
                type="button"
                onClick={() => handleBlurStrengthChange(strength)}
                className={`h-12 w-20 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  isSelected 
                    ? 'border-violet-500 bg-gradient-to-br from-violet-900 to-purple-900 shadow-lg shadow-violet-500/25 scale-105' 
                    : 'border-violet-300/50 bg-gradient-to-br from-violet-800 to-purple-800 hover:border-violet-400 hover:from-violet-700 hover:to-purple-700'
                }`}
              >
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isSelected ? 'text-violet-400' : 'text-gray-300'
                }`}>
                  {strength}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-violet-500 shadow-md flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        </section>
      )}

      {/* Pattern Style Section (only show when pattern is selected) */}
      {wallpaperStyle === 'PATTERN' && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Pattern style</h3>
        <div className="flex flex-wrap gap-3">
          {patternStyles.map((style) => {
            const isSelected = patternStyle === style.id;
            return (
              <div key={style.id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePreviewCustomTheme({ patternStyle: style.id as any })}
                  className={`relative h-24 w-24 rounded-full border-2 transition-all duration-200 overflow-hidden ${
                    isSelected 
                      ? 'border-violet-500 bg-gradient-to-br from-violet-900 to-purple-900 shadow-lg shadow-violet-500/25 scale-105' 
                      : 'border-violet-300/50 bg-gradient-to-br from-violet-800 to-purple-800 hover:border-violet-400 hover:from-violet-700 hover:to-purple-700'
                  }`}
                >
                  {/* Visual preview of pattern style */}
                  <div className="h-full w-full">
                    {style.id === 'GRID' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-700 to-purple-700">
                        <div className="h-full w-full opacity-50" style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.25) 8px, rgba(255,255,255,0.25) 10px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.25) 8px, rgba(255,255,255,0.25) 10px)',
                        }} />
                      </div>
                    )}
                    {style.id === 'ORGANIC' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-700 to-purple-700">
                        <div className="h-full w-full opacity-65" style={{
                          backgroundImage: `
                            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.24) 0 14%, transparent 15%),
                            radial-gradient(circle at 80% 18%, rgba(255,255,255,0.22) 0 11%, transparent 12%),
                            radial-gradient(circle at 32% 78%, rgba(255,255,255,0.2) 0 16%, transparent 17%),
                            radial-gradient(circle at 76% 72%, rgba(255,255,255,0.18) 0 18%, transparent 19%)
                          `,
                        }} />
                      </div>
                    )}
                    {style.id === 'MATRIX' && (
                      <div className="h-full w-full bg-gradient-to-br from-violet-700 to-purple-700">
                        <div className="h-full w-full opacity-60" style={{
                          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)',
                          backgroundSize: '12px 12px',
                          backgroundPosition: '0 0, 6px 6px'
                        }} />
                      </div>
                    )}
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-500 shadow-md flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
                
                {/* Label below button */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isSelected ? 'text-violet-400' : 'text-gray-400'
                }`}>
                  {style.name}
                </span>
              </div>
            );
          })}
        </div>
        </section>
      )}

      {/* Pattern Color Section (only show when pattern is selected) */}
      {wallpaperStyle === 'PATTERN' && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Pattern color</h3>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-white/80 min-w-[120px]">Color</label>
            <div className="flex-1">
              <CustomColorPicker
                value={patternColor || "#FFFFFF"}
                onChange={handlePatternColorChange}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function DesignTabContent({ themes, currentThemeId, initialProfile, initialCustomization }: Props) {
  const [activeSidebarItem, setActiveSidebarItem] = useState("theme");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const {
    previewTheme,
    setPreviewTheme,
    previewProfile,
    setPreviewProfile,
    previewCustomTheme,
    setPreviewCustomTheme,
    updatePreviewCustomTheme,
  } = useDesignStore();

  // Keep design preview state scoped to this page so stale Zustand data
  // does not make the Save button re-enable after navigation.
  useEffect(() => {
    setPreviewTheme(null);
    setPreviewProfile(null);
    setPreviewCustomTheme(null);

    return () => {
      setPreviewTheme(null);
      setPreviewProfile(null);
      setPreviewCustomTheme(null);
    };
  }, [setPreviewCustomTheme, setPreviewProfile, setPreviewTheme]);

  const activeTheme =
    previewTheme ??
    themes.find((theme) => theme.id === currentThemeId) ??
    CUSTOM_BASE_THEME;

  const savedTheme =
    themes.find((theme) => theme.id === currentThemeId) ??
    CUSTOM_BASE_THEME;

  const savedThemeId = currentThemeId ?? "custom";
  const selectedThemeId = previewTheme?.id ?? savedThemeId;
  const hasThemeSelectionChange = selectedThemeId !== savedThemeId;

  const savedResolvedTheme = useMemo(
    () => mergeTheme(savedTheme, initialCustomization ?? null),
    [savedTheme, initialCustomization]
  );

  const currentResolvedTheme = useMemo(() => {
    const effectiveCurrentCustomization = hasThemeSelectionChange
      ? (previewCustomTheme ?? null)
      : { ...(initialCustomization ?? {}), ...(previewCustomTheme ?? {}) };

    return mergeTheme(activeTheme, effectiveCurrentCustomization);
  }, [activeTheme, hasThemeSelectionChange, initialCustomization, previewCustomTheme]);

  const savedProfileSnapshot = useMemo(
    () => ({
      displayName: initialProfile?.displayName ?? initialProfile?.username ?? "",
      bio: initialProfile?.bio ?? "",
    }),
    [initialProfile]
  );

  const currentProfileSnapshot = useMemo(
    () => ({
      displayName: previewProfile?.displayName ?? savedProfileSnapshot.displayName,
      bio: previewProfile?.bio ?? savedProfileSnapshot.bio,
    }),
    [previewProfile, savedProfileSnapshot]
  );

  const themeFieldsToCompare: (keyof ThemeItem)[] = [
    "wallpaperStyle",
    "backgroundColor",
    "backgroundColor2",
    "gradientDirection",
    "patternStyle",
    "blurStrength",
    "fontFamily",
    "titleFontFamily",
    "buttonStyle",
    "buttonRadius",
    "buttonShadow",
    "buttonColor",
    "buttonTextColor",
    "shadowColor",
    "patternColor",
    "outlineColor",
    "titleFontSize",
    "titleColor",
    "titleFontWeight",
    "profileFontSize",
    "profileColor",
    "bioColor",
  ];

  const hasThemeCustomizationChanges = themeFieldsToCompare.some(
    (field) => currentResolvedTheme[field] !== savedResolvedTheme[field]
  );

  const hasProfileChanges =
    currentProfileSnapshot.displayName !== savedProfileSnapshot.displayName ||
    currentProfileSnapshot.bio !== savedProfileSnapshot.bio;

  const shouldEnableSave =
    hasThemeSelectionChange || hasThemeCustomizationChanges || hasProfileChanges;

  // Custom Dropdown Components
  const FONT_FAMILY_OPTIONS = [
    { value: "INTER", label: "Inter" },
    { value: "POPPINS", label: "Poppins" },
    { value: "MONTSERRAT", label: "Montserrat" },
    { value: "ROBOTO", label: "Roboto" },
    { value: "PLAYFAIR", label: "Playfair Display" },
    { value: "OUTFIT", label: "Outfit" }
  ];

  const FONT_SIZE_OPTIONS = [
    { value: "12", label: "12px" },
    { value: "14", label: "14px" },
    { value: "16", label: "16px" },
    { value: "18", label: "18px" },
    { value: "20", label: "20px" },
    { value: "24", label: "24px" }
  ];

  const FONT_WEIGHT_OPTIONS = [
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" }
  ];

  // Custom Dropdown Component
  function CustomDropdown({ 
    value, 
    onChange, 
    options,
    label 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    options: { value: string; label: string }[]; 
    label?: string;
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(f => f.value === value);
    const displayText = selectedOption ? selectedOption.label : label || 'Select option';

    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-full appearance-none rounded-2xl border border-violet-300/50 bg-violet-900/50 px-4 text-left text-violet-200 text-[15px] outline-none transition focus:border-violet-400 flex items-center justify-between"
        >
          <span>{displayText}</span>
          <svg 
            className={`h-4 w-4 text-violet-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl border border-violet-300/50 bg-violet-900/50 shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-scroll scrollbar-hide">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-violet-200 text-[15px] transition ${
                      isSelected ? 'bg-violet-500/20 text-violet-100' : 'hover:bg-violet-500/10'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "theme";
      if (SIDEBAR_ITEMS.some((i) => i.id === hash)) {
        setActiveSidebarItem(hash);
      }
    };
    handleHashChange(); // Run on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const effectiveCustomization = hasThemeSelectionChange ? null : initialCustomization;
  const resolvedActiveTheme = mergeTheme(activeTheme, effectiveCustomization ?? null);

  const handleSave = async () => {
    startTransition(async () => {
      try {
        if (hasThemeSelectionChange && selectedThemeId) {
          await saveThemeAction(selectedThemeId);
        }

        const headerData: any = {};
        if (currentProfileSnapshot.displayName !== savedProfileSnapshot.displayName) {
          headerData.displayName = currentProfileSnapshot.displayName;
        }
        if (currentProfileSnapshot.bio !== savedProfileSnapshot.bio) {
          headerData.bio = currentProfileSnapshot.bio;
        }
        if (currentResolvedTheme.titleColor !== savedResolvedTheme.titleColor) {
          headerData.titleColor = currentResolvedTheme.titleColor;
        }
        if (currentResolvedTheme.titleFontFamily !== savedResolvedTheme.titleFontFamily) {
          headerData.titleFontFamily = currentResolvedTheme.titleFontFamily;
        }
        if (currentResolvedTheme.titleFontWeight !== savedResolvedTheme.titleFontWeight) {
          headerData.titleFontWeight = currentResolvedTheme.titleFontWeight;
        }
        if (currentResolvedTheme.titleFontSize !== savedResolvedTheme.titleFontSize) {
          headerData.titleFontSize = currentResolvedTheme.titleFontSize;
        }
        if (currentResolvedTheme.profileFontSize !== savedResolvedTheme.profileFontSize) {
          headerData.profileFontSize = currentResolvedTheme.profileFontSize;
        }
        if (currentResolvedTheme.profileColor !== savedResolvedTheme.profileColor) {
          headerData.profileColor = currentResolvedTheme.profileColor;
        }
        if (currentResolvedTheme.bioColor !== savedResolvedTheme.bioColor) {
          headerData.bioColor = currentResolvedTheme.bioColor;
        }
        if (currentResolvedTheme.fontFamily !== savedResolvedTheme.fontFamily) {
          headerData.fontFamily = currentResolvedTheme.fontFamily;
        }

        if (Object.keys(headerData).length > 0) {
          await saveHeaderDesignAction(headerData);
        }

        const wallpaperData: any = {};
        if (currentResolvedTheme.wallpaperStyle !== savedResolvedTheme.wallpaperStyle) {
          wallpaperData.wallpaperStyle = currentResolvedTheme.wallpaperStyle;
        }
        if (currentResolvedTheme.backgroundColor !== savedResolvedTheme.backgroundColor) {
          wallpaperData.backgroundColor = currentResolvedTheme.backgroundColor;
        }
        if (currentResolvedTheme.backgroundColor2 !== savedResolvedTheme.backgroundColor2) {
          wallpaperData.backgroundColor2 = currentResolvedTheme.backgroundColor2;
        }
        if (currentResolvedTheme.gradientDirection !== savedResolvedTheme.gradientDirection) {
          wallpaperData.gradientDirection = currentResolvedTheme.gradientDirection;
        }
        if (currentResolvedTheme.patternStyle !== savedResolvedTheme.patternStyle) {
          wallpaperData.patternStyle = currentResolvedTheme.patternStyle;
        }
        if (currentResolvedTheme.blurStrength !== savedResolvedTheme.blurStrength) {
          wallpaperData.blurStrength = currentResolvedTheme.blurStrength;
        }
        if (currentResolvedTheme.patternColor !== savedResolvedTheme.patternColor) {
          wallpaperData.patternColor = currentResolvedTheme.patternColor;
        }

        if (Object.keys(wallpaperData).length > 0) {
          await saveWallpaperDesignAction(wallpaperData);
        }

        const buttonData: any = {};
        if (currentResolvedTheme.buttonStyle !== savedResolvedTheme.buttonStyle) {
          buttonData.buttonStyle = currentResolvedTheme.buttonStyle;
        }
        if (currentResolvedTheme.buttonRadius !== savedResolvedTheme.buttonRadius) {
          buttonData.buttonRadius = currentResolvedTheme.buttonRadius;
        }
        if (currentResolvedTheme.buttonShadow !== savedResolvedTheme.buttonShadow) {
          buttonData.buttonShadow = currentResolvedTheme.buttonShadow;
        }
        if (currentResolvedTheme.buttonColor !== savedResolvedTheme.buttonColor) {
          buttonData.buttonColor = currentResolvedTheme.buttonColor;
        }
        if (currentResolvedTheme.buttonTextColor !== savedResolvedTheme.buttonTextColor) {
          buttonData.buttonTextColor = currentResolvedTheme.buttonTextColor;
        }
        if (currentResolvedTheme.shadowColor !== savedResolvedTheme.shadowColor) {
          buttonData.shadowColor = currentResolvedTheme.shadowColor;
        }
        if (currentResolvedTheme.outlineColor !== savedResolvedTheme.outlineColor) {
          buttonData.outlineColor = currentResolvedTheme.outlineColor;
        }

        if (Object.keys(buttonData).length > 0) {
          await saveButtonsDesignAction(buttonData);
        }

        toast.success("Changes saved successfully!");
        setPreviewTheme(null);
        setPreviewProfile(null);
        setPreviewCustomTheme(null);
        router.refresh();
      } catch (error) {
        toast.error("Failed to save changes");
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top Header */}
      <div className="-mx-4 mb-6 flex items-center justify-between border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 lg:-mx-8">
        <h1 className="text-2xl font-semibold text-white">Design</h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleSave}
            disabled={isPending || !shouldEnableSave}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 flex-col gap-8 md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full shrink-0 md:w-32 lg:w-40 flex flex-row md:flex-col gap-1 overflow-x-auto border-b border-white/10 md:border-b-0 md:border-r pb-4 md:pb-0 pr-0 md:pr-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSidebarItem(item.id);
                  window.location.hash = item.id;
                }}
                className={`flex flex-col md:flex-row items-center gap-2 md:gap-3 rounded-xl p-3 text-xs md:text-sm transition ${isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeSidebarItem === "theme" && (
            <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {/* Custom Card */}
              <button 
                type="button" 
                onClick={() => {
                  setPreviewTheme(CUSTOM_BASE_THEME);
                  setPreviewCustomTheme(null);
                }}
                className="group text-left"
              >
                <div
                  className={`relative overflow-hidden rounded-[26px] border transition-all duration-200 ${
                    selectedThemeId === "custom"
                      ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-9/16 w-full overflow-hidden rounded-[26px]">
                    {selectedThemeId === "custom" && (
                      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex h-full w-full items-center justify-center bg-[#111b28] text-sm text-white/35">
                      {selectedThemeId === "custom" ? "Custom" : "Select Theme"}
                    </div>
                  </div>
                </div>
              </button>
              {/* Theme Cards */}
              {themes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setPreviewTheme(theme as any);
                      setPreviewCustomTheme(null);
                    }}
                    className="group text-left"
                  >
                    <div
                      className={`relative overflow-hidden rounded-[26px] border transition-all duration-200 ${isSelected
                        ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                        : "border-white/10 hover:border-white/25"
                        }`}
                    >
                      <div className="relative aspect-9/16 w-full overflow-hidden rounded-[26px]">
                        {theme.previewImgUrl ? (
                          <Image
                            src={theme.previewImgUrl}
                            alt={theme.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#111b28] text-sm text-white/35">
                            {theme.name.slice(0, 2)}
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

                        {isSelected && (
                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-lg">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 px-1 text-center">
                      <p className="truncate text-sm font-medium text-white/80">
                        {theme.name}
                      </p>
                    </div>
                  </button>
                );
            })}
            </div>
          )}

          {activeSidebarItem === "header" && (
            <HeaderTabContent 
               key={`header-${selectedThemeId ?? "current"}`}
               initialProfile={initialProfile || {}}
               initialCustomization={effectiveCustomization || {}}
               activeTheme={activeTheme}
            />
          )}

          {activeSidebarItem === "text" && (
            <TextTabContent 
               key={`text-${selectedThemeId ?? "current"}`}
               initialCustomization={effectiveCustomization || {}}
               activeTheme={activeTheme}
            />
          )}

          {activeSidebarItem === "wallpaper" && (
            <WallpaperTabContent 
               initialCustomization={effectiveCustomization || {}}
               activeTheme={activeTheme}
            />
          )}

          {activeSidebarItem === "colors" && (
            <div className="flex flex-col gap-4 pb-20">
              {/* Background Colors */}
              <section className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white/90">Background Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Primary Background</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.backgroundColor ?? resolvedActiveTheme.backgroundColor ?? '#FFFFFF'}
                      onChange={(color) => updatePreviewCustomTheme({ backgroundColor: color })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Secondary Background</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.backgroundColor2 ?? resolvedActiveTheme.backgroundColor2 ?? '#000000'}
                      onChange={(color) => updatePreviewCustomTheme({ backgroundColor2: color })}
                    />
                  </div>
                </div>
              </section>

              {/* Text Colors */}
              <section className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white/90">Text Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.titleColor ?? resolvedActiveTheme.titleColor ?? '#000000'}
                      onChange={(color) => updatePreviewCustomTheme({ titleColor: color })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Profile Text Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.profileColor ?? resolvedActiveTheme.profileColor ?? '#666666'}
                      onChange={(color) => updatePreviewCustomTheme({ profileColor: color })}
                    />
                  </div>
                </div>
              </section>

              {/* Button Colors */}
              <section className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white/90">Button Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Button Background</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.buttonColor ?? resolvedActiveTheme.buttonColor ?? '#000000'}
                      onChange={(color) => updatePreviewCustomTheme({ buttonColor: color })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Button Text Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.buttonTextColor ?? resolvedActiveTheme.buttonTextColor ?? '#FFFFFF'}
                      onChange={(color) => updatePreviewCustomTheme({ buttonTextColor: color })}
                    />
                  </div>
                </div>
              </section>

              {/* Effect Colors */}
              <section className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white/90">Effect Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Shadow Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.shadowColor ?? resolvedActiveTheme.shadowColor ?? '#000000'}
                      onChange={(color) => updatePreviewCustomTheme({ shadowColor: color })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Pattern Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.patternColor ?? resolvedActiveTheme.patternColor ?? '#FFFFFF'}
                      onChange={(color) => updatePreviewCustomTheme({ patternColor: color })}
                    />
                  </div>
                </div>
              </section>

              {/* Additional Colors */}
              <section className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white/90">Additional Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Outline Color</label>
                    <CustomColorPicker
                      value={previewCustomTheme?.outlineColor ?? resolvedActiveTheme.outlineColor ?? '#FFFFFF'}
                      onChange={(color) => updatePreviewCustomTheme({ outlineColor: color })}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeSidebarItem === "buttons" && (
            <ButtonTabContent 
               key={`buttons-${selectedThemeId ?? "current"}`}
               initialCustomization={effectiveCustomization || {}}
               activeTheme={activeTheme}
            />
          )}

        </div>
      </div>
    </div>
  );
}
