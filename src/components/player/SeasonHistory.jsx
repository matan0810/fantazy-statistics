import { Box, Typography } from "@mui/material";
import HistoryRow from "./HistoryRow";

// Scrollable season-by-season history (newest first) with a count header.
function SeasonHistory({ history }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 800 }}>📜 היסטוריית עונות</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
          {history.length} עונות
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: 240,
          overflowY: "auto",
          pr: 0.5,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.18)",
            borderRadius: 3,
          },
        }}
      >
        {history.map((h, i) => (
          <HistoryRow key={i} h={h} />
        ))}
      </Box>
    </>
  );
}

export default SeasonHistory;
