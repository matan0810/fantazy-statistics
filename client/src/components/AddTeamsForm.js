import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { SERVER_URL, TEAM_PROPERTIES } from "../constants/constants";

const formProps = {
  [TEAM_PROPERTIES.location.key]: "",
  [TEAM_PROPERTIES.player.key]: "",
  [TEAM_PROPERTIES.points.key]: "",
  [TEAM_PROPERTIES.team_name.key]: "",
};

const AddTeamsForm = ({ currentSeason, players }) => {
  const [formData, setFormData] = useState(formProps);
  const [isFormValid, setIsFormValid] = useState(true);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const sendTeams = async (newStats) => {
    try {
      await axios.post(`${SERVER_URL}/teams`, {
        ...newStats,
        seasonId: currentSeason,
      });

      setFormData(formProps); // Reset the form after successful submission
      setIsFormValid(true); // Reset the validation state
    } catch (error) {
      console.error("Error adding stats:", error);
      alert("תקלה בשליחת המידע")
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      Object.keys(formData).every(
        (key) => !TEAM_PROPERTIES[key].required || formData[key]
      )
    )
      sendTeams(formData);
    else setIsFormValid(false);
  };

  return (
    <Container maxWidth="sm" sx={{ margin: 10 }}>
      <Typography variant="h4" gutterBottom>
        הוספת קבוצה חדשה
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="number"
              InputProps={{
                inputProps: { min: 1, max: Object.keys(players).length },
              }}
              fullWidth
              label={TEAM_PROPERTIES.location.label}
              name={TEAM_PROPERTIES.location.key}
              value={formData[TEAM_PROPERTIES.location.key]}
              onChange={handleInputChange}
              variant="outlined"
              error={!isFormValid && !formData[TEAM_PROPERTIES.location.key]} // Highlight empty fields if the form is invalid
              helperText={
                !isFormValid &&
                !formData[TEAM_PROPERTIES.location.key] &&
                "חובה"
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              fullWidth
              label={TEAM_PROPERTIES.player.label}
              name={TEAM_PROPERTIES.player.key}
              value={formData[TEAM_PROPERTIES.player.key]}
              onChange={handleInputChange}
              variant="outlined"
              error={!isFormValid && !formData[TEAM_PROPERTIES.player.key]}
            >
              <MenuItem value="">בחר שחקן</MenuItem>
              {Object.keys(players).map((key) => (
                <MenuItem key={key} value={key}>
                  {players[key].label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              label={TEAM_PROPERTIES.points.label}
              name={TEAM_PROPERTIES.points.key}
              value={formData[TEAM_PROPERTIES.points.key]}
              onChange={handleInputChange}
              variant="outlined"
              error={!isFormValid && !formData[TEAM_PROPERTIES.points.key]} // Highlight empty fields if the form is invalid
              helperText={
                !isFormValid && !formData[TEAM_PROPERTIES.points.key] && "חובה"
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={TEAM_PROPERTIES.team_name.label}
              name={TEAM_PROPERTIES.team_name.key}
              value={formData[TEAM_PROPERTIES.team_name.key]}
              placeholder=""
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                שלח
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddTeamsForm;
