"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import { saveHeaderDesignAction } from "@/actions/dashboard/header";
import { toast } from "sonner";
import ManageProfilePictureModal from "@/app/(main)/dashboard/links/ManageProfilePictureModal";
import CustomColorPicker from "./CustomColorPicker";
import type { DefaultTheme } from "@/types/theme";

// A quick debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Toggle Switch Component
function ToggleSwitch({
  label,
  subtitle,
  checked,
  onChange
}: {
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-white/80">{label}</label>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-cyan-400' : 'bg-white/20'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>
    </div>
  );
}

type Props = {
  initialProfile: {
    username?: string | null;
    displayName?: string | null;
    profileImgUrl?: string | null;
    bio?: string | null;
  };
  initialCustomization: any;
  activeTheme: DefaultTheme;
};

const FONT_OPTIONS = [
  "INTER",
  "POPPINS",
  "MONTSERRAT",
  "ROBOTO",
  "PLAYFAIR",
  "OUTFIT",
];

const FONT_FAMILY_OPTIONS = FONT_OPTIONS;

const FONT_WEIGHT_OPTIONS = [
  "NONE",
  "SOFT",
  "MEDIUM",
  "STRONG",
];

const FONT_SIZE_OPTIONS = [
  "SMALL",
  "MEDIUM",
  "LARGE",
];

