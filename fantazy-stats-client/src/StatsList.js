import React from "react";

const StatsList = ({ stats }) => {
  return (
    <div>
      <h2>Statistics</h2>
      <ul>
        {stats.map((stat, index) => (
          <li key={index}>
            {stat.playerName}: {stat.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsList;
