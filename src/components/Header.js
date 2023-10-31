import { Typography, Select, MenuItem } from "@mui/material";
import { seasonTypes } from "../constants/options";

function Header({ seasonType, onSeasonTypeChange }) {
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
