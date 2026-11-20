import { Box, Typography } from "@mui/material";
import { MEDAL, NUM_SX, T, alpha } from "../../constants";

// One card per competition — averages are the headline number since the game
// count is consistent within a single competition.
function CompetitionRow({ row }) {
  const { comp } = row;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.4,
        borderRadius: "14px",
        border: `1px solid ${T.border}`,
        background: `linear-gradient(270deg, ${alpha(comp.color, 0.14)}, transparent 70%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": { content: '""', position: "absolute", insetBlock: 0, insetInlineStart: 0, width: 3, backgroundColor: comp.color },
      }}
    >
      <Box sx={{ fontSize: 22, lineHeight: 1 }}>{comp.emoji}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.2 }}>{comp.label}</Typography>
        <Typography
          noWrap
          title={row.appearances > row.validAppearances ? `${row.validAppearances} עונות עם נתוני נקודות` : undefined}
          sx={{ color: "text.secondary", fontSize: "0.75rem" }}
        >
          {row.appearances} עונות · שיא {row.bestPoints}
          {row.golds > 0
            ? ` · ${row.golds} ${row.golds === 1 ? "תואר" : "תארים"}`
            : row.bestFinish != null && ` · הכי גבוה: ${MEDAL[row.bestFinish] ?? `מקום ${row.bestFinish}`}`}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", flexShrink: 0 }}>
        <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.6rem", color: comp.color, lineHeight: 1 }}>
          {row.avgPoints}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.62rem", fontWeight: 700 }}>ממוצע</Typography>
      </Box>
    </Box>
  );
}

export default CompetitionRow;
