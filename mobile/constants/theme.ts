// ─── Theme Constants ─────────────────────────────────────────────────
// Shared design tokens for the CryptoShop Wallet mobile app.

export const Colors = {
  // Brand
  primary: "#6C5CE7",
  primaryDark: "#5A4BD1",
  accent: "#00D2FF",

  // Backgrounds
  bgDark: "#0D1117",
  bgCard: "#161B22",
  bgInput: "#21262D",

  // Text
  textPrimary: "#E6EDF3",
  textSecondary: "#8B949E",
  textMuted: "#484F58",

  // Semantic
  success: "#3FB950",
  warning: "#D29922",
  error: "#F85149",

  // Borders
  border: "#30363D",
  borderFocus: "#6C5CE7",

  // Misc
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 40,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
