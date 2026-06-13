import { useState, useMemo } from "react";
import _ from "lodash";
import { Box, Paper, Typography } from "@mui/material";
import { seasonTypes } from "../../constants";
import { formatSeasonYear, computeStats, getProofUrls } from "../../utils";
import allTeams from "../../data/teams.json";
import Podium from "./Podium";
import SeasonHeader from "./SeasonHeader";
import SeasonSummary from "./SeasonSummary";
import StandingsTable from "./StandingsTable";
import PlayerDetailDialog from "../player/PlayerDetailDialog";
import ProofDialog from "../ProofDialog";

function EmptyState() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: 4,
        border: "1px dashed rgba(0,0,0,0.15)",
        color: "text.secondary",
      }}
    >
      <Typography sx={{ fontSize: 40 }}>🗒️</Typography>
      <Typography sx={{ fontWeight: 700, mt: 1 }}>אין נתונים לעונה זו</Typography>
    </Paper>
  );
}

function DataLostNote() {
  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        color: "text.secondary",
        fontSize: "0.82rem",
        textAlign: "center",
        px: 2,
      }}
    >
      <span>🗄️</span>
      <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
        הנתונים לעונה זו אבדו — מוצג סדר הסיום בלבד, והעונה אינה נכללת בסטטיסטיקת
        הנקודות.
      </Typography>
    </Box>
  );
}

function PlayerTable({ season, seasonInfo, players, seasonType }) {
  const [selected, setSelected] = useState(null);
  const [proofOpen, setProofOpen] = useState(false);
  const statsById = useMemo(
    () => _.keyBy(computeStats().playerStats, "id"),
    [],
  );
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];
  const dataLost = Boolean(seasonInfo?.dataLost);
  const proofUrls = useMemo(() => getProofUrls(season), [season]);

  const teams = useMemo(
    () =>
      _.orderBy(
        allTeams.filter((s) => s.season_id === season),
        ["location"],
        ["asc"],
      ),
    [season],
  );

  if (!teams.length) return <EmptyState />;

  const champion = teams[0];
  const championName = players[champion.player]?.label ?? "—";
  const topPoints = _.maxBy(teams, "points")?.points ?? 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 5 }}>
      <SeasonHeader
        comp={comp}
        seasonInfo={seasonInfo}
        seasonType={seasonType}
        dataLost={dataLost}
        hasProof={proofUrls.length > 0}
        onProofClick={() => setProofOpen(true)}
      />

      <SeasonSummary
        champion={champion}
        championName={championName}
        teamCount={teams.length}
        topPoints={topPoints}
        dataLost={dataLost}
        accent={comp.accent}
      />

      <Podium
        teams={teams}
        players={players}
        accent={comp.accent}
        hidePoints={dataLost}
      />

      <StandingsTable
        teams={teams}
        players={players}
        comp={comp}
        dataLost={dataLost}
        statsById={statsById}
        onSelect={setSelected}
      />

      {dataLost && <DataLostNote />}

      <PlayerDetailDialog player={selected} onClose={() => setSelected(null)} />

      <ProofDialog
        open={proofOpen}
        onClose={() => setProofOpen(false)}
        urls={proofUrls}
        seasonLabel={`${comp.label} ${formatSeasonYear(seasonInfo?.year, seasonType)}`}
      />
    </Box>
  );
}

export default PlayerTable;
