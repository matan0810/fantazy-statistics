import { Box } from "@mui/material";
import SectionTitle from "../common/SectionTitle";
import RecordCard from "./RecordCard";

// The "all-time records" strip: most titles, most podiums, best season average.
function AllTimeRecords({ records }) {
  const { mostTitles, mostPodiums, bestCompAverage } = records;

  return (
    <>
      <SectionTitle emoji="🏅">שיאי כל הזמנים</SectionTitle>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.25, sm: 2 } }}>
        <RecordCard
          emoji="👑"
          label="הכי הרבה אליפויות"
          name={mostTitles?.name}
          highlight={`${mostTitles?.golds} אליפויות`}
        />
        <RecordCard
          emoji="🎖️"
          label="הכי הרבה פודיומים"
          name={mostPodiums?.name}
          highlight={`${mostPodiums?.podiums} פודיומים`}
        />
        <RecordCard
          emoji="📊"
          label="שיא ממוצע עונתי"
          name={bestCompAverage?.name ?? "—"}
          highlight={bestCompAverage ? `${bestCompAverage.avgPoints} בממוצע` : null}
          sub={
            bestCompAverage
              ? `${bestCompAverage.comp.emoji} ${bestCompAverage.comp.label}`
              : "אין מספיק נתונים"
          }
        />
      </Box>
    </>
  );
}

export default AllTimeRecords;
