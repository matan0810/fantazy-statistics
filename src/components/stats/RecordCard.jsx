import { Box, Paper, Typography } from "@mui/material";
import { ACCENT, DARK, CARD_SX } from "../../constants";

// A single all-time record tile (most titles / podiums / best average).
function RecordCard({ emoji, label, name, highlight, sub }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...CARD_SX,
        flex: "1 1 200px",
        minWidth: 0,
        p: 2.25,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(155deg, ${ACCENT}1a 0%, #fff 60%)`,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px -16px rgba(17,24,39,0.4)",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{ position: "absolute", left: 12, top: 8, fontSize: 46, opacity: 0.16 }}
      >
        {emoji}
      </Box>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          mb: 0.75,
          backgroundColor: `${ACCENT}1f`,
        }}
      >
        {emoji}
      </Box>
      <Typography
        sx={{ color: "text.secondary", fontSize: "0.78rem", fontWeight: 700 }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", lineHeight: 1.2 }}>
        {name}
      </Typography>
      {highlight != null && (
        <Typography sx={{ fontWeight: 900, color: DARK, fontSize: "1rem" }}>
          {highlight}
        </Typography>
      )}
      {sub && (
        <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

export default RecordCard;
