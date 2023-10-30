import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import {
  AddTeamsForm,
  Header,
  PlayerTable,
  SeasonSelector,
} from "./components";
import { SERVER_URL } from "./constants/constants";

function App() {
  const [seasons, setSeasons] = useState([]);
  const [players, setPlayers] = useState([]);
  const [seasonType, setSeasonType] = useState(
    parseInt(localStorage.getItem("seasonType") ?? "1")
  );
  const [currentSeason, setCurrentSeason] = useState(
    parseInt(localStorage.getItem("currentSeason") ?? "1")
  );

  const onSeasonChange = (season) => {
    setCurrentSeason(season);
    localStorage.setItem("currentSeason", season);
  };

  const onSeasonTypeChange = (type) => {
    setSeasonType(type);
    localStorage.setItem("seasonType", type);
  };

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/seasons?seasonType=${seasonType}`)
      .then(({ data }) => {
        setSeasons(data);
        onSeasonChange(data[0].id);
      })
      .catch((error) => console.error("Error fetching player data:", error));
  }, [setSeasons, seasonType]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/players`)
      .then(({ data }) => setPlayers(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, []);

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
      <AddTeamsForm currentSeason={currentSeason} players={players} />
    </Container>
  );
}

export default App;

// todo: form - table live updates

// todo: deploy -
// https://www.programonaut.com/7-ways-to-host-your-web-application-for-free/
// https://github.com/gitname/react-gh-pages#3-install-the-gh-pages-npm-package

// todo: images store
