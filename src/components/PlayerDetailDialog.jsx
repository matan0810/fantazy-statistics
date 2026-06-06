import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatSeasonYear } from "../utils/format";

const ACCENT = "#7c3aed";
const DARK = "#5b21b6";
const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

function MiniStat({ label, value }) {
  return (
    <Box
      sx={{
        flex: "1 1 80px",
        textAlign: "center",
        p: 1,
        borderRadius: 3,
        backgroundColor: "rgba(124,58,237,0.07)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: "1.35rem",
          lineHeight: 1.1,
          color: DARK,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ color: "text.secondary", fontSize: "0.72rem", fontWeight: 700 }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// One card per competition the player took part in — averages are the headline
// number since the game count is consistent within a single competition.
function CompetitionRow({ row }) {
  const { comp } = row;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.25,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        borderInlineStart: `4px solid ${comp.color}`,
        backgroundColor: `${comp.accent}0a`,
      }}
    >
      <Box sx={{ fontSize: 22 }}>{comp.emoji}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.2 }}
        >
          {comp.label}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
          {row.appearances} עונות · שיא {row.bestPoints} · דירוג טוב{" "}
          {MEDAL[row.bestFinish] ?? row.bestFinish}
          {row.golds > 0 && ` · ${row.golds}×🥇`}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", flexShrink: 0 }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.3rem",
            color: comp.color,
            lineHeight: 1,
          }}
        >
          {row.avgPoints}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.62rem" }}>
          ממוצע
        </Typography>
      </Box>
    </Box>
  );
}

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
          {/* header */}
          <Box
            sx={{
              p: 2.5,
              color: "#fff",
              background: `linear-gradient(135deg, ${DARK}, ${ACCENT})`,
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "rgba(255,255,255,0.9)",
                color: DARK,
                fontWeight: 900,
                fontSize: "1.6rem",
              }}
            >
              {player.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                sx={{ fontWeight: 900, fontSize: "1.5rem", lineHeight: 1.1 }}
              >
                {player.name}
              </Typography>
              <Typography sx={{ opacity: 0.9, fontSize: "0.9rem" }}>
                {MEDAL[1]} {player.golds} · {MEDAL[2]} {player.silvers} ·{" "}
                {MEDAL[3]} {player.bronzes}
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{ p: 2.5 }}>
            {/* headline numbers */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <MiniStat label="עונות" value={player.appearances} />
              <MiniStat label="אליפויות" value={player.golds} />
              <MiniStat label="פודיומים" value={player.podiums} />
              <MiniStat
                label="דירוג שיא"
                value={MEDAL[player.bestFinish] ?? player.bestFinish}
              />
            </Box>

            {/* per-competition breakdown */}
            <Typography sx={{ fontWeight: 800, mb: 1 }}>
              📊 ביצועים לפי טורניר
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
            >
              {player.byCompetition.map((row) => (
                <CompetitionRow key={row.comp.key} row={row} />
              ))}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            {/* season history — compact single-line rows, scrollable */}
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>📜 היסטוריית עונות</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                {player.history.length} עונות
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: 240,
                overflowY: "auto",
                pr: 0.5,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.18)",
                  borderRadius: 3,
                },
              }}
            >
              {player.history.map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.6,
                    px: 1,
                    borderRadius: 1.5,
                    backgroundColor:
                      h.location <= 3 ? `${h.comp.accent}10` : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      flexShrink: 0,
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    {MEDAL[h.location] ?? h.location}
                  </Box>
                  <Box sx={{ fontSize: "0.85rem", flexShrink: 0 }}>{h.comp.emoji}</Box>
                  <Typography
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {h.comp.label} {formatSeasonYear(h.year, h.comp.key)}
                  </Typography>
                  <Typography
                    sx={{
                      flexShrink: 0,
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      color: h.comp.color,
                    }}
                  >
                    {h.points}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}

export default PlayerDetailDialog;
