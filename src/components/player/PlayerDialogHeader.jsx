import { Box, Typography, Avatar, IconButton } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { DARK, GOLD, EYEBROW_SX } from "../../constants";
import MedalPills from "../common/MedalPills";

// Gradient header of the player card: avatar, name, rank and medal tally.
function PlayerDialogHeader({ player, onClose }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 2.5,
        pt: 3,
        color: "#fff",
        background: `radial-gradient(120% 120% at 100% 0%, #8b5cf6 0%, ${DARK} 40%, #1e1147 100%)`,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 20px)", maskImage: "linear-gradient(90deg, #000, transparent 70%)" }} />
      <IconButton onClick={onClose} size="small" aria-label="סגירה" sx={{ position: "absolute", top: 10, left: 10, color: "rgba(255,255,255,0.85)", backgroundColor: "rgba(0,0,0,0.2)" }}>
        <CloseRounded fontSize="small" />
      </IconButton>
      <Avatar
        sx={{
          position: "relative",
          width: 68,
          height: 68,
          fontWeight: 900,
          fontSize: "1.9rem",
          color: player.golds ? "#1a1206" : DARK,
          background: player.golds ? "linear-gradient(135deg, #fde68a, #f59e0b)" : "rgba(255,255,255,0.92)",
          boxShadow: player.golds ? `0 0 0 3px rgba(0,0,0,0.2), 0 0 28px ${GOLD}77` : "0 0 0 3px rgba(0,0,0,0.2)",
        }}
      >
        {player.name.charAt(0)}
      </Avatar>
      <Box sx={{ position: "relative", minWidth: 0 }}>
        <Typography sx={{ ...EYEBROW_SX, color: "rgba(255,255,255,0.7)" }}>כרטיס שחקן</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: "1.7rem", lineHeight: 1.1, mb: 0.75 }}>{player.name}</Typography>
        <MedalPills golds={player.golds} silvers={player.silvers} bronzes={player.bronzes} onDark />
      </Box>
    </Box>
  );
}

export default PlayerDialogHeader;
