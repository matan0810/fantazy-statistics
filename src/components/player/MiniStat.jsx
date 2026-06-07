import { Box, Typography } from "@mui/material";
import { DARK } from "../../constants";

// One of the four headline numbers at the top of the player dialog.
function MiniStat({ label, value }) {
  return (
    <Box
      sx={{
        flex: "1 1 80px",
        textAlign: "center",
        p: 1,
        borderRadius: 3,
        backgroundColor: "rgba(124,58,237,0.07)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: "1.35rem",
          lineHeight: 1.1,
          color: DARK,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ color: "text.secondary", fontSize: "0.72rem", fontWeight: 700 }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default MiniStat;
