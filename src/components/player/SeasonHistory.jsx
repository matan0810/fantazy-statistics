import { Box, Typography } from "@mui/material";
import { EYEBROW_SX, T } from "../../constants";
import HistoryRow from "./HistoryRow";

// Scrollable season-by-season history (newest first).
function SeasonHistory({ history }) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={EYEBROW_SX}>היסטוריית עונות</Typography>
        <Typography sx={{ color: "text.disabled", fontSize: "0.72rem", fontWeight: 600 }}>{history.length} עונות</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: 260,
          overflowY: "auto",
          borderRadius: "14px",
          border: `1px solid ${T.border}`,
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        {history.map((h, i) => (
          <HistoryRow key={i} h={h} isLast={i === history.length - 1} />
        ))}
      </Box>
    </>
  );
}

export default SeasonHistory;
