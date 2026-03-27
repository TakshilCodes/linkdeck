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
};

export default function ProfileHeader({
  theme,
  profile,
  icons,
}: ProfileHeaderProps) {
  const { titleColor, profileColor } = getThemeTokens(theme);

  const displayName = profile.displayName || profile.username || "Your Name";
  const titleFontSize = getTitleFontSizeValue(theme);
  const titleFontWeight = getTitleFontWeightValue(theme);
  const profileFontSize = getProfileFontSizeValue(theme);

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar profileImgUrl={profile.profileImgUrl} displayName={displayName} />

      <h1
        className="text-[26px] font-bold"
        style={{
          color: titleColor,
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
        }}
      >
        {displayName}
      </h1>

      {profile.bio ? (
        <p
          className="mt-2 max-w-[340px]"
          style={{
            color: profileColor,
            fontSize: profileFontSize,
          }}
        >
          {profile.bio}
        </p>
      ) : null}

      <IconRow icons={icons} color={profileColor} />
    </div>
  );
}