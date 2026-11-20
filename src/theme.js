import { createTheme } from "@mui/material";
import { seasonTypes, T } from "./constants";

// Dark broadcast theme. The primary color follows the active competition so
// buttons, focus rings and highlights shift identity per tournament.
export const buildTheme = (seasonType) => {
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];

  return createTheme({
    direction: "rtl",
    palette: {
      mode: "dark",
      primary: { main: comp.color },
      secondary: { main: "#a78bfa" },
      background: { default: T.bg, paper: T.surface },
      text: { primary: T.text, secondary: T.textDim, disabled: T.textMute },
      divider: T.border,
    },
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: '"Heebo", "Assistant", "Segoe UI", system-ui, Arial, sans-serif',
      h1: { fontWeight: 900 },
      h2: { fontWeight: 900 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: "none" },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: T.surface,
            border: `1px solid ${T.border}`,
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.9)",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: { backgroundColor: "rgba(2,6,15,0.72)", backdropFilter: "blur(6px)" },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: T.surfaceHi,
            border: `1px solid ${T.borderHi}`,
            borderRadius: 14,
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.8)",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#1e293b",
            border: `1px solid ${T.borderHi}`,
            fontSize: "0.78rem",
            fontWeight: 600,
          },
          arrow: { color: "#1e293b" },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: false } },
    },
  });
};
