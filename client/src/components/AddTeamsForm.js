import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { SERVER_URL, TEAM_PROPERTIES } from "../constants/constants";

const AddTeamsForm = ({ currentSeason }) => {
  const formProps = Object.keys(TEAM_PROPERTIES)
    .filter((key) => TEAM_PROPERTIES[key].form)
    .reduce((obj, val) => {
      obj[val] = "";
      return obj;
    }, {});

  const [formData, setFormData] = useState(formProps);
  const [isFormValid, setIsFormValid] = useState(true);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const sendTeams = async (newStats) => {
    console.log({
      ...newStats,
      seasonId: currentSeason,
    });
    try {
      await axios.post(`${SERVER_URL}/teams`, {
        ...newStats,
        seasonId: currentSeason,
      });

      setFormData(formProps); // Reset the form after successful submission
      setIsFormValid(true); // Reset the validation state
    } catch (error) {
      console.error("Error adding stats:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).every((v) => v)) sendTeams(formData);
    else setIsFormValid(false); // Set the validation state to false if any field is empty
  };

  return (
    <Container maxWidth="sm" sx={{ margin: 10 }}>
      <Typography variant="h4" gutterBottom>
        Add New Stats
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(formData).map((key) => (
            <Grid item xs={12} key={key}>
              <TextField
                fullWidth
                label={key}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                variant="outlined"
                error={!isFormValid && !formData[key]} // Highlight empty fields if the form is invalid
                helperText={!isFormValid && !formData[key] && "Required"}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Add Stats
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddTeamsForm;
