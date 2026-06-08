import { Box } from "@mui/material";
import {
  EmojiEvents as EmojiEventsIcon,
  Groups as GroupsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
} from "@mui/icons-material";
import { isLostName } from "../../utils";
import SeasonStatCard from "./SeasonStatCard";

// The three summary tiles above the standings. The points-record tile is hidden
// for seasons whose point data was lost.
function SeasonSummary({
  champion,
  championName,
  teamCount,
  topPoints,
  dataLost,
  accent,
}) {
  return (
    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
      <SeasonStatCard
        icon={<EmojiEventsIcon />}
        label="האלוף"
        value={championName}
        sub={isLostName(champion.team_name) ? undefined : champion.team_name}
        accent={accent}
      />
      <SeasonStatCard
        icon={<GroupsIcon />}
        label="מספר משתתפים"
        value={teamCount}
        sub="קבוצות"
        accent={accent}
      />
      {!dataLost && (
        <SeasonStatCard
          icon={<LocalFireDepartmentIcon />}
          label="שיא נקודות"
          value={topPoints}
          sub="בעונה"
          accent={accent}
        />
      )}
    </Box>
  );
}

export default SeasonSummary;
