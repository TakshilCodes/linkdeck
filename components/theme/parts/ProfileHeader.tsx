import Avatar from "./Avatar";
import IconRow from "./IconRow";
import type { ResolvedTheme } from "@/types/theme";
import {
  getProfileFontSizeValue,
  getThemeTokens,
  getTitleFontSizeValue,
  getTitleFontWeightValue,
} from "@/lib/themes/theme-utils";

type RendererIcon = {
  id: string;
  type: string;
  url: string;
  label?: string | null;
};

type ProfileHeaderProps = {
  theme: ResolvedTheme;
  profile: {
    username?: string | null;
    displayName?: string | null;
    profileImgUrl?: string | null;
    bio?: string | null;
  };
  icons: RendererIcon[];
  compact?: boolean;
};

export default function ProfileHeader({
  theme,
  profile,
  icons,
  compact = false,
}: ProfileHeaderProps) {
  const { titleColor, profileColor } = getThemeTokens(theme);

  const displayName = profile.displayName || profile.username || "Your Name";
  const titleFontSize = getTitleFontSizeValue(theme);
  const titleFontWeight = getTitleFontWeightValue(theme);
  const profileFontSize = getProfileFontSizeValue(theme);

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar
        profileImgUrl={profile.profileImgUrl}
        displayName={displayName}
        compact={compact}
      />

      <h1
        className={compact ? "max-w-full px-1 text-[17px] font-bold leading-snug" : "text-[26px] font-bold"}
        style={{
          color: titleColor,
          fontSize: compact ? "17px" : titleFontSize,
          fontWeight: titleFontWeight,
        }}
      >
        {displayName}
      </h1>

      {profile.bio ? (
        <p
          className={`max-w-[340px] ${compact ? "mt-1.5 leading-snug" : "mt-2"}`}
          style={{
            color: profileColor,
            fontSize: compact ? "12px" : profileFontSize,
          }}
        >
          {profile.bio}
        </p>
      ) : null}

      <IconRow icons={icons} color={profileColor} compact={compact} />
    </div>
  );
}