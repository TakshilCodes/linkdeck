import type { CustomTheme, DefaultTheme, ResolvedTheme } from "@/types/theme";

export function mergeTheme(
  defaultTheme: DefaultTheme,
  customTheme?: CustomTheme | null
): ResolvedTheme {
  if (!customTheme) return defaultTheme;

  return {
    ...defaultTheme,

    wallpaperStyle: customTheme.wallpaperStyle ?? defaultTheme.wallpaperStyle,
    backgroundColor: customTheme.backgroundColor ?? defaultTheme.backgroundColor,
    backgroundColor2: customTheme.backgroundColor2 ?? defaultTheme.backgroundColor2,
    gradientDirection:
      customTheme.gradientDirection ?? defaultTheme.gradientDirection,
    patternStyle: customTheme.patternStyle ?? defaultTheme.patternStyle,
    blurStrength: customTheme.blurStrength ?? defaultTheme.blurStrength,
    fontFamily: customTheme.fontFamily ?? defaultTheme.fontFamily,
    buttonStyle: customTheme.buttonStyle ?? defaultTheme.buttonStyle,
    buttonRadius: customTheme.buttonRadius ?? defaultTheme.buttonRadius,
    buttonShadow: customTheme.buttonShadow ?? defaultTheme.buttonShadow,
    buttonColor: customTheme.buttonColor ?? defaultTheme.buttonColor,
    buttonTextColor: customTheme.buttonTextColor ?? defaultTheme.buttonTextColor,
    shadowColor: customTheme.shadowColor ?? defaultTheme.shadowColor,
    patternColor: customTheme.patternColor ?? defaultTheme.patternColor,
    outlineColor: customTheme.outlineColor ?? defaultTheme.outlineColor,
    titleFontSize: customTheme.titleFontSize ?? defaultTheme.titleFontSize,
    titleColor: customTheme.titleColor ?? defaultTheme.titleColor,
    titleFontWeight:
      customTheme.titleFontWeight ?? defaultTheme.titleFontWeight,
    profileFontSize:
      customTheme.profileFontSize ?? defaultTheme.profileFontSize,
    profileColor: customTheme.profileColor ?? defaultTheme.profileColor,
  };
}