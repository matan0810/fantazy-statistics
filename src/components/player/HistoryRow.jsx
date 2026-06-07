import { Box, Typography } from "@mui/material";
import { formatSeasonYear } from "../../utils";
import { MEDAL } from "../../constants";

// One season in the player's history list. Handles two "soft" states: an
// unknown final placement (location == null → muted "?") and a season whose
// data was lost (muted title + "נתונים לא זמינים" sub-label, dashes for points).
function HistoryRow({ h }) {
  const top3 = h.location != null && h.location <= 3;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.6,
        px: 1,
        borderRadius: 1.5,
        backgroundColor: top3 ? `${h.comp.accent}10` : "transparent",
      }}
    >
      <Box
        sx={{
          width: 28,
          flexShrink: 0,
          textAlign: "center",
          fontWeight: 800,
          fontSize: "0.85rem",
          color: h.location == null ? "text.disabled" : "inherit",
        }}
        title={h.location == null ? "מיקום לא ידוע" : undefined}
      >
        {h.location == null ? "?" : MEDAL[h.location] ?? h.location}
      </Box>
      <Box sx={{ fontSize: "0.85rem", flexShrink: 0 }}>{h.comp.emoji}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: h.dataLost ? "text.disabled" : "inherit",
          }}
        >
          {h.comp.label} {formatSeasonYear(h.year, h.comp.key)}
        </Typography>
        {h.dataLost && (
          <Typography
            sx={{ fontSize: "0.68rem", color: "text.disabled", lineHeight: 1 }}
          >
            נתונים לא זמינים
          </Typography>
        )}
      </Box>
      <Typography
        sx={{
          flexShrink: 0,
          fontWeight: 800,
          fontSize: "0.85rem",
          color: h.dataLost ? "text.disabled" : h.comp.color,
        }}
      >
        {h.dataLost ? "—" : h.points}
      </Typography>
    </Box>
  );
}

export default HistoryRow;
