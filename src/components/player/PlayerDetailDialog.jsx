import { Dialog, DialogContent, Box, Typography, Divider } from "@mui/material";
import { MEDAL } from "../../constants";
import PlayerDialogHeader from "./PlayerDialogHeader";
import MiniStat from "./MiniStat";
import CompetitionRow from "./CompetitionRow";
import SeasonHistory from "./SeasonHistory";

function PlayerDetailDialog({ player, onClose }) {
  const open = Boolean(player);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 5, overflow: "hidden" } }}
    >
      {player && (
        <>
          <PlayerDialogHeader player={player} onClose={onClose} />

          <DialogContent sx={{ p: 2.5 }}>
            {/* headline numbers */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <MiniStat label="עונות" value={player.appearances} />
              <MiniStat label="אליפויות" value={player.golds} />
              <MiniStat label="פודיומים" value={player.podiums} />
              <MiniStat
                label="דירוג שיא"
                value={
                  player.bestFinish != null
                    ? MEDAL[player.bestFinish] ?? player.bestFinish
                    : "—"
                }
              />
            </Box>

            {/* per-competition breakdown */}
            <Typography sx={{ fontWeight: 800, mb: 1 }}>
              📊 ביצועים לפי טורניר
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              {player.byCompetition.map((row) => (
                <CompetitionRow key={row.comp.key} row={row} />
              ))}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            {/* season history — compact single-line rows, scrollable */}
            <SeasonHistory history={player.history} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}

export default PlayerDetailDialog;
