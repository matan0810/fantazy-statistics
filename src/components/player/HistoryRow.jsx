import { Box, Typography } from "@mui/material";
import { formatSeasonYear } from "../../utils";
import { NUM_SX, T } from "../../constants";
import RankBadge from "../season/RankBadge";

// One season in the player's history list. Handles an unknown placement
// (location == null → "?") and seasons whose points data was lost.
function HistoryRow({ h, isLast }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 0.85, px: 1.25, borderBottom: isLast ? "none" : `1px solid ${T.border}` }}>
      <Box sx={{ flexShrink: 0 }} title={h.location == null ? "מיקום לא ידוע" : undefined}>
        <RankBadge rank={h.location} size={24} />
      </Box>
      <Box sx={{ fontSize: "0.9rem", flexShrink: 0 }}>{h.comp.emoji}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 600, fontSize: "0.85rem", color: h.dataLost ? "text.disabled" : "inherit" }}>
          {h.comp.label} {formatSeasonYear(h.year, h.comp.key)}
          {h.dataLost && (
            <Box component="span" sx={{ fontSize: "0.68rem", color: "text.disabled", marginInlineStart: 0.75 }}>
              · נתונים חסרים
            </Box>
          )}
        </Typography>
      </Box>
      <Typography sx={{ ...NUM_SX, flexShrink: 0, fontWeight: 800, fontSize: "1.05rem", color: h.dataLost ? "text.disabled" : h.comp.color }}>
        {h.dataLost ? "—" : h.points}
      </Typography>
    </Box>
  );
}

export default HistoryRow;
