import { rankedTables } from './feats';
import {
  ALL_COMPETITIONS,
  medalTable,
  type CompetitionFilter,
  type Placing,
  type PlayerValue,
} from './stats';
import type { CompetitionId, League, Player } from './types';

/**
 * More of the league's stories: the near misses, the steady and the patient. Each is
 * computed over the chosen competitions, from ranked seasons only.
 */

export interface Heartbreak {
  /** Second place that season. */
  placing: Placing;
  champion: Placing;
  /** Points behind the champion. */
  value: number;
}

export interface SeasonFeat {
  placing: Placing;
  value: number;
}

export interface Steadiest extends PlayerValue {
  seasons: number;
}

export interface Form extends PlayerValue {
  /** Of the last seasons, how many the player was in. */
  played: number;
  of: number;
}

export interface LoyalName extends PlayerValue {
  team: string;
}

export interface Stories {
  mostThirds: PlayerValue | undefined;
  /** The title lost by the fewest points. */
  heartbreak: Heartbreak | undefined;
  /** The most points above the season's average by someone who did not win it (percent). */
  bestWithoutTitle: SeasonFeat | undefined;
  /** The smallest spread of places, over at least five seasons (spread in places). */
  steadiest: Steadiest | undefined;
  /** Most times finishing above the champion of the competition's previous season. */
  aboveChampion: PlayerValue | undefined;
  /** Best average place over the last seasons (value: average place). */
  form: Form | undefined;
  /** Most seasons played before a first title (value), with that title. */
  longestWait: SeasonFeat | undefined;
  /** The same team name for the most seasons. */
  loyalName: LoyalName | undefined;
}

export const FORM_SEASONS = 4;
export const STEADY_MIN_SEASONS = 5;

/** Within a year, club seasons end in May and the summer tournaments after them. */
const ENDS: Record<CompetitionId, number> = { ucl: 0, 'ligat-haal': 0, euro: 1, 'world-cup': 1 };
const round1 = (n: number) => Math.round(n * 10) / 10;
const rankOf = (p: Placing) => p.result.rank ?? 0;
/** 0 for first, 1 for last: places compare across fields of any size. */
const relative = (p: Placing, field: number) => (field > 1 ? (rankOf(p) - 1) / (field - 1) : 0);

/** Every ranked season, oldest first. */
function chronological(league: League, filter: CompetitionFilter): Placing[][] {
  return rankedTables(league, filter)
    .filter((t) => t.length > 0)
    .sort((a, b) => {
      const [x, y] = [a[0]?.season, b[0]?.season];
      if (!x || !y) return 0;
      return x.year - y.year || ENDS[x.competition] - ENDS[y.competition];
    });
}

export function stories(league: League, filter: CompetitionFilter = ALL_COMPETITIONS): Stories {
  const tables = chronological(league, filter);
  return {
    mostThirds: mostThirds(league, filter),
    heartbreak: heartbreak(tables),
    bestWithoutTitle: bestWithoutTitle(tables),
    steadiest: steadiest(tables),
    aboveChampion: aboveChampion(tables),
    form: form(tables),
    longestWait: longestWait(tables),
    loyalName: loyalName(tables),
  };
}

function mostThirds(league: League, filter: CompetitionFilter): PlayerValue | undefined {
  const best = [...medalTable(league, filter)].sort(
    (a, b) => b.thirds - a.thirds || a.appearances - b.appearances,
  )[0];
  return best && best.thirds > 0 ? { player: best.player, value: best.thirds } : undefined;
}

function heartbreak(tables: Placing[][]): Heartbreak | undefined {
  let best: Heartbreak | undefined;
  for (const [first, second] of tables) {
    if (!first || !second || rankOf(first) !== 1 || rankOf(second) !== 2) continue;
    if (first.result.points === null || second.result.points === null) continue;
    const value = first.result.points - second.result.points;
    if (!best || value < best.value) best = { placing: second, champion: first, value };
  }
  return best;
}

function bestWithoutTitle(tables: Placing[][]): SeasonFeat | undefined {
  let best: SeasonFeat | undefined;
  for (const table of tables) {
    const points = table.map((p) => p.result.points).filter((p): p is number => p !== null);
    if (points.length < 3) continue;
    const average = points.reduce((a, b) => a + b, 0) / points.length;
    for (const p of table) {
      if (rankOf(p) === 1 || p.result.points === null) continue;
      const value = round1((p.result.points / average - 1) * 100);
      if (!best || value > best.value) best = { placing: p, value };
    }
  }
  return best;
}

