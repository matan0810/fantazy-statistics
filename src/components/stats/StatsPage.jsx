import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { computeStats, renderRankingImage } from "../../utils";
import { seasonTypes } from "../../constants";
import PlayerDetailDialog from "../player/PlayerDetailDialog";
import CompetitionFilter from "./CompetitionFilter";
import AllTimeRecords from "./AllTimeRecords";
import HallOfFame from "./HallOfFame";
import AverageLeaders from "./AverageLeaders";
import CompetitionBreakdown from "./CompetitionBreakdown";
import StatsHero from "./StatsHero";

// Default: all competitions except Ligat HaAl (type 4)
const DEFAULT_COMPS = new Set([1, 2, 3]);

const HOF_HEADERS = ["מקום", "שחקן", "עונות", "אליפויות", "מקום שני", "מקום שלישי", "פודיומים", "ממוצע נקודות"];

function StatsPage() {
  const [selectedComps, setSelectedComps] = useState(DEFAULT_COMPS);
  const [selected, setSelected] = useState(null);

  const toggleComp = (key) => {
    setSelectedComps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else next.add(key);
      return next;
    });
  };

  const stats = useMemo(() => computeStats(selectedComps), [selectedComps]);
  const { hallOfFame, playerStats, records, titlesByCompetition, totals } = stats;

  const compNames = [...selectedComps].sort().map((k) => seasonTypes[k].label).join(" · ");
  const maxGolds = hallOfFame[0]?.golds || 1;

  const exportProps = {
    title: "טבלת המדליות",
    image: {
      name: "היכל_התהילה_טבלת_מדליות",
      render: () =>
        renderRankingImage({
          eyebrow: "🏆 היכל התהילה · כל הזמנים",
          title: "טבלת המדליות",
          subtitle: compNames,
          gradient: ["#1a0f3d", "#7c3aed"],
          accent: "#a78bfa",
          rows: hallOfFame.map((p, i) => ({
            rank: i + 1,
            name: p.name,
            sub: `${p.appearances} עונות · ${p.silvers} מקום שני · ${p.bronzes} מקום שלישי`,
            value: p.golds,
            valueLabel: "תארים",
            ratio: p.golds / maxGolds,
          })),
        }),
    },
    csv: {
      name: "היכל_התהילה_טבלת_מדליות",
      headers: HOF_HEADERS,
      rows: hallOfFame.map((p, i) => [i + 1, p.name, p.appearances, p.golds, p.silvers, p.bronzes, p.podiums, p.avgPoints]),
    },
  };

  const goSeason = (id) => {
    window.location.hash = `#/season/${id}`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <StatsHero totals={totals} exportProps={exportProps} />
      <CompetitionFilter selected={selectedComps} onToggle={toggleComp} />
      <AllTimeRecords records={records} />
      <HallOfFame players={hallOfFame} onSelect={setSelected} />
      <AverageLeaders playerStats={playerStats} onSelect={setSelected} />
      <CompetitionBreakdown titlesByCompetition={titlesByCompetition} onSeason={goSeason} />
      <PlayerDetailDialog player={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}

export default StatsPage;