// Generic Custom Dropdown Component
function CustomDropdown<T extends string>({
  value,
  onChange,
  options,
  label
}: {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayText = value.charAt(0) + value.slice(1).toLowerCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-transparent px-4 text-left text-[15px] text-white outline-none transition focus:border-cyan-400 flex items-center justify-between"
      >
        <span>{displayText}</span>
        <svg
          className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-scroll scrollbar-hide">
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[15px] transition ${isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'text-white hover:bg-[#2a2a2a]'
                    }`}
                >
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Font Dropdown Component (for backward compatibility)
function CustomFontDropdown({
  value,
  onChange,
  fonts
}: {
  value: string;
  onChange: (font: string) => void;
  fonts: string[];
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

  const selectedFont = fonts.find(f => f === value);
  const displayText = selectedFont ? selectedFont.charAt(0) + selectedFont.slice(1).toLowerCase() : 'Select font';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-transparent px-4 text-left text-[15px] text-white outline-none transition focus:border-cyan-400 flex items-center justify-between"
      >
        <span>{displayText}</span>
        <svg
          className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-scroll scrollbar-hide">
            {fonts.map((font) => {
              const isSelected = font === value;
              return (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    onChange(font);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[15px] transition ${isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'text-white hover:bg-[#2a2a2a]'
                    }`}
                >
                  {font.charAt(0) + font.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeaderTabContent({initialProfile, initialCustomization, activeTheme}: Props) {
  const {previewProfile, updatePreviewProfile, previewCustomTheme, updatePreviewCustomTheme} = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
      style.textContent = `
      .slider-thumb::-webkit-slider-thumb {
        appearance: none;
      width: 0;
      height: 0;
      background: transparent;
      cursor: pointer;
      }

      .slider-thumb::-moz-range-thumb {
        appearance: none;
      width: 0;
      height: 0;
      background: transparent;
      cursor: pointer;
      border: none;
      }

      .scrollbar-hide {
        -ms - overflow - style: none;
      scrollbar-width: none;
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      `;
      document.head.appendChild(style);
    
    return () => {
        document.head.removeChild(style);
    };
  }, []);

      const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
      const [isPending, startTransition] = useTransition();

      const [localTitle, setLocalTitle] = useState(initialProfile.displayName ?? initialProfile.username ?? "");
      const debouncedTitle = useDebounce(localTitle, 500);

      // Using a local state for fonts and colors
      const pageFontFamily = resolvedTheme.fontFamily ?? "INTER";

      const [useAltFont, setUseAltFont] = useState(Boolean((initialCustomization?.titleFontFamily ?? resolvedTheme.titleFontFamily) != null));
      const [titleFontFamily, setTitleFontFamily] = useState(resolvedTheme.titleFontFamily ?? pageFontFamily);
      const [titleColor, setTitleColor] = useState(resolvedTheme.titleColor ?? "#ffffff");
      const [titleFontWeight, setTitleFontWeight] = useState(resolvedTheme.titleFontWeight ?? "MEDIUM");
      const [titleFontSize, setTitleFontSize] = useState(resolvedTheme.titleFontSize ?? "MEDIUM");
      const [profileFontSize, setProfileFontSize] = useState(resolvedTheme.profileFontSize ?? "SMALL");
      const [profileColor, setProfileColor] = useState(resolvedTheme.profileColor ?? "#ffffff");
      const [bio, setBio] = useState(initialProfile?.bio ?? "");
      const [bioColor, setBioColor] = useState(resolvedTheme.bioColor ?? "#ffffff");

  useEffect(() => {
        // Only update preview state, no auto-save
        updatePreviewProfile({ displayName: debouncedTitle, bio });
  }, [debouncedTitle, bio, updatePreviewProfile]);

  // Realtime updates for color and font family
  useEffect(() => {
    updatePreviewCustomTheme({
      titleColor,
      titleFontWeight,
      titleFontSize,
      profileFontSize,
      profileColor,
      bioColor
    });
  }, [useAltFont, titleFontFamily, titleColor, titleFontWeight, titleFontSize, profileFontSize, bioColor, updatePreviewCustomTheme]);

  // Hook up local change dispatch manually instead of deeply abstracting debounce right now for fonts/colors
  // Only update preview state, no auto-save
  const handleSaveFontAndColor = (newFont?: string | null, newColor?: string) => {
        // Preview is already updated via useEffect, no need to save here
      };

  const handleTitleFontFamilyChange = (value: string) => {
        setTitleFontFamily(value);
      setUseAltFont(true);
  };

  const handleTitleFontWeightChange = (value: string) => {
        setTitleFontWeight(value);
  };

  const handleTitleFontSizeChange = (value: string) => {
        setTitleFontSize(value);
  };

  const handleTitleColorChange = (value: string) => {
        setTitleColor(value);
  };

  const handleProfileFontSizeChange = (value: string) => {
        setProfileFontSize(value);
  };

  const handleProfileColorChange = (value: string) => {
        setProfileColor(value);
  };

  const handleBioColorChange = (value: string) => {
        setBioColor(value);
      };

      return (
      <div className="flex flex-col gap-8 pb-20">
        <ManageProfilePictureModal
          open={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          currentImgUrl={initialProfile.profileImgUrl}
          username={initialProfile.username ?? ""}
        />

        {/* Profile Image Section */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-white/90">Profile image</label>
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
              {initialProfile.profileImgUrl ? (
                <Image src={initialProfile.profileImgUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <span className="text-3xl text-white/50">{initialProfile.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full bg-[#111111] px-5 text-sm font-medium text-white transition hover:bg-[#1a1a1a]"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </section>

        {/* Title Section */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-white/90">Title</label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-transparent px-4 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            placeholder="@username"
          />
        </section>

        {/* Title Style Section */}
        <section className="space-y-4">

          <ToggleSwitch
            label="Alternative title font"
            subtitle="Matches page font by default"
            checked={useAltFont}
            onChange={setUseAltFont}
          />

          {useAltFont && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Title font</label>
              <CustomDropdown
                value={titleFontFamily}
                onChange={handleTitleFontFamilyChange}
                options={FONT_FAMILY_OPTIONS}
                label="Select title font"
              />
            </div>
          )}

          {/* Bio Section */}
          <section className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-white/90">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              placeholder="Tell people about yourself..."
              className="h-24 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none"
              rows={4}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-white/50">{bio.length}/200</span>
              <span className="text-xs text-white/30">Maximum 200 characters</span>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-white/80 mb-2">Bio Color</label>
              <CustomColorPicker
                value={bioColor || "#ffffff"}
                onChange={handleBioColorChange}
              />
            </div>
          </section>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Title Color</label>
            <CustomColorPicker
              value={titleColor || "#010101"}
              onChange={handleTitleColorChange}
            />
          </div>
        </section>

      </div>
      );
}
