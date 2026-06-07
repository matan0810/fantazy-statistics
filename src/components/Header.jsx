import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import _ from "lodash";
import { seasonTypes } from "../constants";
import allSeasons from "../data/seasons.json";

// Derived once from data: the calendar start year of the earliest league season
const TWO_YEAR_TYPES = new Set([1, 4]);
const _firstSeason = _.minBy(
  allSeasons.filter((s) => TWO_YEAR_TYPES.has(s.type)),
  "year",
);
// year field is the END year (e.g. 2016 = 15/16), so subtract 1 for the start
const SINCE_LABEL = _firstSeason ? String(_firstSeason.year - 1) : "2015";

const VIEWS = [
  { key: "seasons", label: "עונות", emoji: "📅" },
  { key: "stats", label: "סטטיסטיקה כללית", emoji: "📊" },
];

function Header({ seasonType, onSeasonTypeChange, view, onViewChange }) {
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];

  return (
    <Box
      sx={{
        borderRadius: { xs: 0, sm: 6 },
        px: { xs: 2.5, sm: 5 },
        py: { xs: 3.5, sm: 5 },
        mb: 3,
        color: "#fff",
        background: `linear-gradient(135deg, ${comp.gradient[0]} 0%, ${comp.gradient[1]} 100%)`,
        boxShadow: "0 14px 40px -12px rgba(0,0,0,0.45)",
        transition: "background 0.5s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative oversized emoji */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { xs: -10, sm: 16 },
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: { xs: 90, sm: 150 },
          opacity: 0.16,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {comp.emoji}
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            mb: 1.5,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: 0.5,
          }}
        >
          🏆 פנטזי ליג · מאז {SINCE_LABEL}
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.2rem", sm: "3.1rem" },
            lineHeight: 1.05,
            textShadow: "0 2px 16px rgba(0,0,0,0.28)",
          }}
        >
          היכל התהילה
        </Typography>
        <Typography
          sx={{
            mt: 1,
            opacity: 0.92,
            fontWeight: 500,
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            maxWidth: 520,
          }}
        >
          כל האליפויות, השיאים וההיסטוריה של הליגה — במקום אחד.
        </Typography>

        {/* page navigation */}
        <Box sx={{ mt: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {VIEWS.map((v) => {
            const active = view === v.key;
            return (
              <Box
                key={v.key}
                role="button"
                onClick={() => onViewChange(v.key)}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                  px: 2.2,
                  py: 1,
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  backgroundColor: active ? "#fff" : "rgba(255,255,255,0.14)",
                  color: active ? comp.color : "#fff",
                  boxShadow: active
                    ? "0 6px 16px -6px rgba(0,0,0,0.5)"
                    : "none",
                  "&:hover": {
                    backgroundColor: active ? "#fff" : "rgba(255,255,255,0.26)",
                  },
                }}
              >
                <span style={{ marginInlineEnd: 6 }}>{v.emoji}</span>
                {v.label}
              </Box>
            );
          })}
        </Box>

        {view === "seasons" && (
          <ToggleButtonGroup
            value={seasonType}
            exclusive
            onChange={(_e, val) => val != null && onSeasonTypeChange(val)}
            sx={{
              mt: 2.5,
              flexWrap: "wrap",
              gap: 1,
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid rgba(255,255,255,0.35) !important",
                borderRadius: "999px !important",
                color: "rgba(255,255,255,0.92)",
                px: 2,
                py: 0.8,
                fontWeight: 700,
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(255,255,255,0.08)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.22)" },
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  color: comp.color,
                  "&:hover": { backgroundColor: "#fff" },
                },
              },
            }}
          >
            {Object.values(seasonTypes).map((type) => (
              <ToggleButton key={type.key} value={type.key}>
                <span style={{ marginInlineEnd: 6 }}>{type.emoji}</span>
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  );
}

export default Header;
