import { Box, Typography } from "@mui/material";
import { CARD_SX, EYEBROW_SX, T } from "../../constants";
import StandingRow from "./StandingRow";
import { COLS } from "./standingsLayout";

// Full ranked standings. Rows open the player dialog when stats exist.
function StandingsTable({ teams, players, comp, dataLost, statsById, onSelect }) {
  const top = teams[0]?.points || 1;
  return (
    <Box className="fade-up" sx={{ ...CARD_SX, overflow: "hidden", animationDelay: "120ms" }}>
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2, pb: 1.5, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
        <Typography sx={{ fontWeight: 900, fontSize: "1.1rem" }}>טבלה סופית</Typography>
        <Typography sx={{ color: "text.disabled", fontSize: "0.75rem", fontWeight: 600 }}>
          לחצו על שחקן לכרטיס המלא
        </Typography>
      </Box>

      {/* column headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: COLS,
          alignItems: "center",
          columnGap: { xs: 1.25, sm: 2 },
          px: { xs: 2, sm: 2.5 },
          py: 0.9,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          backgroundColor: "rgba(255,255,255,0.02)",
          "& > *": { ...EYEBROW_SX, fontSize: "0.66rem" },
        }}
      >
        <Box sx={{ textAlign: "center" }}>#</Box>
        <Box>שחקן · קבוצה</Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>מאמן</Box>
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>פער</Box>
        <Box sx={{ textAlign: "center" }}>נק׳</Box>
        <Box />
      </Box>

      {teams.map((team, i) => (
        <StandingRow
          key={team.player}
          index={i}
          team={team}
          players={players}
          accent={comp.color}
          isLast={i === teams.length - 1}
          hidePoints={dataLost}
          gap={i === 0 || dataLost ? null : top - team.points}
          ratio={dataLost ? null : team.points / top}
          clickable={Boolean(statsById[team.player])}
          onClick={() => onSelect(statsById[team.player])}
        />
      ))}
    </Box>
  );
}

export default StandingsTable;
