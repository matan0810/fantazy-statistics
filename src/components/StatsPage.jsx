import { useMemo, useState } from "react";
import _ from "lodash";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { seasonTypes } from "../constants/options";
import { formatSeasonYear } from "../utils/format";
import { computeStats } from "../utils/stats";
import PlayerDetailDialog from "./PlayerDetailDialog";

const ACCENT = "#7c3aed";
const DARK = "#5b21b6";
const MEDAL_COLORS = { gold: "#f5b301", silver: "#9aa3ad", bronze: "#c47b3f" };

// Shared soft-card look used across the page for a calmer, premium feel.
const CARD_SX = {
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 10px 30px -18px rgba(17,24,39,0.35)",
  backgroundColor: "#fff",
};

function MedalPills({ golds, silvers, bronzes }) {
  const pills = [
    { emoji: "🥇", count: golds, color: MEDAL_COLORS.gold },
    { emoji: "🥈", count: silvers, color: MEDAL_COLORS.silver },
    { emoji: "🥉", count: bronzes, color: MEDAL_COLORS.bronze },
  ].filter((p) => p.count > 0);

  if (!pills.length)
    return <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>—</Typography>;

  return (
    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
      {pills.map((p) => (
        <Box
          key={p.emoji}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.3,
            px: 0.9,
            py: 0.2,
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "0.82rem",
            backgroundColor: `${p.color}22`,
            color: "#444",
          }}
        >
          <span>{p.emoji}</span>
          {p.count}
        </Box>
      ))}
    </Box>
  );
}

function SectionTitle({ emoji, children, sub }) {
  return (
    <Box sx={{ mt: 2, mb: 1.5 }}>
      <Typography sx={{ fontWeight: 900, fontSize: "1.3rem" }}>
        <span style={{ marginInlineEnd: 8 }}>{emoji}</span>
        {children}
      </Typography>
      {sub && (
        <Typography sx={{ color: "text.secondary", fontSize: "0.82rem", mt: 0.25 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

function RecordCard({ emoji, label, name, highlight, sub }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...CARD_SX,
        flex: "1 1 200px",
        minWidth: 0,
        p: 2.25,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(155deg, ${ACCENT}1a 0%, #fff 60%)`,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px -16px rgba(17,24,39,0.4)",
        },
      }}
    >
      <Box
        aria-hidden
        sx={{ position: "absolute", left: 12, top: 8, fontSize: 46, opacity: 0.16 }}
      >
        {emoji}
      </Box>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          mb: 0.75,
          backgroundColor: `${ACCENT}1f`,
        }}
      >
        {emoji}
      </Box>
      <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", lineHeight: 1.2 }}>{name}</Typography>
      {highlight != null && (
        <Typography sx={{ fontWeight: 900, color: DARK, fontSize: "1rem" }}>{highlight}</Typography>
      )}
      {sub && <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>{sub}</Typography>}
    </Paper>
  );
}

function CompetitionFilter({ selected, onToggle }) {
  const options = Object.values(seasonTypes);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        mb: 1.5,
        p: 1.25,
        borderRadius: 3,
        backgroundColor: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <Typography
        sx={{ fontSize: "0.78rem", fontWeight: 700, color: "text.secondary", flexShrink: 0 }}
      >
        סנן:
      </Typography>
      {options.map((o) => {
        const active = selected.has(o.key);
        return (
          <Box
            key={o.key}
            onClick={() => onToggle(o.key)}
            sx={{
              cursor: "pointer",
              userSelect: "none",
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "1.5px solid",
              borderColor: active ? o.color : "rgba(0,0,0,0.15)",
              backgroundColor: active ? o.color : "rgba(0,0,0,0.04)",
              color: active ? "#fff" : "#777",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": {
                borderColor: o.color,
                backgroundColor: active ? o.color : `${o.color}22`,
                color: active ? "#fff" : o.color,
              },
            }}
          >
            <span>{o.emoji}</span>
            {o.label}
            {active && (
              <span style={{ fontSize: "0.7rem", opacity: 0.85, marginInlineStart: 2 }}>✓</span>
            )}
          </Box>
        );
      })}
      <Typography sx={{ fontSize: "0.72rem", color: "text.disabled", mr: "auto" }}>
        לחצו לבחירה מרובה
      </Typography>
    </Box>
  );
}

// Default: all competitions except Ligat HaAl (type 4)
const DEFAULT_COMPS = new Set([1, 2, 3]);

