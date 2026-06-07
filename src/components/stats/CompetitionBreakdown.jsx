import { Box } from "@mui/material";
import SectionTitle from "../common/SectionTitle";
import CompetitionCard from "./CompetitionCard";

// Grid of per-tournament cards (champions + points record).
function CompetitionBreakdown({ titlesByCompetition }) {
  return (
    <>
      <SectionTitle emoji="🗂️" sub="אלופים ושיא נקודות בעונה — לכל תחרות בנפרד">
        לפי טורניר
      </SectionTitle>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.25, sm: 2 } }}>
        {titlesByCompetition.map(({ comp, seasons, ranked, recordSeason }) => (
          <CompetitionCard
            key={comp.key}
            comp={comp}
            seasons={seasons}
            ranked={ranked}
            recordSeason={recordSeason}
          />
        ))}
      </Box>
    </>
  );
}

export default CompetitionBreakdown;
