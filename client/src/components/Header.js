import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Select, MenuItem } from "@mui/material";
import { SERVER_URL } from "../constants/constants";

function Header({ seasonType, onSeasonTypeChange }) {
  const [seasonTypes, setSeasonTypes] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/seasonTypes`)
      .then(({ data }) => setSeasonTypes(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "10px",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h3" component="div">
        סטטיסטיקות - פנטזי ליג
      </Typography>
      <Select
        label="Season"
        value={seasonType}
        defaultValue=""
        onChange={(e) => onSeasonTypeChange(e.target.value)}
        variant="outlined"
      >
        {Object.keys(seasonTypes).map((key) => (
          <MenuItem key={key} value={key}>
            {seasonTypes[key].label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default Header;