function StatsPage() {
  const [selectedComps, setSelectedComps] = useState(DEFAULT_COMPS);
  const [selected, setSelected] = useState(null);

  const toggleComp = (key) => {
    setSelectedComps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const stats = useMemo(() => computeStats(selectedComps), [selectedComps]);
  const { hallOfFame, playerStats, records, titlesByCompetition, totals } = stats;

  const leaders = useMemo(() => {
    return _.orderBy(
      playerStats.map((p) => ({
        player: p,
        metric: p.avgPoints,
        appearances: p.appearances,
      })),
      ["metric"],
      ["desc"]
    );
  }, [playerStats]);

  const maxMetric = leaders[0]?.metric || 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pb: 6 }}>
      {/* competition filter */}
      <CompetitionFilter selected={selectedComps} onToggle={toggleComp} />

      {/* totals strip */}
      <Typography sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5 }}>
        {totals.seasons} עונות · {totals.players} שחקנים · {totals.records} רישומים
      </Typography>

      {/* all-time records */}
      <SectionTitle emoji="🏅">שיאי כל הזמנים</SectionTitle>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.25, sm: 2 } }}>
        <RecordCard
          emoji="👑"
          label="הכי הרבה אליפויות"
          name={records.mostTitles?.name}
          highlight={`${records.mostTitles?.golds} אליפויות`}
        />
        <RecordCard
          emoji="🎖️"
          label="הכי הרבה פודיומים"
          name={records.mostPodiums?.name}
          highlight={`${records.mostPodiums?.podiums} פודיומים`}
        />
        <RecordCard
          emoji="📊"
          label="שיא ממוצע עונתי"
          name={records.bestCompAverage?.name ?? "—"}
          highlight={
            records.bestCompAverage ? `${records.bestCompAverage.avgPoints} בממוצע` : null
          }
          sub={
            records.bestCompAverage
              ? `${records.bestCompAverage.comp.emoji} ${records.bestCompAverage.comp.label}`
              : "אין מספיק נתונים"
          }
        />
      </Box>

      {/* hall of fame */}
      <SectionTitle emoji="🏆" sub="לחצו על שחקן לפירוט מלא">
        היכל התהילה
      </SectionTitle>
      <Paper elevation={0} sx={{ ...CARD_SX, overflow: "hidden" }}>
        {hallOfFame.map((p, i) => (
          <Box
            key={p.id}
            onClick={() => setSelected(p)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2.5 },
              py: 1.5,
              cursor: "pointer",
              borderBottom: i === hallOfFame.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
              backgroundColor: i === 0 ? `${ACCENT}10` : "transparent",
              transition: "background-color 0.15s",
              "&:hover": { backgroundColor: `${ACCENT}1c` },
              "&:hover .row-chevron": { opacity: 1, transform: "translateX(-2px)" },
            }}
          >
            <Box sx={{ width: 28, textAlign: "center", fontWeight: 900, color: "text.secondary" }}>
              {i + 1}
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: i === 0 ? ACCENT : "rgba(0,0,0,0.12)",
                color: i === 0 ? "#fff" : "text.secondary",
                fontWeight: 800,
              }}
            >
              {p.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {i === 0 && "👑 "}
                {p.name}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
                {p.appearances} עונות · {p.podiums} פודיומים
              </Typography>
            </Box>
            <MedalPills golds={p.golds} silvers={p.silvers} bronzes={p.bronzes} />
            <ChevronLeftIcon
              className="row-chevron"
              sx={{ color: ACCENT, opacity: 0.35, transition: "all 0.15s", flexShrink: 0 }}
            />
          </Box>
        ))}
      </Paper>

      {/* average leaders */}
      <SectionTitle emoji="📈" sub="ממוצע נקודות לעונה — לפי התחרויות הנבחרות">
        מובילי הממוצע
      </SectionTitle>
      <Paper elevation={0} sx={{ ...CARD_SX, p: { xs: 1.5, sm: 2.5 } }}>
        {leaders.length === 0 ? (
          <Typography sx={{ color: "text.secondary", py: 2, textAlign: "center" }}>
            אין נתונים בתחרות זו
          </Typography>
        ) : (
          leaders.map(({ player, metric, appearances }) => (
            <Box
              key={player.id}
              onClick={() => setSelected(player)}
              sx={{
                py: 1,
                px: 1,
                mx: -1,
                borderRadius: 2,
                cursor: "pointer",
                transition: "background-color 0.15s",
                "&:hover": { backgroundColor: `${ACCENT}0f` },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700 }}>{player.name}</Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {metric}
                  <span style={{ color: "#999", fontWeight: 500, fontSize: "0.78rem" }}>
                    {" "}
                    · {appearances} עונות
                  </span>
                </Typography>
              </Box>
              <Box sx={{ height: 9, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.06)" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${(metric / maxMetric) * 100}%`,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${DARK}, ${ACCENT})`,
                    transition: "width 0.35s ease",
                  }}
                />
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* per-competition: champions + season points record */}
      <SectionTitle emoji="🗂️" sub="אלופים ושיא נקודות בעונה — לכל תחרות בנפרד">
        לפי טורניר
      </SectionTitle>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.25, sm: 2 } }}>
        {titlesByCompetition.map(({ comp, seasons, ranked, recordSeason }) => (
          <Paper
            key={comp.key}
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
              <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>{seasons} עונות</Typography>
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
                    <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: comp.color }}>
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
                  <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", fontWeight: 700 }}>
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
        ))}
      </Box>

      <PlayerDetailDialog player={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}

export default StatsPage;
