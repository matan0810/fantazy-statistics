import { useMemo } from "react";
import _ from "lodash";
import { Box, Paper, Typography } from "@mui/material";
import { ACCENT, DARK, CARD_SX } from "../../constants";
import SectionTitle from "../common/SectionTitle";

// Horizontal bar chart of average points per season, ranked. Bars are scaled to
// the current leader. Rows open the player dialog.
function AverageLeaders({ playerStats, onSelect }) {
  const leaders = useMemo(
    () =>
      _.orderBy(
        playerStats.map((p) => ({
          player: p,
          metric: p.avgPoints,
          appearances: p.appearances,
        })),
        ["metric"],
        ["desc"],
      ),
    [playerStats],
  );

  const maxMetric = leaders[0]?.metric || 1;

  return (
    <>
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
              onClick={() => onSelect(player)}
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
                  <span
                    style={{ color: "#999", fontWeight: 500, fontSize: "0.78rem" }}
                  >
                    {" "}
                    · {appearances} עונות
                  </span>
                </Typography>
              </Box>
              <Box
                sx={{ height: 9, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.06)" }}
              >
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
    </>
  );
}

export default AverageLeaders;
