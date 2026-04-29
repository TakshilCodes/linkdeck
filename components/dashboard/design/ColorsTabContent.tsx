"use client";

import { useDesignStore } from "@/store/design";
import CustomColorPicker from "./CustomColorPicker";

type Props = {
  initialCustomization?: any;
};

export default function ColorsTabContent({ initialCustomization }: Props) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();

  const backgroundColor = previewCustomTheme?.backgroundColor ?? initialCustomization?.backgroundColor ?? "#F5F5F4";
  const backgroundColor2 = previewCustomTheme?.backgroundColor2 ?? initialCustomization?.backgroundColor2 ?? "#F5F5F4";
  const buttonColor = previewCustomTheme?.buttonColor ?? initialCustomization?.buttonColor ?? "#9CA3AF";
  const buttonTextColor = previewCustomTheme?.buttonTextColor ?? initialCustomization?.buttonTextColor ?? "#FFFFFF";
  const titleColor = previewCustomTheme?.titleColor ?? initialCustomization?.titleColor ?? "#FFFFFF";
  const profileColor = previewCustomTheme?.profileColor ?? initialCustomization?.profileColor ?? "#FFFFFF";
  const shadowColor = previewCustomTheme?.shadowColor ?? initialCustomization?.shadowColor ?? "#000000";
  const outlineColor = previewCustomTheme?.outlineColor ?? initialCustomization?.outlineColor ?? "#111111";
  const patternColor = previewCustomTheme?.patternColor ?? initialCustomization?.patternColor ?? "#6B7280";

  return (
    <div className="flex flex-col gap-6 pb-20">
      
      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Background</label>
        <CustomColorPicker
          value={backgroundColor}
          onChange={(color) => updatePreviewCustomTheme({ backgroundColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Background 2 (Gradient)</label>
        <CustomColorPicker
          value={backgroundColor2}
          onChange={(color) => updatePreviewCustomTheme({ backgroundColor2: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Buttons</label>
        <CustomColorPicker
          value={buttonColor}
          onChange={(color) => updatePreviewCustomTheme({ buttonColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Button text</label>
        <CustomColorPicker
          value={buttonTextColor}
          onChange={(color) => updatePreviewCustomTheme({ buttonTextColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Page text (Title)</label>
        <CustomColorPicker
          value={titleColor}
          onChange={(color) => updatePreviewCustomTheme({ titleColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Profile text</label>
        <CustomColorPicker
          value={profileColor}
          onChange={(color) => updatePreviewCustomTheme({ profileColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Outline color</label>
        <CustomColorPicker
          value={outlineColor}
          onChange={(color) => updatePreviewCustomTheme({ outlineColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Shadow color</label>
        <CustomColorPicker
          value={shadowColor}
          onChange={(color) => updatePreviewCustomTheme({ shadowColor: color })}
        />
      </section>

      <section className="space-y-3">
        <label className="text-[15px] font-medium text-white/90">Pattern color</label>
        <CustomColorPicker
          value={patternColor}
          onChange={(color) => updatePreviewCustomTheme({ patternColor: color })}
        />
      </section>

    </div>
  );
}
