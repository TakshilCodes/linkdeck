"use client";

import { useEffect, useState, useRef } from "react";
import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import CustomColorPicker from "./CustomColorPicker";
import type { DefaultTheme } from "@/types/theme";

// Font options constants
const FONT_FAMILY_OPTIONS = [
  "INTER",
  "POPPINS", 
  "MONTSERRAT",
  "ROBOTO",
  "PLAYFAIR",
  "OUTFIT",
];

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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-cyan-400' : 'bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

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
                  className={`w-full px-4 py-3 text-left text-[15px] transition ${
                    isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'text-white hover:bg-[#2a2a2a]'
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

type Props = {
  initialCustomization?: any;
  activeTheme: DefaultTheme;
};

export default function TextTabContent({ initialCustomization, activeTheme }: Props) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  // Initialize state with initial customization values
  const pageFontFamily = resolvedTheme.fontFamily ?? "INTER";
  const [useAltFont, setUseAltFont] = useState(
    Boolean((initialCustomization?.titleFontFamily ?? resolvedTheme.titleFontFamily) != null)
  );
  const [titleFontFamily, setTitleFontFamily] = useState(resolvedTheme.titleFontFamily ?? pageFontFamily);
  const [titleFontWeight, setTitleFontWeight] = useState(resolvedTheme.titleFontWeight ?? "MEDIUM");
  const [titleColor, setTitleColor] = useState(resolvedTheme.titleColor ?? "#ffffff");
  const [titleFontSize, setTitleFontSize] = useState(resolvedTheme.titleFontSize ?? "MEDIUM");
  const [profileFontSize, setProfileFontSize] = useState(resolvedTheme.profileFontSize ?? "SMALL");
  const [profileColor, setProfileColor] = useState(resolvedTheme.profileColor ?? "#ffffff");
  const [fontFamily, setFontFamily] = useState(resolvedTheme.fontFamily ?? "INTER");

  // Update preview when values change
  useEffect(() => {
    const storeFontFamily = useAltFont ? titleFontFamily : null;
    updatePreviewCustomTheme({
      titleFontFamily: storeFontFamily,
      titleFontWeight,
      titleColor,
      titleFontSize,
      profileFontSize,
      profileColor,
      fontFamily
    });
  }, [useAltFont, titleFontFamily, titleFontWeight, titleColor, titleFontSize, profileFontSize, profileColor, fontFamily, updatePreviewCustomTheme]);

  // Initialize preview with empty state to avoid false positives
  useEffect(() => {
    // Don't reset preview on mount - let it use store's initial null state
    // updatePreviewCustomTheme({});
  }, []);

  const handleTitleFontFamilyChange = (value: string) => {
    setTitleFontFamily(value);
  };

  const handleTitleFontWeightChange = (value: string) => {
    setTitleFontWeight(value);
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

  const handleTitleFontSizeChange = (value: string) => {
    setTitleFontSize(value);
  };

  const handlePageFontFamilyChange = (value: string) => {
    setFontFamily(value);
  };


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
        -ms-overflow-style: none;
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

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Title Text Styling Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Title Text</h3>
        
        <ToggleSwitch
          label="Alternative title font"
          subtitle="Matches page font by default"
          checked={useAltFont}
          onChange={setUseAltFont}
        />

        {useAltFont && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Font Family</label>
              <CustomDropdown
                value={titleFontFamily || "INTER"}
                onChange={handleTitleFontFamilyChange}
                options={FONT_FAMILY_OPTIONS}
                label="Select font family"
              />
            </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Font Weight</label>
            <CustomDropdown
              value={titleFontWeight || "MEDIUM"}
              onChange={handleTitleFontWeightChange}
              options={FONT_WEIGHT_OPTIONS}
              label="Select font weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Font Size</label>
            <CustomDropdown
              value={titleFontSize || "MEDIUM"}
              onChange={handleTitleFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              label="Select font size"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Color</label>
            <CustomColorPicker
              value={titleColor || "#000000"}
              onChange={handleTitleColorChange}
            />
          </div>
        </div>
        )}
      </section>

      {/* Profile Text Styling Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Profile Text</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Font Size</label>
            <CustomDropdown
              value={profileFontSize || "SMALL"}
              onChange={handleProfileFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              label="Select font size"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Color</label>
            <CustomColorPicker
              value={profileColor || "#666666"}
              onChange={handleProfileColorChange}
            />
          </div>
        </div>
      </section>

      {/* Page Text Styling Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Page Text</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Font Family</label>
            <CustomDropdown
              value={pageFontFamily || "INTER"}
              onChange={handlePageFontFamilyChange}
              options={FONT_FAMILY_OPTIONS}
              label="Select font family"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
