import { Box, Typography } from "@mui/material";
import { CARD_SX, NUM_SX, EYEBROW_SX, alpha } from "../../constants";

// A single all-time record tile.
function RecordCard({ emoji, label, name, value, unit, sub, color = "#a78bfa" }) {
  return (
    <Box
      sx={{
        ...CARD_SX,
        flex: "1 1 200px",
        minWidth: 0,
        p: 2.25,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${alpha(color, 0.18)}, transparent 60%)`,
        transition: "transform .18s ease, border-color .18s ease",
        "&:hover": { transform: "translateY(-3px)", borderColor: alpha(color, 0.4) },
      }}
    >
      <Box aria-hidden sx={{ position: "absolute", left: 10, bottom: -14, fontSize: 84, opacity: 0.08, lineHeight: 1 }}>
        {emoji}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", fontSize: 18, backgroundColor: alpha(color, 0.16), border: `1px solid ${alpha(color, 0.3)}` }}>
          {emoji}
        </Box>
        <Typography sx={{ ...EYEBROW_SX }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontWeight: 900, fontSize: "1.35rem", lineHeight: 1.15 }}>{name}</Typography>
      {value != null && (
        <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "2.4rem", lineHeight: 1.05, color }}>
          {value}
          <Box component="span" sx={{ fontFamily: "Heebo", fontSize: "0.85rem", fontWeight: 700, color: "text.secondary", marginInlineStart: 0.75 }}>
            {unit}
          </Box>
        </Typography>
      )}
      {sub && <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", mt: 0.25 }}>{sub}</Typography>}
    </Box>
  );
}

export default RecordCard;
