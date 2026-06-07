// Shared UI constants used across the app. Kept in one place so the medal
// glyphs, the purple "stats" accent and the soft-card look stay consistent.

// Medal glyph per final rank (1 = champion). Anything below 3 falls back to
// the raw number at the call site.
export const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Purple identity used by the cross-season stats view and the player dialog.
export const ACCENT = "#7c3aed";
export const DARK = "#5b21b6";

// Tints behind the medal pills in the hall of fame.
export const MEDAL_COLORS = {
  gold: "#f5b301",
  silver: "#9aa3ad",
  bronze: "#c47b3f",
};

// Shared soft-card look used across the stats page for a calmer, premium feel.
export const CARD_SX = {
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 10px 30px -18px rgba(17,24,39,0.35)",
  backgroundColor: "#fff",
};
