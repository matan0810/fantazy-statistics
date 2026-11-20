import { useMemo } from "react";
import _ from "lodash";
import { Box, Typography } from "@mui/material";
import { CARD_SX, NUM_SX, T } from "../../constants";
import SectionTitle from "../common/SectionTitle";

// Ranked bars of average points per season, scaled to the leader.
function AverageLeaders({ playerStats, onSelect }) {
  const leaders = useMemo(
    () => _.orderBy(playerStats.filter((p) => p.avgPoints > 0), ["avgPoints"], ["desc"]),
    [playerStats],
  );
  const max = leaders[0]?.avgPoints || 1;

  return (
    <>
      <SectionTitle emoji="📈" sub="ממוצע נקודות לעונה (עונות עם נתונים בלבד)">
        מובילי הממוצע
      </SectionTitle>
      <Box sx={{ ...CARD_SX, p: { xs: 1.75, sm: 2.5 }, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {leaders.length === 0 ? (
          <Typography sx={{ color: "text.secondary", py: 2, textAlign: "center" }}>אין נתונים בתחרות זו</Typography>
        ) : (
          leaders.map((p, i) => (
            <Box
              key={p.id}
              component="button"
              onClick={() => onSelect(p)}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: { xs: "64px 1fr 48px", sm: "92px 1fr 64px" },
                alignItems: "center",
                gap: 1.5,
                py: 0.9,
                px: 1,
                mx: -1,
                borderRadius: "10px",
                transition: "background-color .15s",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
                "&:hover .bar": { filter: "brightness(1.2)" },
              }}
            >
              <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.name}</Typography>
              <Box sx={{ height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <Box
                  className="bar"
                  sx={{
                    height: "100%",
                    width: `${(p.avgPoints / max) * 100}%`,
                    borderRadius: 999,
                    background: i === 0 ? "linear-gradient(270deg, #fde68a, #f59e0b)" : "linear-gradient(270deg, #c4b5fd, #7c3aed)",
                    transition: "width .5s cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.25rem", lineHeight: 1, color: i === 0 ? "#fbbf24" : T.text }}>{p.avgPoints}</Typography>
                <Typography sx={{ fontSize: "0.62rem", color: "text.disabled", fontWeight: 600 }}>{p.appearances} עונות</Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </>
  );
}

export default AverageLeaders;
