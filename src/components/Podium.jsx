import { Box, Typography, Avatar } from "@mui/material";
import { isLostName } from "../utils/format";

const MEDALS = {
  1: { emoji: "🥇", grad: ["#fde68a", "#f59e0b"], ring: "#f59e0b", h: 112, champ: true },
  2: { emoji: "🥈", grad: ["#eef0f2", "#9ca3af"], ring: "#9ca3af", h: 90 },
  3: { emoji: "🥉", grad: ["#e7b98f", "#b9722f"], ring: "#b9722f", h: 72 },
};

// Classic podium order: 2nd on the right, 1st in the middle, 3rd on the left.
const ORDER = [2, 1, 3];

function Step({ team, players, accent, hidePoints }) {
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
      {/* reserved crown slot keeps medal/avatar/name aligned across columns */}
      <Box sx={{ height: 22, display: "flex", alignItems: "center" }}>
        {m.champ && (
          <Typography sx={{ fontSize: { xs: 18, sm: 22 }, lineHeight: 1 }}>👑</Typography>
        )}
      </Box>

      <Typography sx={{ fontSize: { xs: 26, sm: 32 }, lineHeight: 1 }}>{m.emoji}</Typography>

      <Avatar
        sx={{
          mt: 0.5,
          width: { xs: 46, sm: 54 },
          height: { xs: 46, sm: 54 },
          bgcolor: accent,
          fontWeight: 800,
          fontSize: { xs: "1.1rem", sm: "1.35rem" },
          border: "3px solid #fff",
          boxShadow: `0 4px 12px rgba(0,0,0,0.18), 0 0 0 3px ${m.ring}`,
        }}
      >
        {name.charAt(0)}
      </Avatar>

      <Typography
        noWrap
        sx={{
          mt: 0.75,
          fontWeight: 800,
          fontSize: { xs: "0.9rem", sm: "1.02rem" },
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
            color: "text.secondary",
            fontSize: { xs: "0.68rem", sm: "0.76rem" },
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          {team.team_name}
        </Typography>
      )}
      {lostName && (
        <Typography
          sx={{ color: "text.disabled", fontStyle: "italic", fontSize: "0.68rem" }}
        >
          שם הקבוצה אבד
        </Typography>
      )}

      {/* pedestal */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          height: { xs: m.h * 0.72, sm: m.h },
          borderRadius: "12px 12px 0 0",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(180deg, ${m.grad[0]} 0%, ${m.grad[1]} 100%)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 22px -12px ${m.ring}`,
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
            height: "45%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0))",
          }}
        />
        {hidePoints ? (
          <Typography
            sx={{
              position: "relative",
              fontWeight: 900,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.28)",
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
              textShadow: "0 1px 4px rgba(0,0,0,0.28)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.3rem", sm: m.champ ? "1.7rem" : "1.5rem" },
                lineHeight: 1,
              }}
            >
              {team.points}
            </Typography>
            <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" }, opacity: 0.95 }}>
              נקודות
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Podium({ teams, players, accent, hidePoints }) {
  const byLocation = (loc) => teams.find((t) => t.location === loc);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: { xs: 1, sm: 2 },
        px: { xs: 0.5, sm: 4 },
        pt: 1,
      }}
    >
      {ORDER.map((loc) => (
        <Step
          key={loc}
          team={byLocation(loc)}
          players={players}
          accent={accent}
          hidePoints={hidePoints}
        />
      ))}
    </Box>
  );
}

export default Podium;
