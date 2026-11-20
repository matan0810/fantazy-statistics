import { Box, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { seasonTypes, T, alpha } from "../../constants";

// Multi-select competition filter. The parent keeps at least one active.
function CompetitionFilter({ selected, onToggle }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "text.secondary", mb: 1, px: 0.25 }}>
        תחרויות בחישוב <Box component="span" sx={{ color: "text.disabled", fontWeight: 500 }}>· בחירה מרובה</Box>
      </Typography>
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
        {Object.values(seasonTypes).map((o) => {
          const active = selected.has(o.key);
          return (
            <Box
              key={o.key}
              component="button"
              aria-pressed={active}
              onClick={() => onToggle(o.key)}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
                px: 1.4,
                py: 0.7,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.86rem",
                border: "1px solid",
                borderColor: active ? alpha(o.color, 0.6) : T.border,
                backgroundColor: active ? alpha(o.color, 0.16) : "rgba(255,255,255,0.025)",
                color: active ? T.text : T.textMute,
                transition: "all .15s",
                "&:hover": { borderColor: alpha(o.color, 0.6), color: T.text },
                "&:focus-visible": { outline: `2px solid ${o.color}`, outlineOffset: 2 },
              }}
            >
              <span>{o.emoji}</span>
              {o.label}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: active ? o.color : "transparent",
                  border: active ? "none" : `1.5px solid ${T.borderHi}`,
                  color: "#0a0f1c",
                }}
              >
                {active && <CheckRounded sx={{ fontSize: 12 }} />}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default CompetitionFilter;
