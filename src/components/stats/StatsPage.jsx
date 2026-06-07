import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { computeStats } from "../../utils";
import PlayerDetailDialog from "../player/PlayerDetailDialog";
import CompetitionFilter from "./CompetitionFilter";
import AllTimeRecords from "./AllTimeRecords";
import HallOfFame from "./HallOfFame";
import AverageLeaders from "./AverageLeaders";
import CompetitionBreakdown from "./CompetitionBreakdown";

// Default: all competitions except Ligat HaAl (type 4)
const DEFAULT_COMPS = new Set([1, 2, 3]);

function StatsPage() {
  const [selectedComps, setSelectedComps] = useState(DEFAULT_COMPS);
  const [selected, setSelected] = useState(null);

  const toggleComp = (key) => {
    setSelectedComps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const stats = useMemo(() => computeStats(selectedComps), [selectedComps]);
  const { hallOfFame, playerStats, records, titlesByCompetition, totals } = stats;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pb: 6 }}>
      <CompetitionFilter selected={selectedComps} onToggle={toggleComp} />

      {/* totals strip */}
      <Typography sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5 }}>
        {totals.seasons} עונות · {totals.players} שחקנים · {totals.records} רישומים
      </Typography>

      <AllTimeRecords records={records} />
      <HallOfFame players={hallOfFame} onSelect={setSelected} />
      <AverageLeaders playerStats={playerStats} onSelect={setSelected} />
      <CompetitionBreakdown titlesByCompetition={titlesByCompetition} />

      <PlayerDetailDialog player={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}

export default StatsPage;
