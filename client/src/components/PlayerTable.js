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

const styles = {
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
};

function PlayerTable({ season, players }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/teams?season=${season}`)
      .then(({ data }) => setTeams(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, [season]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={styles}>{TEAM_PROPERTIES.location.label}</TableCell>
            <TableCell sx={styles}>{TEAM_PROPERTIES.player.label}</TableCell>
            <TableCell sx={styles}>{TEAM_PROPERTIES.points.label}</TableCell>
            <TableCell sx={styles}>{TEAM_PROPERTIES.teamName.label}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.player}>
              <TableCell>{team.location}</TableCell>
              <TableCell>{players[team.player]?.label}</TableCell>
              <TableCell>{team.points}</TableCell>
              <TableCell>{team.teamName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerTable;
