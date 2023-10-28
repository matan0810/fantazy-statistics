// src/components/SeasonSelector.js
import React from "react";
import { Tabs, Tab } from "@mui/material";

function SeasonSelector({ currentSeason, onSeasonChange }) {
  const seasons = ["Season 1", "Season 2", "Season 3"];

  const handleChange = (_event, newSeason) => {
    onSeasonChange(newSeason);
  };

  return (
    <Tabs
      value={currentSeason}
      onChange={handleChange}
      sx={{
        backgroundColor: "#333",
      }}
    >
      {seasons.map((season, index) => (
        <Tab
          key={index}
          label={season}
          value={season}
          sx={{
            color: "white",
          }}
        />
      ))}
    </Tabs>
  );
}

export default SeasonSelector;
