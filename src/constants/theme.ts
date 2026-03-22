export const Colors = {
  // Backgrounds
  background: "#0f0f1a",
  surface: "#1a1a2e",
  cardBg: "#16213e",

  primary: "#e94560",
  primaryLight: "#ff6b8a",
  accent: "#0f3460",

  textPrimary: "#f5f5f5",
  textSecondary: "#b8bcc8",
  textMuted: "#8892a4",

  overlayLight: "rgba(0, 0, 0, 0.35)",
  overlayMedium: "rgba(0, 0, 0, 0.60)",
  overlayDark: "rgba(0, 0, 0, 0.80)",

  focusRing: "#60a5fa",

  white: "#ffffff",
  transparent: "transparent",
} as const;

export const Typography = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    "2xl": 26,
    "3xl": 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
    extraBold: "800" as const,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Duration = {
  fast: 150,
  normal: 250,
  slow: 400,
  reveal: 350,
} as const;
