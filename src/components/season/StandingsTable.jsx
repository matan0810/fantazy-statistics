import { Box, Paper, Typography, Divider } from "@mui/material";
import StandingRow from "./StandingRow";

// The full ranked standings card. Rows link to the player dialog when stats are
// available for that player.
function StandingsTable({ teams, players, comp, dataLost, statsById, onSelect }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 10px 30px -18px rgba(17,24,39,0.35)",
      }}
    >
      <Box
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.02)",
        }}
      >
        <Typography sx={{ fontWeight: 800 }}>טבלת דירוג מלאה</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
          👆 לחצו על שחקן לפרטים
        </Typography>
      </Box>
      <Divider />
      {teams.map((team, i) => (
        <StandingRow
          key={team.player}
          team={team}
          players={players}
          accent={comp.accent}
          isLast={i === teams.length - 1}
          hidePoints={dataLost}
          clickable={Boolean(statsById[team.player])}
          onClick={() => onSelect(statsById[team.player])}
        />
      ))}
    </Paper>
  );
}

export default StandingsTable;
