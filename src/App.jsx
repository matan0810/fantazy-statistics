import { useMemo, useState } from "react";
import { Container, ThemeProvider, CssBaseline, Box } from "@mui/material";
import _ from "lodash";
import { Header, PlayerTable, SeasonSelector, StatsPage } from "./components";
import { players } from "./constants";
import { buildTheme } from "./theme";
import allSeasons from "./data/seasons.json";

function App() {
  const [seasonType, setSeasonType] = useState(
    parseInt(localStorage.getItem("seasonType") ?? "1"),
  );
  const [view, setView] = useState(localStorage.getItem("view") ?? "seasons");

  const theme = useMemo(() => buildTheme(seasonType), [seasonType]);

  const seasons = useMemo(
    () =>
      _.orderBy(
        allSeasons.filter((s) => s.type === seasonType),
        ["year"],
        ["desc"],
      ),
    [seasonType],
  );

  const [currentSeason, setCurrentSeason] = useState(seasons[0]?.id);
  const [prevSeasonType, setPrevSeasonType] = useState(seasonType);
  if (seasonType !== prevSeasonType) {
    setPrevSeasonType(seasonType);
    setCurrentSeason(seasons[0]?.id);
    localStorage.setItem("currentSeason", seasons[0]?.id);
  }

  const onViewChange = (next) => {
    setView(next);
    localStorage.setItem("view", next);
  };

  const onSeasonChange = (season) => {
    setCurrentSeason(parseInt(season));
    localStorage.setItem("currentSeason", season);
  };

  const onSeasonTypeChange = (type) => {
    setSeasonType(parseInt(type));
    localStorage.setItem("seasonType", type);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Container maxWidth="md" disableGutters sx={{ px: { xs: 0, sm: 2 } }}>
          <Header
            seasonType={seasonType}
            onSeasonTypeChange={onSeasonTypeChange}
            view={view}
            onViewChange={onViewChange}
          />
          <Box sx={{ px: { xs: 2, sm: 0 } }}>
            {view === "seasons" ? (
              <>
                <SeasonSelector
                  currentSeason={currentSeason}
                  onSeasonChange={onSeasonChange}
                  seasons={seasons}
                  seasonType={seasonType}
                />
                <PlayerTable
                  seasonType={seasonType}
                  season={currentSeason}
                  seasonInfo={seasons.find((s) => s.id === currentSeason)}
                  players={players}
                />
              </>
            ) : (
              <StatsPage />
            )}
          </Box>
          <Box
            component="footer"
            sx={{
              textAlign: "center",
              py: 3,
              color: "text.disabled",
              fontSize: "0.72rem",
              userSelect: "none",
            }}
          >
            © כל הזכויות שמורות לי
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

// todo: data in airtable
