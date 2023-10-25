import React, { useEffect, useState } from "react";
import StatsList from "./StatsList";
import AddStatsForm from "./AddStatsForm";
import axios from "axios";

const SERVER_URL = "http://localhost:3001/api/stats";

const FantasyLeagueApp = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Fetch statistics data from the server when the component mounts
    axios
      .get(SERVER_URL)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addStats = (newStats) => {
    // Send a POST request to add new statistics to the server
    axios
      .post(SERVER_URL, newStats)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error adding stats:", error);
      });
  };

  return (
    <div>
      <h1>Fantasy League Statistics</h1>
      <StatsList stats={stats} />
      <AddStatsForm addStats={addStats} />
    </div>
  );
};

export default FantasyLeagueApp;
