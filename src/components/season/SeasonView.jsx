import { useState, useMemo } from "react";
import _ from "lodash";
import { Box, Typography } from "@mui/material";
import { seasonTypes, CARD_SX, T } from "../../constants";
import {
  formatSeasonYear,
  computeStats,
  getProofUrls,
  isLostName,
  renderRankingImage,
  seasonRows,
  SEASON_HEADERS,
} from "../../utils";
import allTeams from "../../data/teams.json";
import Podium from "./Podium";
import SeasonHero from "./SeasonHero";
import StandingsTable from "./StandingsTable";
import PlayerDetailDialog from "../player/PlayerDetailDialog";
import ProofDialog from "../ProofDialog";

function EmptyState() {
  return (
    <Box sx={{ ...CARD_SX, p: 6, textAlign: "center", borderStyle: "dashed" }}>
      <Typography sx={{ fontSize: 40 }}>🗒️</Typography>
      <Typography sx={{ fontWeight: 700, mt: 1, color: "text.secondary" }}>אין נתונים לעונה זו</Typography>
    </Box>
  );
}

function DataLostNote() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        p: 1.75,
        borderRadius: "14px",
        border: `1px dashed ${T.borderHi}`,
        color: "text.secondary",
        fontSize: "0.85rem",
      }}
    >
      <span>🗄️</span>
      <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
        נתוני הנקודות לעונה זו אבדו — מוצג סדר הסיום בלבד, והעונה אינה נכללת בסטטיסטיקת הנקודות.
      </Typography>
    </Box>
  );
}

function SeasonView({ season, seasonInfo, players, seasonType }) {
  const [selected, setSelected] = useState(null);
  const [proofOpen, setProofOpen] = useState(false);
  const statsById = useMemo(() => _.keyBy(computeStats().playerStats, "id"), []);
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];
  const dataLost = Boolean(seasonInfo?.dataLost);
  const proofUrls = useMemo(() => getProofUrls(season), [season]);

  const teams = useMemo(
    () => _.orderBy(allTeams.filter((s) => s.season_id === season), ["location"], ["asc"]),
    [season],
  );

  if (!teams.length) return <EmptyState />;

  const title = `${comp.label} ${formatSeasonYear(seasonInfo?.year, seasonType)}`;
  const top = teams[0]?.points || 1;

  const exportProps = {
    title,
    image: {
      name: `טבלה_${title}`,
      render: () =>
        renderRankingImage({
          eyebrow: `${comp.emoji} ${comp.label} · טבלה סופית`,
          title: formatSeasonYear(seasonInfo?.year, seasonType) + ` · ${comp.label}`,
          subtitle: seasonInfo?.name
            ? `„${seasonInfo.name}” · ${teams.length} משתתפים`
            : `${teams.length} משתתפים`,
          gradient: comp.gradient,
          accent: comp.color,
          rows: teams.map((t, i) => ({
            rank: t.location,
            name: players[t.player]?.label ?? "—",
            sub: [isLostName(t.team_name) ? null : t.team_name, t.coach && `מאמן: ${t.coach}`]
              .filter(Boolean)
              .join(" · "),
            value: dataLost ? null : t.points,
            valueLabel: dataLost ? "" : "נק׳",
            note: !dataLost && i > 0 ? (top - t.points ? `-${top - t.points}` : "0") : null,
            ratio: dataLost ? null : t.points / top,
          })),
        }),
    },
    csv: { name: `טבלה_${title}`, headers: SEASON_HEADERS, rows: seasonRows(teams, dataLost) },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>
      <SeasonHero
        comp={comp}
        seasonInfo={seasonInfo}
        teams={teams}
        players={players}
        dataLost={dataLost}
        hasProof={proofUrls.length > 0}
        onProofClick={() => setProofOpen(true)}
        exportProps={exportProps}
      />

      <Podium teams={teams} players={players} accent={comp.color} hidePoints={dataLost} />

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
      <ProofDialog open={proofOpen} onClose={() => setProofOpen(false)} urls={proofUrls} seasonLabel={title} />
    </Box>
  );
}

export default SeasonView;
