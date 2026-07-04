"use client";

import { useState } from "react";

import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import type { CustomTheme, DefaultTheme } from "@/types/theme";

import CustomColorPicker from "./CustomColorPicker";
import { DesignSelect, ToggleSwitch } from "./DesignControls";

const FONT_FAMILY_OPTIONS = [
  "INTER",
  "POPPINS",
  "MONTSERRAT",
  "ROBOTO",
  "PLAYFAIR",
  "OUTFIT",
] as const;

const FONT_WEIGHT_OPTIONS = ["NONE", "SOFT", "MEDIUM", "STRONG"] as const;
const FONT_SIZE_OPTIONS = ["SMALL", "MEDIUM", "LARGE"] as const;

type FontFamilyOption = (typeof FONT_FAMILY_OPTIONS)[number];
type FontWeightOption = (typeof FONT_WEIGHT_OPTIONS)[number];
type FontSizeOption = (typeof FONT_SIZE_OPTIONS)[number];

type Props = {
  initialCustomization?: Partial<CustomTheme> | null;
  activeTheme: DefaultTheme;
};

function coerceOption<T extends string>(options: readonly T[], value: string | null | undefined, fallback: T) {
  return options.includes(value as T) ? (value as T) : fallback;
}

export default function TextTabContent({ initialCustomization, activeTheme }: Props) {
  const { updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);
  const pageFontFamily = coerceOption(FONT_FAMILY_OPTIONS, resolvedTheme.fontFamily, "INTER");

  const [useAltFont, setUseAltFont] = useState(
    Boolean((initialCustomization?.titleFontFamily ?? resolvedTheme.titleFontFamily) != null)
  );
  const [titleFontFamily, setTitleFontFamily] = useState<FontFamilyOption>(
    coerceOption(FONT_FAMILY_OPTIONS, resolvedTheme.titleFontFamily, pageFontFamily)
  );
  const [titleFontWeight, setTitleFontWeight] = useState<FontWeightOption>(
    coerceOption(FONT_WEIGHT_OPTIONS, resolvedTheme.titleFontWeight, "MEDIUM")
  );
  const [titleFontSize, setTitleFontSize] = useState<FontSizeOption>(
    coerceOption(FONT_SIZE_OPTIONS, resolvedTheme.titleFontSize, "MEDIUM")
  );
  const [profileFontSize, setProfileFontSize] = useState<FontSizeOption>(
    coerceOption(FONT_SIZE_OPTIONS, resolvedTheme.profileFontSize, "SMALL")
  );
  const [fontFamily, setFontFamily] = useState<FontFamilyOption>(pageFontFamily);
  const [titleColor, setTitleColor] = useState(resolvedTheme.titleColor ?? "#ffffff");
  const [profileColor, setProfileColor] = useState(resolvedTheme.profileColor ?? "#ffffff");

  const handleAltFontChange = (checked: boolean) => {
    setUseAltFont(checked);
    updatePreviewCustomTheme({ titleFontFamily: checked ? titleFontFamily : null });
  };

  const handleTitleFontFamilyChange = (value: FontFamilyOption) => {
    setTitleFontFamily(value);
    setUseAltFont(true);
    updatePreviewCustomTheme({ titleFontFamily: value });
  };

  const handleTitleFontWeightChange = (value: FontWeightOption) => {
    setTitleFontWeight(value);
    updatePreviewCustomTheme({ titleFontWeight: value });
  };

  const handleTitleFontSizeChange = (value: FontSizeOption) => {
    setTitleFontSize(value);
    updatePreviewCustomTheme({ titleFontSize: value });
  };

  const handleTitleColorChange = (value: string) => {
    setTitleColor(value);
    updatePreviewCustomTheme({ titleColor: value });
  };

  const handleProfileFontSizeChange = (value: FontSizeOption) => {
    setProfileFontSize(value);
    updatePreviewCustomTheme({ profileFontSize: value });
  };

  const handleProfileColorChange = (value: string) => {
    setProfileColor(value);
    updatePreviewCustomTheme({ profileColor: value });
  };

  const handlePageFontFamilyChange = (value: FontFamilyOption) => {
    setFontFamily(value);
    updatePreviewCustomTheme({ fontFamily: value });
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Title text</h3>

        <ToggleSwitch
          label="Alternative title font"
          subtitle="Matches page font by default"
          checked={useAltFont}
          onChange={handleAltFontChange}
        />

        {useAltFont ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Font family</label>
            <DesignSelect
              value={titleFontFamily}
              onChange={handleTitleFontFamilyChange}
              options={FONT_FAMILY_OPTIONS}
              ariaLabel="Select title font family"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Font weight</label>
            <DesignSelect
              value={titleFontWeight}
              onChange={handleTitleFontWeightChange}
              options={FONT_WEIGHT_OPTIONS}
              ariaLabel="Select title font weight"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Font size</label>
            <DesignSelect
              value={titleFontSize}
              onChange={handleTitleFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              ariaLabel="Select title font size"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Color</label>
            <CustomColorPicker value={titleColor} onChange={handleTitleColorChange} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Profile text</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Font size</label>
            <DesignSelect
              value={profileFontSize}
              onChange={handleProfileFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              ariaLabel="Select profile font size"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Color</label>
            <CustomColorPicker value={profileColor} onChange={handleProfileColorChange} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Page text</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Font family</label>
            <DesignSelect
              value={fontFamily}
              onChange={handlePageFontFamilyChange}
              options={FONT_FAMILY_OPTIONS}
              ariaLabel="Select page font family"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
