import { Box, Typography } from "@mui/material";
import { CARD_SX, EYEBROW_SX } from "../../constants";
import PodiumStep from "./PodiumStep";

// Classic podium order: 2nd on the right, 1st in the middle, 3rd on the left.
const ORDER = [2, 1, 3];

function Podium({ teams, players, accent, hidePoints }) {
  const byLocation = (loc) => teams.find((t) => t.location === loc);

  return (
    <Box
      className="fade-up"
      sx={{
        ...CARD_SX,
        position: "relative",
        overflow: "hidden",
        px: { xs: 1.5, sm: 4 },
        pt: 2.25,
        background:
          "radial-gradient(120% 90% at 50% 0%, #1b2742 0%, #0c1322 62%, #080d19 100%)",
        animationDelay: "60ms",
      }}
    >
      {/* stadium spotlight on the champion */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 340,
          background: "conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgba(251,191,36,0.16) 20deg, transparent 40deg)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 360,
          height: 220,
          background: "radial-gradient(closest-side, rgba(251,191,36,0.22), transparent)",
          pointerEvents: "none",
        }}
      />
      <Typography sx={{ ...EYEBROW_SX, position: "relative", textAlign: "center", mb: 1 }}>
        פודיום העונה
      </Typography>
      <Box sx={{ position: "relative", display: "flex", alignItems: "flex-end", gap: { xs: 1, sm: 2.5 } }}>
        {ORDER.map((loc) => (
          <PodiumStep key={loc} team={byLocation(loc)} players={players} accent={accent} hidePoints={hidePoints} />
        ))}
      </Box>
      {/* floor line */}
      <Box sx={{ height: 2, mx: { xs: -1.5, sm: -4 }, background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)" }} />
    </Box>
  );
}

export default Podium;
