import { useState, useEffect } from "react";
import _ from "lodash";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { TEAM_PROPERTIES } from "../constants/constants";
import allTeams from "../data/teams.json";

const bold = { fontWeight: "bold" };

const tableColors = (index, seasonType) => {
  const colors = {
    1: ["#ADD8E6", "#FFE5B4"],
    2: ["#E996A4", "#FFE4B5"],
    3: ["#98FB98", "#B0E0E6"],
    4: ["#D3D3D3", "#87CEEB"],
  };

  return { backgroundColor: colors[seasonType][index % 2] };
};

function PlayerTable({ season, players, seasonType }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const newTeams = _.orderBy(
      allTeams.filter((s) => s.season_id === season),
      ["location"],
      ["asc"]
    );

    setTeams(newTeams);
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
            <TableRow key={team.player} sx={tableColors(index, seasonType)}>
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
