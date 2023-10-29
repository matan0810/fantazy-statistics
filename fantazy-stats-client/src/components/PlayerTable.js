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
import { SERVER_URL } from "../constants/constants";

const styles = {
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
};

function PlayerTable({ season }) {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/teams?season=${season}`)
      .then(({ data }) => setTeams(data))
      .catch((error) => console.error("Error fetching player data:", error));
  }, [season]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/players`)
      .then(({ data }) => setPlayers(data))
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
            <TableCell sx={styles}>Location</TableCell>
            <TableCell sx={styles}>Player Name</TableCell>
            <TableCell sx={styles}>Points</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.player}>
              <TableCell>{team.location}</TableCell>
              <TableCell>{players[team.player]?.name}</TableCell>
              <TableCell>{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerTable;
