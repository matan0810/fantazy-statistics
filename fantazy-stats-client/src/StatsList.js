import React from "react";

const StatsList = ({ stats }) => {
  return (
    <div>
      <h2>Statistics</h2>
      {stats?.map((stat, index) => (
        <div key={index}>
          {Object.keys(stat).map((key) => (
            <span key={key}>{` | ${key}: ${stat[key]} | `}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StatsList;
