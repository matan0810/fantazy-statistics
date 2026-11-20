import { Box, Typography } from "@mui/material";
import { NUM_SX, EYEBROW_SX, T } from "../../constants";

// One of the headline numbers at the top of the player dialog.
function MiniStat({ label, value, color }) {
  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 0,
        textAlign: "center",
        py: 1.1,
        px: 0.5,
        borderRadius: "14px",
        backgroundColor: "rgba(255,255,255,0.035)",
        border: `1px solid ${T.border}`,
      }}
    >
      <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.65rem", lineHeight: 1.05, color: color ?? T.text }}>
        {value}
      </Typography>
      <Typography sx={{ ...EYEBROW_SX, fontSize: "0.64rem" }} noWrap>
        {label}
      </Typography>
    </Box>
  );
}

export default MiniStat;
