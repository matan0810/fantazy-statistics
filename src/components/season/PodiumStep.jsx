import { Box, Typography, Avatar } from "@mui/material";
import { isLostName } from "../../utils";

// Per-rank pedestal styling: gradient, ring glow and height. 1st place also
// gets a crown. Anything outside 1–3 falls back to the bronze look.
const MEDALS = {
  1: {
    emoji: "🥇",
    grad: ["#fde047", "#f59e0b"],
    ring: "#fbbf24",
    glow: "rgba(251,191,36,0.6)",
    h: 120,
    champ: true,
  },
  2: {
    emoji: "🥈",
    grad: ["#f1f5f9", "#94a3b8"],
    ring: "#b6c0cc",
    glow: "rgba(203,213,225,0.5)",
    h: 92,
  },
  3: {
    emoji: "🥉",
    grad: ["#f0a868", "#b45309"],
    ring: "#fb923c",
    glow: "rgba(251,146,60,0.4)",
    h: 72,
  },
};

// A single podium column. Renders an empty spacer when the slot has no team so
// the three columns stay aligned.
function PodiumStep({ team, players, accent, hidePoints }) {
  if (!team) return <Box sx={{ flex: 1 }} />;

  const m = MEDALS[team.location] ?? MEDALS[3];
  const name = players[team.player]?.label ?? "—";
  const hasName = team.team_name && !isLostName(team.team_name);
  const lostName = team.team_name && isLostName(team.team_name);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      {/* reserved crown slot keeps all columns aligned */}
      <Box sx={{ height: 26, display: "flex", alignItems: "center" }}>
        {m.champ && (
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 28 },
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            }}
          >
            👑
          </Typography>
        )}
      </Box>

      <Typography sx={{ fontSize: { xs: 22, sm: 28 }, lineHeight: 1 }}>
        {m.emoji}
      </Typography>

      <Avatar
        sx={{
          mt: 0.5,
          width: { xs: 48, sm: 58 },
          height: { xs: 48, sm: 58 },
          bgcolor: accent,
          fontWeight: 800,
          fontSize: { xs: "1.2rem", sm: "1.45rem" },
          border: "3px solid rgba(255,255,255,0.92)",
          boxShadow: `0 0 0 4px ${m.ring}, 0 0 22px ${m.glow}`,
        }}
      >
        {name.charAt(0)}
      </Avatar>

      <Typography
        noWrap
        sx={{
          mt: 0.75,
          fontWeight: 800,
          fontSize: { xs: "0.92rem", sm: "1.05rem" },
          color: "#fff",
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        {name}
      </Typography>
      {hasName && (
        <Typography
          noWrap
          sx={{
            fontSize: { xs: "0.66rem", sm: "0.74rem" },
            color: "rgba(255,255,255,0.6)",
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          {team.team_name}
        </Typography>
      )}
      {lostName && (
        <Typography
          sx={{
            fontSize: "0.66rem",
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
          }}
        >
          שם הקבוצה אבד
        </Typography>
      )}

      {/* pedestal */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          height: { xs: m.h * 0.78, sm: m.h },
          borderRadius: "10px 10px 0 0",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(180deg, ${m.grad[0]} 0%, ${m.grad[1]} 100%)`,
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.6), 0 0 26px -6px ${m.glow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* top gloss */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "42%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45), transparent)",
          }}
        />
        {/* big watermark rank number */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: { xs: 46, sm: 60 },
            lineHeight: 1.15,
            color: "rgba(255,255,255,0.22)",
            pointerEvents: "none",
          }}
        >
          {team.location}
        </Box>

        {hidePoints ? (
          <Typography
            sx={{
              position: "relative",
              fontWeight: 900,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.35)",
            }}
          >
            #{team.location}
          </Typography>
        ) : (
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              color: "#fff",
              textShadow: "0 1px 5px rgba(0,0,0,0.4)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.35rem", sm: m.champ ? "1.8rem" : "1.55rem" },
                lineHeight: 1,
              }}
            >
              {team.points}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "0.58rem", sm: "0.68rem" }, opacity: 0.9 }}
            >
              נקודות
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PodiumStep;
