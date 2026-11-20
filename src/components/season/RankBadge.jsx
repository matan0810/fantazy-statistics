import { Box } from "@mui/material";
import { NUM_SX, RANK_COLORS, T } from "../../constants";

// Round rank marker: medal-colored for 1–3, outlined otherwise.
function RankBadge({ rank, size = 30 }) {
  const fill = RANK_COLORS[rank];
  return (
    <Box
      sx={{
        width: size,
        height: size,
        mx: "auto",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        ...NUM_SX,
        fontWeight: 800,
        fontSize: size * 0.55,
        color: fill ? "#111827" : T.textDim,
        background: fill ? `linear-gradient(135deg, #fff8, transparent), ${fill}` : "transparent",
        border: fill ? "none" : `1.5px solid ${T.borderHi}`,
        boxShadow: fill ? `0 4px 14px -4px ${fill}` : "none",
      }}
    >
      {rank ?? "?"}
    </Box>
  );
}

export default RankBadge;
