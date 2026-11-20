import { Box } from "@mui/material";
import { GOLD } from "../../constants";
import SectionTitle from "../common/SectionTitle";
import RecordCard from "./RecordCard";

function AllTimeRecords({ records }) {
  const { mostTitles, mostPodiums, bestCompAverage } = records;
  return (
    <>
      <SectionTitle emoji="🏅" sub="המובילים בכל הזמנים בתחרויות שנבחרו">
        שיאי כל הזמנים
      </SectionTitle>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.25, sm: 2 } }}>
        <RecordCard emoji="👑" color={GOLD} label="הכי הרבה אליפויות" name={mostTitles?.name ?? "—"} value={mostTitles?.golds} unit="אליפויות" />
        <RecordCard emoji="🎖️" color="#94b4ff" label="הכי הרבה פודיומים" name={mostPodiums?.name ?? "—"} value={mostPodiums?.podiums} unit="פודיומים" />
        <RecordCard
          emoji="📈"
          color={bestCompAverage?.comp.color ?? "#a78bfa"}
          label="שיא ממוצע בתחרות"
          name={bestCompAverage?.name ?? "—"}
          value={bestCompAverage?.avgPoints}
          unit="נק׳ בממוצע"
          sub={bestCompAverage ? `${bestCompAverage.comp.emoji} ${bestCompAverage.comp.label} · ${bestCompAverage.appearances} עונות` : "אין מספיק נתונים"}
        />
      </Box>
    </>
  );
}

export default AllTimeRecords;
