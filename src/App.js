import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import _ from "lodash";
import { Header, PlayerTable, SeasonSelector } from "./components";
import { players } from "./constants/options";
import allSeasons from "./data/seasons.json";

function App() {
  const [seasons, setSeasons] = useState([]);
  const [seasonType, setSeasonType] = useState(
    parseInt(localStorage.getItem("seasonType") ?? "1")
  );
  const [currentSeason, setCurrentSeason] = useState(
    parseInt(localStorage.getItem("currentSeason") ?? "1")
  );

  const onSeasonChange = (season) => {
    setCurrentSeason(parseInt(season));
    localStorage.setItem("currentSeason", season);
  };

  const onSeasonTypeChange = (type) => {
    setSeasonType(parseInt(type));
    localStorage.setItem("seasonType", type);
  };

  useEffect(() => {
    const newSeasons = _.orderBy(
      allSeasons.filter((s) => s.type === seasonType),
      ["year"],
      ["asc"]
    );

    setSeasons(newSeasons);
    onSeasonChange(newSeasons[0]?.id);
  }, [setSeasons, seasonType]);

  return (
    <Container>
      <Header seasonType={seasonType} onSeasonTypeChange={onSeasonTypeChange} />
      <SeasonSelector
        currentSeason={currentSeason}
        onSeasonChange={onSeasonChange}
        seasons={seasons}
        setSeasons={setSeasons}
      />
      <PlayerTable
        seasonType={seasonType}
        season={currentSeason}
        players={players}
      />
    </Container>
  );
}

export default App;

// todo: images proof present
