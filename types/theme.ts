import type {
  BlurStrengthValue,
  ButtonRadiusValue,
  ButtonShadowValue,
  ButtonStyleValue,
  GradientDirectionValue,
  PatternStyleValue,
  WallpaperStyleValue,
} from "@/lib/themes/theme-constants";

export type DefaultTheme = {
  id: string;
  name: string;
  slug: string;
  previewImgUrl: string | null;

  wallpaperStyle: WallpaperStyleValue;
  backgroundColor: string;
  backgroundColor2: string | null;
  gradientDirection: GradientDirectionValue | null;
  patternStyle: PatternStyleValue | null;
  blurStrength: BlurStrengthValue | null;

  fontFamily: string;
  buttonStyle: ButtonStyleValue;
  buttonRadius: ButtonRadiusValue;
  buttonShadow: ButtonShadowValue;

  buttonColor: string;
  buttonTextColor: string;
  shadowColor: string | null;
  patternColor: string | null;
  outlineColor: string | null;

  titleFontSize: string | null;
  titleColor: string;
  titleFontWeight: string | null;
  profileFontSize: string | null;
  profileColor: string;

  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomTheme = {
  wallpaperStyle?: WallpaperStyleValue | null;
  backgroundColor?: string | null;
  backgroundColor2?: string | null;
  gradientDirection?: GradientDirectionValue | null;
  patternStyle?: PatternStyleValue | null;
  blurStrength?: BlurStrengthValue | null;

  fontFamily?: string | null;
  buttonStyle?: ButtonStyleValue | null;
  buttonRadius?: ButtonRadiusValue | null;
  buttonShadow?: ButtonShadowValue | null;

  buttonColor?: string | null;
  buttonTextColor?: string | null;
  shadowColor?: string | null;
  patternColor?: string | null;
  outlineColor?: string | null;

  titleFontSize?: string | null;
  titleColor?: string | null;
  titleFontWeight?: string | null;
  profileFontSize?: string | null;
  profileColor?: string | null;
};

export type ResolvedTheme = DefaultTheme;