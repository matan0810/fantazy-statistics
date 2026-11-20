import { seasonLabel } from '../domain/competitions';
import { toCsv } from '../domain/csv';
import { standings, type Career, type Placing } from '../domain/stats';
import type { League, Player } from '../domain/types';
import type { Strings } from '../i18n/strings';

type Name = (p: Player) => string;

export function standingsCsv(table: Placing[], t: Strings, name: Name): string {
  const c = t.csv;
  return toCsv(
    [c.rank, c.player, c.team, c.coach, c.points, c.gap],
    table.map((p) => [
      p.result.rank,
      name(p.player),
      p.result.team,
      p.result.coach,
      p.result.points,
      p.gap,
    ]),
  );
}

export function medalCsv(table: Career[], t: Strings, name: Name): string {
  const c = t.csv;
  return toCsv(
    [c.rank, c.player, c.seasons, c.titles, c.seconds, c.thirds, c.podiums],
    table.map((row, i) => [
      i + 1,
      name(row.player),
      row.appearances,
      row.titles,
      row.seconds,
      row.thirds,
      row.podiums,
    ]),
  );
}

/** Every season of every competition, oldest first within each competition. */
export function archiveCsv(league: League, t: Strings, name: Name): string {
  const c = t.csv;
  const rows = [...league.seasons]
    .sort((a, b) => a.competition.localeCompare(b.competition) || a.year - b.year)
    .flatMap((season) =>
      standings(league, season).map((p) => [
        t.competition[season.competition],
        seasonLabel(season.year, season.competition),
        season.name ?? null,
        p.result.rank,
        name(p.player),
        p.result.team,
        p.result.coach,
        p.result.points,
      ]),
    );
  return toCsv(
    [c.competition, c.season, c.leagueName, c.rank, c.player, c.team, c.coach, c.points],
    rows,
  );
}
