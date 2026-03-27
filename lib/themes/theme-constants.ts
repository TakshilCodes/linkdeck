export const WALLPAPER_STYLE = {
  FILL: "FILL",
  GRADIENT: "GRADIENT",
  BLUR: "BLUR",
  PATTERN: "PATTERN",
} as const;

export const GRADIENT_DIRECTION = {
  LINEAR_UP: "LINEAR_UP",
  LINEAR_DOWN: "LINEAR_DOWN",
  RADIAL: "RADIAL",
} as const;

export const PATTERN_STYLE = {
  GRID: "GRID",
  MORPH: "MORPH",
  ORGANIC: "ORGANIC",
  MATRIX: "MATRIX",
} as const;

export const BUTTON_STYLE = {
  SOLID: "SOLID",
  GLASS: "GLASS",
  OUTLINE: "OUTLINE",
} as const;

export const BUTTON_RADIUS = {
  SQUARE: "SQUARE",
  ROUND: "ROUND",
  ROUNDER: "ROUNDER",
  FULL: "FULL",
} as const;

export const BUTTON_SHADOW = {
  NONE: "NONE",
  SOFT: "SOFT",
  STRONG: "STRONG",
  HARD: "HARD",
} as const;

export const BLUR_STRENGTH = {
  NONE: "NONE",
  SOFT: "SOFT",
  MEDIUM: "MEDIUM",
  STRONG: "STRONG",
} as const;

export type WallpaperStyleValue =
  (typeof WALLPAPER_STYLE)[keyof typeof WALLPAPER_STYLE];

export type GradientDirectionValue =
  (typeof GRADIENT_DIRECTION)[keyof typeof GRADIENT_DIRECTION];

export type PatternStyleValue =
  (typeof PATTERN_STYLE)[keyof typeof PATTERN_STYLE];

export type ButtonStyleValue =
  (typeof BUTTON_STYLE)[keyof typeof BUTTON_STYLE];

export type ButtonRadiusValue =
  (typeof BUTTON_RADIUS)[keyof typeof BUTTON_RADIUS];

export type ButtonShadowValue =
  (typeof BUTTON_SHADOW)[keyof typeof BUTTON_SHADOW];

export type BlurStrengthValue =
  (typeof BLUR_STRENGTH)[keyof typeof BLUR_STRENGTH];