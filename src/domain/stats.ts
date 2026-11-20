import { COMPETITIONS } from './competitions';
import type { CompetitionId, League, Player, Result, Season } from './types';

/**
 * Everything the site shows is derived here, from the League alone: no React, no DOM.
 *
 * Points are only ever compared within one competition. Each competition has a
 * different number of game weeks, so across competitions we use titles, podiums and
 * per-competition averages, never raw points.
 */

export type CompetitionFilter = ReadonlySet<CompetitionId>;
export const ALL_COMPETITIONS: CompetitionFilter = new Set(COMPETITIONS.map((c) => c.id));

export interface Placing {
  season: Season;
  player: Player;
  result: Result;
  /** Points behind first place; null for first place or when points are unknown. */
  gap: number | null;
}

const byRank = (a: Result, b: Result) => (a.rank ?? Infinity) - (b.rank ?? Infinity);

function playerOf(league: League, id: number): Player {
  const player = league.players.find((p) => p.id === id);
  if (!player) throw new Error(`Unknown player ${id}`);
  return player;
}

export function seasonById(league: League, id: number): Season | undefined {
  return league.seasons.find((s) => s.id === id);
}

export function playerById(league: League, id: number): Player | undefined {
  return league.players.find((p) => p.id === id);
}

/** Seasons of one competition, newest first. */
export function seasonsOf(league: League, competition: CompetitionId): Season[] {
  return league.seasons
    .filter((s) => s.competition === competition)
    .sort((a, b) => b.year - a.year);
}

export function latestSeason(league: League, competition: CompetitionId): Season | undefined {
  return seasonsOf(league, competition)[0];
}

/** The final table of a season, best rank first (unknown ranks last). */
export function standings(league: League, season: Season): Placing[] {
  const results = league.results.filter((r) => r.season === season.id).sort(byRank);
  const top = results[0]?.points ?? null;
  return results.map((result, i) => ({
    season,
    player: playerOf(league, result.player),
    result,
    gap: i === 0 || top === null || result.points === null ? null : top - result.points,
  }));
}

export interface SeasonSummary {
  standings: Placing[];
  champion: Placing | undefined;
  /** Points between first and second, when both are known. */
  margin: number | null;
  average: number | null;
}

export function summarize(league: League, season: Season): SeasonSummary {
  const table = standings(league, season);
  const [first, second] = table;
  const points = table.map((p) => p.result.points).filter((p): p is number => p !== null);
  return {
    standings: table,
    champion: first?.result.rank === 1 ? first : undefined,
    margin:
      first?.result.points != null && second?.result.points != null
        ? first.result.points - second.result.points
        : null,
    average: points.length ? Math.round(points.reduce((a, b) => a + b, 0) / points.length) : null,
  };
}

// ---------------------------------------------------------------- careers ---

export interface Medals {
  titles: number;
  seconds: number;
  thirds: number;
  podiums: number;
}

export interface CompetitionCareer extends Medals {
  competition: CompetitionId;
  appearances: number;
  /** Seasons with known points, which the average and best are based on. */
  scoredSeasons: number;
  average: number | null;
  best: number | null;
  bestRank: number | null;
}

export interface HistoryEntry {
  season: Season;
  result: Result;
  field: number;
}

export interface Career extends Medals {
  player: Player;
  appearances: number;
  bestRank: number | null;
  byCompetition: CompetitionCareer[];
  /** Newest first. */
  history: HistoryEntry[];
}

function medals(results: Result[]): Medals {
  const count = (rank: number) => results.filter((r) => r.rank === rank).length;
  const titles = count(1);
  const seconds = count(2);
  const thirds = count(3);
  return { titles, seconds, thirds, podiums: titles + seconds + thirds };
}

function bestRank(results: Result[]): number | null {
  const ranks = results.map((r) => r.rank).filter((r): r is number => r !== null);
  return ranks.length ? Math.min(...ranks) : null;
}

