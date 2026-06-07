import { Box, Paper, Typography } from "@mui/material";
import { CARD_SX } from "../../constants";
import { formatSeasonYear } from "../../utils";

// A single tournament card: champions ranking plus the all-time season points
// record for that competition.
function CompetitionCard({ comp, seasons, ranked, recordSeason }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...CARD_SX,
        flex: "1 1 250px",
        minWidth: 0,
        overflow: "hidden",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px -16px rgba(17,24,39,0.4)",
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          color: "#fff",
          background: `linear-gradient(135deg, ${comp.gradient[0]}, ${comp.gradient[1]})`,
        }}
      >
        <Typography sx={{ fontWeight: 800 }}>
          {comp.emoji} {comp.label}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
          {seasons} עונות
        </Typography>
      </Box>
      <Box sx={{ p: 1.5 }}>
        {ranked.length ? (
          ranked.map((r, idx) => (
            <Box
              key={r.name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.6,
                fontWeight: idx === 0 ? 800 : 500,
              }}
            >
              <Typography sx={{ fontSize: "0.92rem", fontWeight: "inherit" }}>
                {idx === 0 ? "👑 " : `${idx + 1}. `}
                {r.name}
              </Typography>
              <Typography
                sx={{ fontSize: "0.92rem", fontWeight: 800, color: comp.color }}
              >
                {r.count} 🥇
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", py: 1 }}>
            אין נתונים
          </Typography>
        )}

        {recordSeason && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: "1px dashed rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ fontSize: "0.8rem", color: "text.secondary", fontWeight: 700 }}
            >
              🔥 שיא נקודות
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800 }}>
              {recordSeason.points} · {recordSeason.name} (
              {formatSeasonYear(recordSeason.year, comp.key)})
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default CompetitionCard;
