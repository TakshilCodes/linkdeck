"use client";

import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import CustomColorPicker from "./CustomColorPicker";
import type { CustomTheme, DefaultTheme } from "@/types/theme";

type Props = {
  initialCustomization?: Partial<CustomTheme> | null;
  activeTheme: DefaultTheme;
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">{label}</label>
      <CustomColorPicker value={value} onChange={onChange} />
    </div>
  );
}

export default function ColorsTabContent({ initialCustomization, activeTheme }: Props) {
  const { previewCustomTheme, updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);

  return (
    <div className="flex flex-col gap-4 pb-20">
      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Background Colors</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorField
            label="Primary Background"
            value={previewCustomTheme?.backgroundColor ?? resolvedTheme.backgroundColor ?? "#FFFFFF"}
            onChange={(color) => updatePreviewCustomTheme({ backgroundColor: color })}
          />
          <ColorField
            label="Secondary Background"
            value={previewCustomTheme?.backgroundColor2 ?? resolvedTheme.backgroundColor2 ?? "#000000"}
            onChange={(color) => updatePreviewCustomTheme({ backgroundColor2: color })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Text Colors</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorField
            label="Title Color"
            value={previewCustomTheme?.titleColor ?? resolvedTheme.titleColor ?? "#000000"}
            onChange={(color) => updatePreviewCustomTheme({ titleColor: color })}
          />
          <ColorField
            label="Profile Text Color"
            value={previewCustomTheme?.profileColor ?? resolvedTheme.profileColor ?? "#666666"}
            onChange={(color) => updatePreviewCustomTheme({ profileColor: color })}
          />
          <ColorField
            label="Icon Color"
            value={previewCustomTheme?.iconColor ?? resolvedTheme.iconColor ?? resolvedTheme.profileColor ?? "#666666"}
            onChange={(color) => updatePreviewCustomTheme({ iconColor: color })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Button Colors</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorField
            label="Button Background"
            value={previewCustomTheme?.buttonColor ?? resolvedTheme.buttonColor ?? "#000000"}
            onChange={(color) => updatePreviewCustomTheme({ buttonColor: color })}
          />
          <ColorField
            label="Button Text Color"
            value={previewCustomTheme?.buttonTextColor ?? resolvedTheme.buttonTextColor ?? "#FFFFFF"}
            onChange={(color) => updatePreviewCustomTheme({ buttonTextColor: color })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Effect Colors</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorField
            label="Shadow Color"
            value={previewCustomTheme?.shadowColor ?? resolvedTheme.shadowColor ?? "#000000"}
            onChange={(color) => updatePreviewCustomTheme({ shadowColor: color })}
          />
          <ColorField
            label="Pattern Color"
            value={previewCustomTheme?.patternColor ?? resolvedTheme.patternColor ?? "#FFFFFF"}
            onChange={(color) => updatePreviewCustomTheme({ patternColor: color })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Additional Colors</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorField
            label="Outline Color"
            value={previewCustomTheme?.outlineColor ?? resolvedTheme.outlineColor ?? "#FFFFFF"}
            onChange={(color) => updatePreviewCustomTheme({ outlineColor: color })}
          />
        </div>
      </section>
    </div>
  );
}