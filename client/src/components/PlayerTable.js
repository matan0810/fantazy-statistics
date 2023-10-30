import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { SERVER_URL, TEAM_PROPERTIES } from "../constants/constants";

const bold = { fontWeight: "bold" };

function PlayerTable({ season, players, seasonType }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/teams?season=${season}&seasonType=${seasonType}`)
      .then(({ data }) => setTeams(data))
      .catch((error) => console.error("Error fetching team data:", error));
  }, [season, seasonType]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell sx={bold}>{TEAM_PROPERTIES.location.label}</TableCell>
            <TableCell sx={bold}>{TEAM_PROPERTIES.player.label}</TableCell>
            <TableCell sx={bold}>{TEAM_PROPERTIES.points.label}</TableCell>
            <TableCell sx={bold}>{TEAM_PROPERTIES.team_name.label}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {teams?.map((team, index) => (
            <TableRow
              key={team.player}
              sx={{ backgroundColor: index % 2 ? "#ADD8E6" : "#FFE5B4" }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>{team.location}</TableCell>
              <TableCell>{players[team.player]?.label}</TableCell>
              <TableCell>{team.points}</TableCell>
              <TableCell>{team.team_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerTable;