export function career(
  league: League,
  player: Player,
  filter: CompetitionFilter = ALL_COMPETITIONS,
): Career {
  const seasonOf = new Map(league.seasons.map((s) => [s.id, s]));
  const mine = league.results.filter(
    (r) => r.player === player.id && filter.has(seasonOf.get(r.season)?.competition ?? 'ucl'),
  );
  const fieldOf = (id: number) => league.results.filter((r) => r.season === id).length;

  const byCompetition = COMPETITIONS.filter((c) => filter.has(c.id))
    .map((c): CompetitionCareer => {
      const results = mine.filter((r) => seasonOf.get(r.season)?.competition === c.id);
      const scored = results.map((r) => r.points).filter((p): p is number => p !== null);
      return {
        competition: c.id,
        appearances: results.length,
        scoredSeasons: scored.length,
        average: scored.length
          ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
          : null,
        best: scored.length ? Math.max(...scored) : null,
        bestRank: bestRank(results),
        ...medals(results),
      };
    })
    .filter((c) => c.appearances > 0);

  const history = mine
    .map((result) => {
      const season = seasonOf.get(result.season);
      if (!season) throw new Error(`Unknown season ${result.season}`);
      return { season, result, field: fieldOf(season.id) };
    })
    .sort(
      (a, b) =>
        b.season.year - a.season.year || a.season.competition.localeCompare(b.season.competition),
    );

  return {
    player,
    appearances: mine.length,
    bestRank: bestRank(mine),
    byCompetition,
    history,
    ...medals(mine),
  };
}

/** Everyone with at least one season, by titles, then seconds, thirds, fewer seasons. */
export function medalTable(league: League, filter: CompetitionFilter = ALL_COMPETITIONS): Career[] {
  return league.players
    .map((p) => career(league, p, filter))
    .filter((c) => c.appearances > 0)
    .sort(
      (a, b) =>
        b.titles - a.titles ||
        b.seconds - a.seconds ||
        b.thirds - a.thirds ||
        a.appearances - b.appearances ||
        a.player.id - b.player.id,
    );
}

// ---------------------------------------------------------------- records ---

export interface ChampionEntry {
  season: Season;
  champion: Placing;
  margin: number | null;
}

/** Every champion of a competition, newest first. */
export function champions(league: League, competition: CompetitionId): ChampionEntry[] {
  return seasonsOf(league, competition).flatMap((season) => {
    const { champion, margin } = summarize(league, season);
    return champion ? [{ season, champion, margin }] : [];
  });
}

export interface PlayerValue {
  player: Player;
  value: number;
}

export interface SeasonRecord {
  placing: Placing;
  value: number;
  /** Second place that season, for records about a title race. */
  runnerUp?: Placing;
}

export interface Records {
  mostTitles: PlayerValue | undefined;
  mostPodiums: PlayerValue | undefined;
  mostSeasons: PlayerValue | undefined;
  /** Best per-competition average over at least two scored seasons. */
  bestAverage: (PlayerValue & { competition: CompetitionId; seasons: number }) | undefined;
  /** Most titles in a row within one competition. */
  longestStreak: (PlayerValue & { competition: CompetitionId }) | undefined;
  /** Smallest gap between first and second. */
  closestTitle: SeasonRecord | undefined;
  /** Largest gap between first and second, relative to second (percent). */
  biggestWin: SeasonRecord | undefined;
  /** Highest season score per competition. */
  highScores: SeasonRecord[];
}

const top = <T>(items: T[], score: (item: T) => number): T | undefined =>
  items.reduce<T | undefined>(
    (best, item) => (best === undefined || score(item) > score(best) ? item : best),
    undefined,
  );

