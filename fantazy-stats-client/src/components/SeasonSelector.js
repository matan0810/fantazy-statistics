// src/components/SeasonSelector.js
import React from 'react';
import { Tabs, Tab } from '@mui/material';

function SeasonSelector({ currentSeason, onSeasonChange }) {
  const seasons = ['Season 1', 'Season 2', 'Season 3']; // Replace with your actual seasons

  const handleChange = (event, newSeason) => {
    onSeasonChange(newSeason);
  };

  return (
    <Tabs value={currentSeason} onChange={handleChange}>
      {seasons.map((season, index) => (
        <Tab key={index} label={season} value={season} />
      ))}
    </Tabs>
  );
}

export default SeasonSelector;
