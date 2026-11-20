import { Dialog, DialogContent, Box, Typography } from "@mui/material";
import { MEDAL, EYEBROW_SX, GOLD } from "../../constants";
import PlayerDialogHeader from "./PlayerDialogHeader";
import MiniStat from "./MiniStat";
import CompetitionRow from "./CompetitionRow";
import SeasonHistory from "./SeasonHistory";

function PlayerDetailDialog({ player, onClose }) {
  return (
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "24px", overflow: "hidden" } }}>
      {player && (
        <>
          <PlayerDialogHeader player={player} onClose={onClose} />
          <DialogContent sx={{ p: 2.25 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
              <MiniStat label="עונות" value={player.appearances} />
              <MiniStat label="אליפויות" value={player.golds} color={player.golds ? GOLD : undefined} />
              <MiniStat label="פודיומים" value={player.podiums} />
              <MiniStat
                label="דירוג שיא"
                value={player.bestFinish != null ? MEDAL[player.bestFinish] ?? player.bestFinish : "—"}
              />
            </Box>

            <Typography sx={{ ...EYEBROW_SX, mb: 1 }}>ביצועים לפי טורניר</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
              {player.byCompetition.map((row) => (
                <CompetitionRow key={row.comp.key} row={row} />
              ))}
            </Box>

            <SeasonHistory history={player.history} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}

export default PlayerDetailDialog;
