import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import { AddTeamsForm, PlayerTable, SeasonSelector } from "./components";
import { SERVER_URL } from "./constants/constants";

function App() {
  const [seasons, setSeasons] = useState([]);
  // const [seasonTypes, setSeasonTypes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1); // todo: better way to choose, maybe localStorage

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/seasons`)
      .then(({ data }) => setSeasons(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, [setSeasons]);

  // useEffect(() => {
  //   axios
  //     .get(`${SERVER_URL}/seasonTypes`)
  //     .then(({ data }) => setSeasonTypes(data))
  //     .catch((error) => console.error("Error fetching player data:", error));
  // }, []);

  return (
    <Container>
      <h1>Fantasy League Player Stats</h1>
      <SeasonSelector
        currentSeason={currentSeason}
        setCurrentSeason={setCurrentSeason}
        seasons={seasons}
        setSeasons={setSeasons}
      />
      <PlayerTable season={currentSeason} />
      <AddTeamsForm currentSeason={currentSeason} />
    </Container>
  );
}

export default App;

// todo: form - table live updates
// todo: form fails alerts
