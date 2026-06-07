import { Box, Typography } from "@mui/material";
import { MEDAL_COLORS } from "../../constants";

// Compact gold/silver/bronze count pills. Zero-count medals are hidden, and an
// em-dash is shown when the player has no podiums at all.
function MedalPills({ golds, silvers, bronzes }) {
  const pills = [
    { emoji: "🥇", count: golds, color: MEDAL_COLORS.gold },
    { emoji: "🥈", count: silvers, color: MEDAL_COLORS.silver },
    { emoji: "🥉", count: bronzes, color: MEDAL_COLORS.bronze },
  ].filter((p) => p.count > 0);

  if (!pills.length)
    return (
      <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>—</Typography>
    );

  return (
    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
      {pills.map((p) => (
        <Box
          key={p.emoji}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.3,
            px: 0.9,
            py: 0.2,
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "0.82rem",
            backgroundColor: `${p.color}22`,
            color: "#444",
          }}
        >
          <span>{p.emoji}</span>
          {p.count}
        </Box>
      ))}
    </Box>
  );
}

export default MedalPills;
