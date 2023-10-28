import { useState } from "react";
import { Container } from "@mui/material";
import PlayerTable from "./components/PlayerTable";
import SeasonSelector from "./components/SeasonSelector";

function App() {
  const [currentSeason, setCurrentSeason] = useState("Season 1"); // Set the default season here

  const handleSeasonChange = (newSeason) => setCurrentSeason(newSeason);

  return (
    <Container>
      <h1>Fantasy League Player Stats</h1>
      <SeasonSelector
        currentSeason={currentSeason}
        onSeasonChange={handleSeasonChange}
      />
      <PlayerTable season={currentSeason} />
    </Container>
  );
}

export default App;


//  <FantasyLeagueApp /> 

