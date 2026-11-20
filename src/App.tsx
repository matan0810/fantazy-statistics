import { useEffect } from 'react';
import { league } from './domain/league';
import { routeHash } from './domain/routes';
import { latestSeason, playerById, seasonById } from './domain/stats';
import { seasonLabel } from './domain/competitions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRoute } from './hooks/useRoute';
import { useI18n } from './i18n/context';
import { Header } from './layout/Header';
import { Home } from './screens/Home';
import { PlayerScreen } from './screens/PlayerScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { SeasonScreen } from './screens/SeasonScreen';

// Keys keep the site's first name, so visitors' saved choices survive the rename.
const LAST_SEASON_KEY = 'hall-of-fame:season';

export function App() {
  const route = useRoute();
  const { t, name } = useI18n();
  const [lastSeason, setLastSeason] = useLocalStorage<number | null>(LAST_SEASON_KEY, null);
  const fallbackSeason = latestSeason(league, 'ucl')?.id ?? 1;
  const seasonsHref = routeHash({
    name: 'season',
    id: lastSeason !== null && seasonById(league, lastSeason) ? lastSeason : fallbackSeason,
  });

  useEffect(() => {
    if (route.name === 'season' && route.id !== lastSeason) setLastSeason(route.id);
  }, [route, lastSeason, setLastSeason]);

  // The tab title names the screen.
  useEffect(() => {
    let page = '';
    if (route.name === 'season') {
      const s = seasonById(league, route.id);
      if (s) page = `${t.competition[s.competition]} ${seasonLabel(s.year, s.competition)}`;
    } else if (route.name === 'player') {
      const p = playerById(league, route.id);
      if (p) page = name(p);
    } else if (route.name === 'records') page = t.recordsTitle;
    document.title = page ? `${page} · ${t.brand}` : `${t.brand} · ${t.league}`;
  }, [route, t, name]);

  return (
    <>
      <Header route={route} seasonsHref={seasonsHref} />
      {route.name === 'home' && <Home />}
      {route.name === 'season' && <SeasonScreen id={route.id} />}
      {route.name === 'player' && (
        <PlayerScreen key={route.id} id={route.id} competition={route.competition} />
      )}
      {route.name === 'records' && <RecordsScreen />}
    </>
  );
}
