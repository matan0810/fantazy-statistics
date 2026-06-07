import { Box, Typography, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ACCENT, DARK, MEDAL } from "../../constants";

// Gradient header of the player dialog: avatar, name and medal tally.
function PlayerDialogHeader({ player, onClose }) {
  return (
    <Box
      sx={{
        p: 2.5,
        color: "#fff",
        background: `linear-gradient(135deg, ${DARK}, ${ACCENT})`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Avatar
        sx={{
          width: 60,
          height: 60,
          bgcolor: "rgba(255,255,255,0.9)",
          color: DARK,
          fontWeight: 900,
          fontSize: "1.6rem",
        }}
      >
        {player.name.charAt(0)}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: "1.5rem", lineHeight: 1.1 }}>
          {player.name}
        </Typography>
        <Typography sx={{ opacity: 0.9, fontSize: "0.9rem" }}>
          {MEDAL[1]} {player.golds} · {MEDAL[2]} {player.silvers} · {MEDAL[3]}{" "}
          {player.bronzes}
        </Typography>
      </Box>
    </Box>
  );
}

export default PlayerDialogHeader;
