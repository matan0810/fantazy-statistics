import { Box, Typography, Avatar } from "@mui/material";
import { isLostName } from "../../utils";
import { NUM_SX } from "../../constants";

// Per-rank pedestal styling. Anything outside 1–3 falls back to bronze.
const STEPS = {
  1: { grad: ["#fde68a", "#d97706"], ring: "#fbbf24", glow: "rgba(251,191,36,0.55)", h: 132, ink: "#3b2401", champ: true },
  2: { grad: ["#f1f5f9", "#7c8aa0"], ring: "#cbd5e1", glow: "rgba(203,213,225,0.4)", h: 100, ink: "#1e293b" },
  3: { grad: ["#fdba74", "#9a3412"], ring: "#f59e5b", glow: "rgba(251,146,60,0.4)", h: 78, ink: "#3b1405" },
};

function PodiumStep({ team, players, hidePoints }) {
  if (!team) return <Box sx={{ flex: 1 }} />;

  const m = STEPS[team.location] ?? STEPS[3];
  const name = players[team.player]?.label ?? "—";
  const hasName = team.team_name && !isLostName(team.team_name);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
      <Box sx={{ height: 28, display: "flex", alignItems: "flex-end" }}>
        {m.champ && (
          <Typography sx={{ fontSize: { xs: 22, sm: 26 }, filter: "drop-shadow(0 2px 6px rgba(251,191,36,0.6))" }}>
            👑
          </Typography>
        )}
      </Box>

      <Avatar
        sx={{
          mt: 0.5,
          width: { xs: m.champ ? 58 : 50, sm: m.champ ? 72 : 60 },
          height: { xs: m.champ ? 58 : 50, sm: m.champ ? 72 : 60 },
          background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
          color: m.ink,
          fontWeight: 900,
          fontSize: { xs: "1.3rem", sm: m.champ ? "1.8rem" : "1.5rem" },
          border: "3px solid #0c1322",
          boxShadow: `0 0 0 2px ${m.ring}, 0 0 28px ${m.glow}`,
        }}
      >
        {name.charAt(0)}
      </Avatar>

      <Typography noWrap sx={{ mt: 1, fontWeight: 900, fontSize: { xs: "0.95rem", sm: "1.1rem" }, maxWidth: "100%", textAlign: "center" }}>
        {name}
      </Typography>
      <Typography
        noWrap
        sx={{
          fontSize: { xs: "0.68rem", sm: "0.78rem" },
          color: "text.secondary",
          maxWidth: "100%",
          textAlign: "center",
          fontStyle: hasName ? "normal" : "italic",
          minHeight: "1.2em",
        }}
      >
        {hasName ? team.team_name : team.team_name ? "שם הקבוצה אבד" : ""}
      </Typography>

      {/* pedestal */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          height: { xs: m.h * 0.8, sm: m.h },
          borderRadius: "14px 14px 0 0",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(180deg, ${m.grad[0]} 0%, ${m.grad[1]} 100%)`,
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.65), 0 -10px 40px -14px ${m.glow}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pt: { xs: 1, sm: 1.5 },
          transformOrigin: "bottom",
          animation: "rise .6s cubic-bezier(.2,.8,.2,1) both",
          animationDelay: `${(3 - (team.location ?? 3)) * 90 + 120}ms`,
        }}
      >
        <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 45%, transparent 60%)" }} />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: -6,
            ...NUM_SX,
            fontWeight: 800,
            fontSize: { xs: 52, sm: 70 },
            lineHeight: 1,
            color: "rgba(0,0,0,0.13)",
          }}
        >
          {team.location}
        </Box>
        <Typography sx={{ ...NUM_SX, position: "relative", fontWeight: 800, color: m.ink, fontSize: { xs: "1.5rem", sm: m.champ ? "2.1rem" : "1.8rem" }, lineHeight: 1 }}>
          {hidePoints ? `#${team.location}` : team.points}
        </Typography>
        {!hidePoints && (
          <Typography sx={{ position: "relative", fontSize: { xs: "0.6rem", sm: "0.7rem" }, fontWeight: 800, color: m.ink, opacity: 0.7 }}>
            נקודות
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default PodiumStep;