export function records(league: League, filter: CompetitionFilter = ALL_COMPETITIONS): Records {
  const table = medalTable(league, filter);
  const pv = (c: Career | undefined, value: (c: Career) => number) =>
    c && value(c) > 0 ? { player: c.player, value: value(c) } : undefined;

  const averages = table.flatMap((c) =>
    c.byCompetition
      .filter((cc) => cc.scoredSeasons >= 2 && cc.average !== null)
      .map((cc) => ({
        player: c.player,
        value: cc.average ?? 0,
        competition: cc.competition,
        seasons: cc.scoredSeasons,
      })),
  );

  const comps = COMPETITIONS.filter((c) => filter.has(c.id)).map((c) => c.id);
  const allChampions = comps.flatMap((id) => champions(league, id));

  const streaks = comps.flatMap((id) => {
    // oldest first, so a run reads forward in time
    const roll = champions(league, id).reverse();
    const runs: (PlayerValue & { competition: CompetitionId })[] = [];
    let run = 0;
    roll.forEach((entry, i) => {
      run = i > 0 && roll[i - 1]?.champion.player.id === entry.champion.player.id ? run + 1 : 1;
      runs.push({ player: entry.champion.player, value: run, competition: id });
    });
    return runs;
  });

  const withMargin = allChampions.filter(
    (c): c is ChampionEntry & { margin: number } => c.margin !== null,
  );

  const highScores = comps.flatMap((id) => {
    const placings = seasonsOf(league, id).flatMap((s) => standings(league, s));
    const best = top(
      placings.filter((p) => p.result.points !== null),
      (p) => p.result.points ?? 0,
    );
    return best ? [{ placing: best, value: best.result.points ?? 0 }] : [];
  });

  const closest = withMargin.reduce<(typeof withMargin)[number] | undefined>(
    (best, c) => (best === undefined || c.margin < best.margin ? c : best),
    undefined,
  );
  const biggest = top(withMargin, (c) => relativeMargin(league, c));

  return {
    mostTitles: pv(table[0], (c) => c.titles),
    mostPodiums: pv(
      top(table, (c) => c.podiums * 1000 - c.appearances),
      (c) => c.podiums,
    ),
    mostSeasons: pv(
      top(table, (c) => c.appearances),
      (c) => c.appearances,
    ),
    bestAverage: top(averages, (a) => a.value),
    longestStreak: top(
      streaks.filter((s) => s.value >= 2),
      (s) => s.value,
    ),
    closestTitle: closest && {
      placing: closest.champion,
      value: closest.margin,
      runnerUp: standings(league, closest.season)[1],
    },
    biggestWin: biggest && {
      placing: biggest.champion,
      value: Math.round(relativeMargin(league, biggest) * 10) / 10,
      runnerUp: standings(league, biggest.season)[1],
    },
    highScores,
  };
}

function relativeMargin(league: League, entry: ChampionEntry): number {
  const second = standings(league, entry.season)[1]?.result.points;
  if (entry.margin === null || !second) return 0;
  return (entry.margin / second) * 100;
}

// -------------------------------------------------------------- rank lines ---

export interface RankPoint {
  /** Position of the season on the time axis (0 = oldest). */
  index: number;
  season: Season;
  rank: number;
  field: number;
  points: number | null;
}

export interface RankLine {
  player: Player;
  points: RankPoint[];
  titles: number;
}

export interface RankChart {
  competition: CompetitionId;
  /** Oldest first. */
  seasons: Season[];
  /** Largest field: the bottom of the rank axis. */
  maxRank: number;
  lines: RankLine[];
}

/** One line per player through every season of a competition, by final rank. */
export function rankChart(league: League, competition: CompetitionId): RankChart {
  const seasons = seasonsOf(league, competition).reverse();
  const index = new Map(seasons.map((s, i) => [s.id, i]));
  const field = (id: number) => league.results.filter((r) => r.season === id).length;
  const lines = league.players
    .map((player): RankLine => {
      const points = league.results
        .filter((r) => r.player === player.id && index.has(r.season) && r.rank !== null)
        .map((r) => {
          const i = index.get(r.season) ?? 0;
          const season = seasons[i];
          if (!season) throw new Error('season index out of range');
          return { index: i, season, rank: r.rank ?? 0, field: field(r.season), points: r.points };
        })
        .sort((a, b) => a.index - b.index);
      return { player, points, titles: points.filter((p) => p.rank === 1).length };
    })
    .filter((l) => l.points.length > 0)
    .sort((a, b) => b.titles - a.titles || b.points.length - a.points.length);
  const maxRank = Math.max(1, ...lines.flatMap((l) => l.points.map((p) => p.rank)));
  return { competition, seasons, maxRank, lines };
}
