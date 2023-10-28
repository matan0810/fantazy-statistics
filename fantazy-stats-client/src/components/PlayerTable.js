// src/components/PlayerTable.js
import React, { useState, useEffect } from "react";
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

function PlayerTable({ season }) {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    // Fetch player data based on the selected season
    axios
      .get(`${SERVER_URL}/players?season=${season}`)
      .then((response) => {
        setPlayers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
      });
  }, [season]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(players)?.map((player) => (
            <TableRow key={players[player]}>
              <TableCell>{player}</TableCell>
              <TableCell>{player.location}</TableCell>
              <TableCell>{player.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerTable;
