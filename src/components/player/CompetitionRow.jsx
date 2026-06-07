import { Box, Typography } from "@mui/material";
import { MEDAL } from "../../constants";

// One card per competition the player took part in — averages are the headline
// number since the game count is consistent within a single competition.
function CompetitionRow({ row }) {
  const { comp } = row;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.25,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        borderInlineStart: `4px solid ${comp.color}`,
        backgroundColor: `${comp.accent}0a`,
      }}
    >
      <Box sx={{ fontSize: 22 }}>{comp.emoji}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.2 }}>
          {comp.label}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
          {row.appearances} עונות
          {row.appearances > row.validAppearances && (
            <span style={{ opacity: 0.65 }}>
              {" "}
              ({row.validAppearances} עם נתונים)
            </span>
          )}
          {" · "}שיא {row.bestPoints} · דירוג טוב{" "}
          {row.bestFinish != null ? MEDAL[row.bestFinish] ?? row.bestFinish : "—"}
          {row.golds > 0 && ` · ${row.golds}×🥇`}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", flexShrink: 0 }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.3rem",
            color: comp.color,
            lineHeight: 1,
          }}
        >
          {row.avgPoints}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.62rem" }}>
          ממוצע
        </Typography>
      </Box>
    </Box>
  );
}

export default CompetitionRow;
