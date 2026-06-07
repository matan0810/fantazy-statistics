import { Box, Chip, Typography } from "@mui/material";
import { seasonTypes } from "../../constants";
import { formatSeasonYear } from "../../utils";

// Horizontal chip row for picking the active season within a competition.
function SeasonSelector({ currentSeason, onSeasonChange, seasons, seasonType }) {
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];

  if (!seasons.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontWeight: 700, mb: 1, px: 0.5 }}
      >
        בחר עונה
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {seasons.map((season) => {
          const selected = season.id === currentSeason;
          return (
            <Chip
              key={season.id}
              label={formatSeasonYear(season.year, season.type)}
              onClick={() => onSeasonChange(season.id)}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                fontSize: "0.95rem",
                px: 1,
                py: 2.4,
                borderRadius: 999,
                cursor: "pointer",
                border: "2px solid",
                borderColor: selected ? comp.color : "rgba(0,0,0,0.1)",
                backgroundColor: selected ? comp.color : "#fff",
                color: selected ? "#fff" : "text.primary",
                boxShadow: selected
                  ? `0 6px 16px -6px ${comp.color}`
                  : "0 1px 3px rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: selected ? comp.color : "#f3f4f6",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SeasonSelector;
