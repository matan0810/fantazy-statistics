import { Box, Typography } from "@mui/material";
import { MEDAL_COLORS, NUM_SX, alpha } from "../../constants";

// Compact gold/silver/bronze count pills. Zero-count medals are hidden.
function MedalPills({ golds, silvers, bronzes, onDark }) {
  const pills = [
    { emoji: "🥇", count: golds, color: MEDAL_COLORS.gold },
    { emoji: "🥈", count: silvers, color: MEDAL_COLORS.silver },
    { emoji: "🥉", count: bronzes, color: MEDAL_COLORS.bronze },
  ].filter((p) => p.count > 0);

  if (!pills.length)
    return <Typography sx={{ color: "text.disabled", fontSize: "0.8rem" }}>—</Typography>;

  return (
    <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap" }}>
      {pills.map((p) => (
        <Box
          key={p.emoji}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.4,
            pl: 0.9,
            pr: 0.6,
            py: 0.15,
            borderRadius: 999,
            ...NUM_SX,
            fontWeight: 800,
            fontSize: "0.95rem",
            backgroundColor: onDark ? "rgba(0,0,0,0.28)" : alpha(p.color, 0.12),
            border: `1px solid ${alpha(p.color, onDark ? 0.45 : 0.3)}`,
            color: onDark ? "#fff" : p.color,
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>{p.emoji}</span>
          {p.count}
        </Box>
      ))}
    </Box>
  );
}

export default MedalPills;
