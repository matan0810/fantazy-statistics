import React, { useEffect, useState } from "react";
import axios from "axios";
import StatsList from "./StatsList";
import AddStatsForm from "./AddStatsForm";

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

  const addStats = async (newStats) => {
    // Send a POST request to add new statistics to the server
    try {
      await axios.post(SERVER_URL, newStats);
    } catch (error) {
      console.error("Error adding stats:", error);
    }
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
