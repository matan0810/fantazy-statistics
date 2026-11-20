import { Box, Typography } from "@mui/material";
import { CARD_SX, EYEBROW_SX, NUM_SX, T, GOLD, alpha } from "../../constants";
import { formatSeasonYear, isLostName } from "../../utils";

// One tournament: title counts, the all-time points record and the full
// season-by-season champions roll (each row links to that season).
function CompetitionCard({ comp, seasons, ranked, recordSeason, champions, onSeason }) {
  return (
    <Box sx={{ ...CARD_SX, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", px: 2, py: 1.75, color: "#fff", background: `linear-gradient(135deg, ${comp.gradient[1]}, ${comp.gradient[0]})` }}>
        <Box aria-hidden sx={{ position: "absolute", left: 12, top: -6, fontSize: 64, opacity: 0.15 }}>{comp.emoji}</Box>
        <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", position: "relative" }}>
          {comp.emoji} {comp.label}
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", opacity: 0.8, position: "relative" }}>{seasons} עונות</Typography>
      </Box>

      <Box sx={{ p: 2, pb: 1.5 }}>
        {/* title counts */}
        <Typography sx={{ ...EYEBROW_SX, mb: 1 }}>תארים</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {ranked.length ? (
            ranked.map((r, i) => (
              <Box
                key={r.name}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  pl: 0.75,
                  pr: 1.1,
                  py: 0.4,
                  borderRadius: 999,
                  border: `1px solid ${i === 0 ? alpha(GOLD, 0.45) : T.border}`,
                  backgroundColor: i === 0 ? alpha(GOLD, 0.1) : "rgba(255,255,255,0.03)",
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: "0.85rem" }}>{r.name}</Typography>
                <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1rem", color: i === 0 ? GOLD : comp.color }}>×{r.count}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>אין נתונים</Typography>
          )}
        </Box>

        {recordSeason && (
          <Box sx={{ mt: 1.75, p: 1.25, borderRadius: "12px", backgroundColor: alpha(comp.color, 0.08), border: `1px solid ${alpha(comp.color, 0.25)}`, display: "flex", alignItems: "center", gap: 1 }}>
            <span>🔥</span>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ ...EYEBROW_SX, fontSize: "0.64rem" }}>שיא נקודות בעונה</Typography>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                {recordSeason.name} · {formatSeasonYear(recordSeason.year, comp.key)}
              </Typography>
            </Box>
            <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.7rem", color: comp.color }}>{recordSeason.points}</Typography>
          </Box>
        )}
      </Box>

      {/* champions roll */}
      <Box sx={{ borderTop: `1px solid ${T.border}` }}>
        <Typography sx={{ ...EYEBROW_SX, px: 2, pt: 1.25, pb: 0.5 }}>כל האלופים</Typography>
        <Box sx={{ maxHeight: 236, overflowY: "auto", pb: 0.75 }}>
          {champions.map((c) => (
            <Box
              key={c.seasonId}
              component="button"
              onClick={() => onSeason?.(c.seasonId)}
              sx={{
                all: "unset",
                boxSizing: "border-box",
                width: "100%",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "54px minmax(0,1fr) auto",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.7,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
              }}
            >
              <Typography sx={{ ...NUM_SX, fontWeight: 700, fontSize: "1rem", color: "text.secondary" }}>
                {formatSeasonYear(c.year, comp.key)}
              </Typography>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                👑 {c.name}
                {!isLostName(c.teamName) && (
                  <Box component="span" sx={{ color: "text.disabled", fontWeight: 500, fontSize: "0.78rem" }}> · {c.teamName}</Box>
                )}
              </Typography>
              <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.05rem", color: c.points == null ? "text.disabled" : comp.color }}>
                {c.points ?? "—"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default CompetitionCard;
