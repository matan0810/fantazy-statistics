import { Box, Typography } from "@mui/material";
import PodiumStep from "./PodiumStep";

// Classic podium order: 2nd on the right, 1st in the middle, 3rd on the left.
const ORDER = [2, 1, 3];

function Podium({ teams, players, accent, hidePoints }) {
  const byLocation = (loc) => teams.find((t) => t.location === loc);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        px: { xs: 1.5, sm: 3 },
        pt: 2,
        boxShadow: "0 16px 40px -20px rgba(15,23,42,0.7)",
        background: "radial-gradient(130% 90% at 50% 0%, #334155 0%, #111827 72%)",
      }}
    >
      {/* spotlight glow behind the champion */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -50,
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 220,
          background:
            "radial-gradient(closest-side, rgba(251,191,36,0.28), transparent)",
          pointerEvents: "none",
        }}
      />
      <Typography
        sx={{
          position: "relative",
          textAlign: "center",
          color: "rgba(255,255,255,0.9)",
          fontWeight: 800,
          fontSize: "1rem",
          mb: 2,
          letterSpacing: 0.5,
        }}
      >
        🏆 פודיום
      </Typography>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          gap: { xs: 1, sm: 2 },
        }}
      >
        {ORDER.map((loc) => (
          <PodiumStep
            key={loc}
            team={byLocation(loc)}
            players={players}
            accent={accent}
            hidePoints={hidePoints}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Podium;
