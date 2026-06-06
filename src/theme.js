import { createTheme } from "@mui/material";
import { seasonTypes } from "./constants/options";

// Builds a fresh MUI theme keyed to the active competition so the whole
// UI (buttons, highlights, accents) shifts color identity per competition.
export const buildTheme = (seasonType) => {
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];

  return createTheme({
    direction: "rtl",
    palette: {
      primary: { main: comp.color },
      secondary: { main: comp.accent },
      background: { default: "#f4f1ec", paper: "#ffffff" },
      text: { primary: "#1f2937", secondary: "#6b7280" },
    },
    shape: { borderRadius: 4 },
    typography: {
      fontFamily:
        '"Heebo", "Assistant", "Segoe UI", system-ui, Arial, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: "none" },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  });
};
