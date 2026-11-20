import { Box } from "@mui/material";
import SectionTitle from "../common/SectionTitle";
import CompetitionCard from "./CompetitionCard";

function CompetitionBreakdown({ titlesByCompetition, onSeason }) {
  return (
    <>
      <SectionTitle emoji="🗂️" sub="תארים, שיא נקודות וכל האלופים — לכל תחרות בנפרד">
        ארכיון האלופים
      </SectionTitle>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, gap: { xs: 1.5, sm: 2 }, alignItems: "start" }}>
        {titlesByCompetition.map((c) => (
          <CompetitionCard key={c.comp.key} {...c} onSeason={onSeason} />
        ))}
      </Box>
    </>
  );
}

export default CompetitionBreakdown;
