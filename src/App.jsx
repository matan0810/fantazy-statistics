import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import _ from "lodash";
import {
  AppHeader,
  BottomNav,
  CompetitionTabs,
  SeasonRail,
  SeasonView,
} from "./components";
import { players, seasonTypes } from "./constants";
import { buildTheme } from "./theme";
import allSeasons from "./data/seasons.json";

const StatsPage = lazy(() => import("./components/stats/StatsPage"));

const seasonById = _.keyBy(allSeasons, "id");
const latestOfType = (type) => _.maxBy(allSeasons.filter((s) => s.type === type), "year");

// Routes live in the URL hash so every season is a shareable link:
//   #/season/12   → a specific season
//   #/stats       → all-time statistics
function parseHash() {
  const [view, id] = window.location.hash.replace(/^#\/?/, "").split("/");
  if (view === "stats") return { view: "stats" };
  if (view === "season" && seasonById[id]) return { view: "seasons", seasonId: +id };
  return null;
}

function fallbackRoute() {
  const saved = parseInt(localStorage.getItem("currentSeason"));
  if (seasonById[saved]) return { view: "seasons", seasonId: saved };
  return { view: "seasons", seasonId: latestOfType(1)?.id };
}

const toHash = (r) => (r.view === "stats" ? "#/stats" : `#/season/${r.seasonId}`);

function useRoute() {
  const [route, setRoute] = useState(() => parseHash() ?? fallbackRoute());
  // last season viewed, so returning from stats lands on the same season
  const [lastSeason, setLastSeason] = useState(route.seasonId ?? fallbackRoute().seasonId);
  if (route.seasonId && route.seasonId !== lastSeason) setLastSeason(route.seasonId);

  useEffect(() => {
    if (!parseHash()) window.history.replaceState(null, "", toHash(route));
    const onHash = () => {
      const r = parseHash();
      if (!r) return;
      setRoute(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (route.seasonId) localStorage.setItem("currentSeason", route.seasonId);
  }, [route.seasonId]);

  const navigate = useCallback((r) => {
    const next = toHash(r);
    if (window.location.hash !== next) window.location.hash = next; // hashchange → setRoute
    else setRoute(r);
  }, []);

  return { route, lastSeason, navigate };
}

function App() {
  const { route, lastSeason, navigate } = useRoute();
  const activeSeasonId = route.view === "seasons" ? route.seasonId : lastSeason;
  const seasonInfo = seasonById[activeSeasonId];
  const seasonType = seasonInfo?.type ?? 1;
  const comp = seasonTypes[seasonType];

  const theme = useMemo(() => buildTheme(seasonType), [seasonType]);

  // tint the page glow with the competition color
  useEffect(() => {
    const color = route.view === "stats" ? "#a78bfa" : comp.color;
    document.documentElement.style.setProperty("--glow", `${color}2e`);
  }, [comp, route.view]);

  const seasons = useMemo(
    () => _.orderBy(allSeasons.filter((s) => s.type === seasonType), ["year"], ["desc"]),
    [seasonType],
  );

  const goSeason = (id) => navigate({ view: "seasons", seasonId: +id });
  const goType = (type) => goSeason(latestOfType(type).id);
  const goView = (view) =>
    view === "stats" ? navigate({ view: "stats" }) : goSeason(lastSeason);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader view={route.view} onViewChange={goView} />

      <Box
        component="main"
        sx={{
          maxWidth: 1000,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          pb: { xs: "calc(96px + env(safe-area-inset-bottom))", md: 6 },
        }}
      >
        {route.view === "seasons" ? (
          <>
            <CompetitionTabs value={seasonType} onChange={goType} />
            <SeasonRail
              seasons={seasons}
              current={activeSeasonId}
              onChange={goSeason}
              comp={comp}
            />
            <SeasonView
              key={activeSeasonId}
              season={activeSeasonId}
              seasonInfo={seasonInfo}
              seasonType={seasonType}
              players={players}
            />
          </>
        ) : (
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress color="secondary" />
              </Box>
            }
          >
            <StatsPage />
          </Suspense>
        )}

        <Box
          component="footer"
          sx={{
            textAlign: "center",
            pt: 5,
            color: "text.disabled",
            fontSize: "0.75rem",
            userSelect: "none",
          }}
        >
          היכל התהילה · פנטזי ליג · © כל הזכויות שמורות
        </Box>
      </Box>

      <BottomNav view={route.view} onViewChange={goView} />
    </ThemeProvider>
  );
}

export default App;
