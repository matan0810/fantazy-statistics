// Shared design tokens. Everything visual (surfaces, borders, medal colors,
// numeric font) flows from here so the whole app reads as one system.

// Medal glyph per final rank (1 = champion).
export const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Violet identity used by the cross-season stats view and the player dialog.
export const ACCENT = "#a78bfa";
export const DARK = "#7c3aed";

export const GOLD = "#fbbf24";
export const SILVER = "#cbd5e1";
export const BRONZE = "#f59e5b";

export const MEDAL_COLORS = { gold: GOLD, silver: SILVER, bronze: BRONZE };
export const RANK_COLORS = { 1: GOLD, 2: SILVER, 3: BRONZE };

// Dark "broadcast" palette.
export const T = {
  bg: "#060a14",
  surface: "#0c1322",
  surfaceHi: "#121b2f",
  border: "rgba(148,163,184,0.12)",
  borderHi: "rgba(148,163,184,0.24)",
  text: "#eef2f9",
  textDim: "#94a3b8",
  textMute: "#5d6985",
};

// Condensed display face for scoreboard numbers.
export const NUM_FONT = '"Barlow Condensed", "Heebo", system-ui, sans-serif';

export const NUM_SX = {
  fontFamily: NUM_FONT,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "0.01em",
};

// Shared card surface.
export const CARD_SX = {
  borderRadius: "18px",
  border: `1px solid ${T.border}`,
  backgroundColor: T.surface,
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 48px -28px rgba(0,0,0,0.9)",
};

// Small uppercase-style eyebrow label above section content.
export const EYEBROW_SX = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: T.textDim,
};

// 8-digit hex alpha helper: alpha(color, 0.2) -> "#rrggbb33"
export const alpha = (hex, a) =>
  `${hex}${Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")}`;
