"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

import { mergeTheme } from "@/lib/themes/merge-theme";
import { useDesignStore } from "@/store/design";
import ManageProfilePictureModal from "@/app/(main)/dashboard/links/ManageProfilePictureModal";
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

type InitialProfile = {
  username?: string | null;
  displayName?: string | null;
  profileImgUrl?: string | null;
  bio?: string | null;
};

type Props = {
  initialProfile: InitialProfile;
  initialCustomization?: Partial<CustomTheme> | null;
  activeTheme: DefaultTheme;
};

function coerceOption<T extends string>(options: readonly T[], value: string | null | undefined, fallback: T) {
  return options.includes(value as T) ? (value as T) : fallback;
}

export default function HeaderTabContent({ initialProfile, initialCustomization, activeTheme }: Props) {
  const { updatePreviewProfile, updatePreviewCustomTheme } = useDesignStore();
  const resolvedTheme = mergeTheme(activeTheme, initialCustomization ?? null);
  const pageFontFamily = coerceOption(FONT_FAMILY_OPTIONS, resolvedTheme.fontFamily, "INTER");

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState(
    initialProfile.displayName ?? initialProfile.username ?? ""
  );
  const [bio, setBio] = useState(initialProfile.bio ?? "");
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
  const [titleColor, setTitleColor] = useState(resolvedTheme.titleColor ?? "#ffffff");
  const [profileColor, setProfileColor] = useState(resolvedTheme.profileColor ?? "#ffffff");
  const [bioColor, setBioColor] = useState(resolvedTheme.bioColor ?? "#ffffff");

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    updatePreviewProfile({ displayName: value, bio });
  };

  const handleBioChange = (value: string) => {
    const trimmedBio = value.slice(0, 200);
    setBio(trimmedBio);
    updatePreviewProfile({ displayName: localTitle, bio: trimmedBio });
  };

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

  const handleProfileFontSizeChange = (value: FontSizeOption) => {
    setProfileFontSize(value);
    updatePreviewCustomTheme({ profileFontSize: value });
  };

  const handleTitleColorChange = (value: string) => {
    setTitleColor(value);
    updatePreviewCustomTheme({ titleColor: value });
  };

  const handleProfileColorChange = (value: string) => {
    setProfileColor(value);
    updatePreviewCustomTheme({ profileColor: value });
  };

  const handleBioColorChange = (value: string) => {
    setBioColor(value);
    updatePreviewCustomTheme({ bioColor: value });
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <ManageProfilePictureModal
        open={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImgUrl={initialProfile.profileImgUrl}
        username={initialProfile.username ?? ""}
      />

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Profile image</label>
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
            {initialProfile.profileImgUrl ? (
              <Image src={initialProfile.profileImgUrl} alt="Profile" fill className="object-cover" />
            ) : (
              <span className="text-3xl text-white/50">
                {initialProfile.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full bg-[#111111] px-5 text-sm font-medium text-white transition hover:bg-[#1a1a1a]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Title</label>
        <input
          type="text"
          value={localTitle}
          onChange={(event) => handleTitleChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-white/10 bg-transparent px-4 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          placeholder="@username"
        />
      </section>

      <section className="space-y-4">
        <ToggleSwitch
          label="Alternative title font"
          subtitle="Matches page font by default"
          checked={useAltFont}
          onChange={handleAltFontChange}
        />

        {useAltFont ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Title font</label>
            <DesignSelect
              value={titleFontFamily}
              onChange={handleTitleFontFamilyChange}
              options={FONT_FAMILY_OPTIONS}
              ariaLabel="Select title font"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Title weight</label>
            <DesignSelect
              value={titleFontWeight}
              onChange={handleTitleFontWeightChange}
              options={FONT_WEIGHT_OPTIONS}
              ariaLabel="Select title weight"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Title size</label>
            <DesignSelect
              value={titleFontSize}
              onChange={handleTitleFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              ariaLabel="Select title size"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Title color</label>
          <CustomColorPicker value={titleColor} onChange={handleTitleColorChange} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-white/90">Bio</label>
        <textarea
          value={bio}
          onChange={(event) => handleBioChange(event.target.value)}
          placeholder="Tell people about yourself..."
          className="h-24 w-full resize-none rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          rows={4}
          maxLength={200}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/50">{bio.length}/200</span>
          <span className="text-xs text-white/30">Maximum 200 characters</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Profile text size</label>
            <DesignSelect
              value={profileFontSize}
              onChange={handleProfileFontSizeChange}
              options={FONT_SIZE_OPTIONS}
              ariaLabel="Select profile text size"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Profile text color</label>
            <CustomColorPicker value={profileColor} onChange={handleProfileColorChange} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Bio color</label>
          <CustomColorPicker value={bioColor} onChange={handleBioColorChange} />
        </div>
      </section>
    </div>
  );
}
