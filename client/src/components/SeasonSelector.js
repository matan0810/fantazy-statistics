import { Tabs, Tab } from "@mui/material";

function SeasonSelector({ currentSeason, onSeasonChange, seasons }) {
  return (
    <Tabs
      value={currentSeason}
      onChange={(_e, newSeason) => onSeasonChange(newSeason)}
    >
      {seasons.map((season) => (
        <Tab key={season.id} value={season.year} label={season.year} />
      ))}
    </Tabs>
  );
}

export default SeasonSelector;
