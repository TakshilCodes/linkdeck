"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, ChevronLeft, LayoutTemplate, Image as ImageIcon, Type, Square, Palette, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import HeaderTabContent from "./HeaderTabContent";
import TextTabContent from "./TextTabContent";
import ButtonTabContent from "./ButtonTabContent";
import ColorsTabContent from "./ColorsTabContent";
import WallpaperTabContent from "./WallpaperTabContent";
import BottomSheet from "@/components/ui/BottomSheet";

import type { CustomTheme, DefaultTheme } from "@/types/theme";
import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import { saveThemeAction } from "@/actions/dashboard/design";
import { saveHeaderDesignAction } from "@/actions/dashboard/header";
import { saveWallpaperDesignAction } from "@/actions/dashboard/wallpaper";
import { saveButtonsDesignAction } from "@/actions/dashboard/buttons";

type ThemeItem = DefaultTheme;

type InitialProfile = {
  username?: string | null;
  displayName?: string | null;
  profileImgUrl?: string | null;
  bio?: string | null;
};

type Props = {
  themes: ThemeItem[];
  currentThemeId?: string | null;
  initialProfile?: InitialProfile | null;
  initialCustomization?: Partial<CustomTheme> | null;
};

type HeaderSavePayload = Parameters<typeof saveHeaderDesignAction>[0];
type WallpaperSavePayload = Parameters<typeof saveWallpaperDesignAction>[0];
type ButtonsSavePayload = Parameters<typeof saveButtonsDesignAction>[0];

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
  iconColor: "#666666",
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


export default function DesignTabContent({ themes, currentThemeId, initialProfile, initialCustomization }: Props) {
  const [activeSidebarItem, setActiveSidebarItem] = useState("theme");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const {
    previewTheme,
    setPreviewTheme,
    previewProfile,
    setPreviewProfile,
    previewCustomTheme,
    setPreviewCustomTheme,
    setMobileDesignPanelOpen,
  } = useDesignStore();

  // Keep design preview state scoped to this page so stale Zustand data
  // does not make the Save button re-enable after navigation.
  useEffect(() => {
    setPreviewTheme(null);
    setPreviewProfile(null);
    setPreviewCustomTheme(null);
    setMobileDesignPanelOpen(false);

    return () => {
      setPreviewTheme(null);
      setPreviewProfile(null);
      setPreviewCustomTheme(null);
      setMobileDesignPanelOpen(false);
    };
  }, [setMobileDesignPanelOpen, setPreviewCustomTheme, setPreviewProfile, setPreviewTheme]);

  useEffect(() => {
    setMobileDesignPanelOpen(mobileSheetOpen);

    return () => {
      setMobileDesignPanelOpen(false);
    };
  }, [mobileSheetOpen, setMobileDesignPanelOpen]);

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
    "iconColor",
  ];

  const hasThemeCustomizationChanges = themeFieldsToCompare.some(
    (field) => currentResolvedTheme[field] !== savedResolvedTheme[field]
  );

  const hasProfileChanges =
    currentProfileSnapshot.displayName !== savedProfileSnapshot.displayName ||
    currentProfileSnapshot.bio !== savedProfileSnapshot.bio;

  const shouldEnableSave =
    hasThemeSelectionChange || hasThemeCustomizationChanges || hasProfileChanges;

  const effectiveCustomization = hasThemeSelectionChange ? null : initialCustomization;
  const activeSidebarLabel = SIDEBAR_ITEMS.find((item) => item.id === activeSidebarItem)?.label ?? "Theme";

  const renderThemeGrid = (compact = false) => (
    <div className={`grid grid-cols-2 gap-4 pb-10 ${compact ? "" : "sm:grid-cols-3 lg:grid-cols-4 lg:gap-5"}`}>
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

      {themes.map((theme) => {
        const isSelected = selectedThemeId === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              setPreviewTheme(theme);
              setPreviewCustomTheme(null);
            }}
            className="group text-left"
          >
            <div
              className={`relative overflow-hidden rounded-[26px] border transition-all duration-200 ${
                isSelected
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
              <p className="truncate text-sm font-medium text-white/80">{theme.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderActiveContent = (compact = false) => (
    <>
      {activeSidebarItem === "theme" && renderThemeGrid(compact)}

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
        <ColorsTabContent
          initialCustomization={effectiveCustomization || {}}
          activeTheme={activeTheme}
        />
      )}

      {activeSidebarItem === "buttons" && (
        <ButtonTabContent
          key={`buttons-${selectedThemeId ?? "current"}`}
          initialCustomization={effectiveCustomization || {}}
          activeTheme={activeTheme}
        />
      )}
    </>
  );
  const handleSave = async () => {
    startTransition(async () => {
      try {
        if (hasThemeSelectionChange && selectedThemeId) {
          await saveThemeAction(selectedThemeId);
        }

        const headerData: HeaderSavePayload = {};
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
        if (currentResolvedTheme.iconColor !== savedResolvedTheme.iconColor) {
          headerData.iconColor = currentResolvedTheme.iconColor;
        }
        if (currentResolvedTheme.fontFamily !== savedResolvedTheme.fontFamily) {
          headerData.fontFamily = currentResolvedTheme.fontFamily;
        }

        if (Object.keys(headerData).length > 0) {
          await saveHeaderDesignAction(headerData);
        }

        const wallpaperData: WallpaperSavePayload = {};
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

        const buttonData: ButtonsSavePayload = {};
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
      } catch {
        toast.error("Failed to save changes");
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top Header */}
      <div className="-mx-4 mb-6 hidden items-center justify-between border-b border-[#202833] bg-[#07101C] px-5 py-4 sm:-mx-6 md:flex lg:-mx-8">
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
      <div className="hidden flex-1 flex-col gap-8 md:flex md:flex-row">
        {/* Left Sidebar */}
        <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-white/10 pr-4 lg:w-40">
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
                      setPreviewTheme(theme);
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
            <ColorsTabContent
               initialCustomization={effectiveCustomization || {}}
               activeTheme={activeTheme}
            />
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
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07101C]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_44px_rgba(0,0,0,0.32)] backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-md items-stretch gap-1 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => {
                setMobileSheetOpen(false);
                setMobileDesignPanelOpen(false);
                router.push("/dashboard/links");
              }}
              className="flex min-h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Back to dashboard navigation"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={4} />
              <span>Back</span>
            </button>

            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSidebarItem(item.id);
                    setMobileDesignPanelOpen(true);
                    setMobileSheetOpen(true);
                  }}
                  className={`flex min-h-14 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-[11px] font-semibold transition ${
                    isActive
                      ? "bg-white text-[#07101C] shadow-[0_10px_28px_rgba(0,184,219,0.16)]"
                      : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <BottomSheet
          open={mobileSheetOpen}
          title={activeSidebarLabel}
          onClose={() => {
            setMobileSheetOpen(false);
            setMobileDesignPanelOpen(false);
          }}
          maxHeightClassName="max-h-[48dvh]"
          contentMaxHeightClassName="max-h-[calc(48dvh-82px)]"
          backdropClassName="bg-black/25"
        >
          {renderActiveContent(true)}
        </BottomSheet>
      </div>
    </div>
  );
}
