import { Tabs, Tab } from "@mui/material";

function SeasonSelector({ currentSeason, onSeasonChange, seasons }) {
  return (
    <Tabs
      value={currentSeason}
      onChange={(_e, newSeason) => onSeasonChange(newSeason)}
      sx={{
        backgroundColor: "#333",
      }}
    >
      {seasons.map((season) => (
        <Tab
          key={season.id}
          value={season.id}
          label={season.year}
          sx={{
            color: "white",
          }}
        />
      ))}
    </Tabs>
  );
}

export default SeasonSelector;
