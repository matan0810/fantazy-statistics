import { Tabs, Tab } from "@mui/material";

function SeasonSelector({
  currentSeason,
  setCurrentSeason,
  seasons,
  // setSeasons,
}) {
  return (
    <Tabs
      value={currentSeason}
      onChange={(_e, newSeason) => setCurrentSeason(newSeason)}
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