function byPlayer(tables: Placing[][]) {
  const seasons = new Map<number, { player: Player; places: { p: Placing; field: number }[] }>();
  for (const table of tables)
    for (const p of table) {
      const entry = seasons.get(p.player.id) ?? { player: p.player, places: [] };
      entry.places.push({ p, field: table.length });
      seasons.set(p.player.id, entry);
    }
  return [...seasons.values()];
}

const spread = (values: number[]) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length);
};

function steadiest(tables: Placing[][]): Steadiest | undefined {
  const best = byPlayer(tables)
    .filter((e) => e.places.length >= STEADY_MIN_SEASONS)
    .map((e) => ({
      e,
      score: spread(e.places.map(({ p, field }) => relative(p, field))),
    }))
    .sort((a, b) => a.score - b.score || b.e.places.length - a.e.places.length)[0];
  if (!best) return undefined;
  return {
    player: best.e.player,
    value: round1(spread(best.e.places.map(({ p }) => rankOf(p)))),
    seasons: best.e.places.length,
  };
}

function aboveChampion(tables: Placing[][]): PlayerValue | undefined {
  const count = new Map<number, { player: Player; value: number; seasons: number }>();
  const lastChampion = new Map<string, number>();
  for (const table of tables) {
    const competition = table[0]?.season.competition ?? '';
    const reigning = lastChampion.get(competition);
    const theirRank = table.find((p) => p.player.id === reigning)?.result.rank ?? null;
    for (const p of table) {
      const entry = count.get(p.player.id) ?? { player: p.player, value: 0, seasons: 0 };
      entry.seasons++;
      if (theirRank !== null && p.player.id !== reigning && rankOf(p) < theirRank) entry.value++;
      count.set(p.player.id, entry);
    }
    const champion = table.find((p) => rankOf(p) === 1);
    if (champion) lastChampion.set(competition, champion.player.id);
  }
  const best = [...count.values()].sort(
    (a, b) => b.value - a.value || a.seasons - b.seasons || a.player.id - b.player.id,
  )[0];
  return best && best.value > 0 ? { player: best.player, value: best.value } : undefined;
}

function form(tables: Placing[][]): Form | undefined {
  const recent = tables.slice(-FORM_SEASONS);
  const need = Math.min(3, recent.length);
  const best = byPlayer(recent)
    .filter((e) => e.places.length >= need && need > 0)
    .map((e) => ({
      e,
      score: e.places.reduce((a, { p, field }) => a + relative(p, field), 0) / e.places.length,
    }))
    .sort((a, b) => a.score - b.score || b.e.places.length - a.e.places.length)[0];
  if (!best) return undefined;
  const ranks = best.e.places.map(({ p }) => rankOf(p));
  return {
    player: best.e.player,
    value: round1(ranks.reduce((a, b) => a + b, 0) / ranks.length),
    played: ranks.length,
    of: recent.length,
  };
}

function longestWait(tables: Placing[][]): SeasonFeat | undefined {
  let best: SeasonFeat | undefined;
  for (const { places } of byPlayer(tables)) {
    const first = places.findIndex(({ p }) => rankOf(p) === 1);
    const title = places[first]?.p;
    // On a tie, the later title: the wait is still the longest, and the more recent.
    if (title && first > 0 && (!best || first >= best.value))
      best = { placing: title, value: first };
  }
  return best;
}

function loyalName(tables: Placing[][]): LoyalName | undefined {
  const count = new Map<string, LoyalName & { last: number }>();
  tables.forEach((table, i) => {
    for (const p of table) {
      const team = p.result.team;
      if (!team) continue;
      const key = `${p.player.id}:${team.trim().toLowerCase()}`;
      const entry = count.get(key) ?? { player: p.player, team, value: 0, last: 0 };
      entry.value++;
      entry.last = i;
      count.set(key, entry);
    }
  });
  const best = [...count.values()].sort((a, b) => b.value - a.value || b.last - a.last)[0];
  return best && best.value >= 2
    ? { player: best.player, team: best.team, value: best.value }
    : undefined;
}
