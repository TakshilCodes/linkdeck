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
  titleFontFamily: string | null;
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
  titleFontFamily?: string | null;
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

export const CUSTOM_BASE_THEME: DefaultTheme = {
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
  titleFontFamily: null,
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type ResolvedTheme = DefaultTheme;