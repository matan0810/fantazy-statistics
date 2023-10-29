import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import { AddTeamsForm, PlayerTable, SeasonSelector } from "./components";
import { SERVER_URL } from "./constants/constants";

function App() {
  const [seasons, setSeasons] = useState([]);
  // const [seasonTypes, setSeasonTypes] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(
    parseInt(localStorage.getItem("currentSeason") ?? "1")
  );

  const onSeasonChange = (season) => {
    setCurrentSeason(season);
    localStorage.setItem("currentSeason", season);
  };

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

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/players`)
      .then(({ data }) => setPlayers(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, []);

  return (
    <Container>
      <h1>סטטיסטיקות - פנטזי ליג</h1>
      <SeasonSelector
        currentSeason={currentSeason}
        onSeasonChange={onSeasonChange}
        seasons={seasons}
        setSeasons={setSeasons}
      />
      <PlayerTable season={currentSeason} players={players} />
      <AddTeamsForm currentSeason={currentSeason} players={players} />
    </Container>
  );
}

export default App;

// todo: form - table live updates
// todo: form fails alerts
// todo: add team name - in season
// todo: deploy https://www.programonaut.com/7-ways-to-host-your-web-application-for-free/
