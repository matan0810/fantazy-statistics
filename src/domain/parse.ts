import {
  COMPETITION_IDS,
  type CompetitionId,
  type League,
  type Player,
  type Result,
  type Season,
} from './types';

/**
 * Turns the raw JSON files into a League, checking every rule the site relies on. Any
 * problem throws with the record at fault, so a bad edit fails the tests and never ships.
 */

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isCompetition = (v: unknown): v is CompetitionId => COMPETITION_IDS.some((id) => id === v);

/** A screenshot in public/proofs/: an image there, by a plain path that cannot climb out. */
const isProofPath = (p: unknown): p is string =>
  typeof p === 'string' &&
  /^\/proofs\/(?:[\w\- .]+\/)*[\w\- .]+\.(?:png|jpe?g|webp)$/i.test(p) &&
  !p.split('/').some((part) => part === '..' || part === '.');

function fail(what: string, record: unknown): never {
  throw new Error(`Invalid data: ${what} in ${JSON.stringify(record)}`);
}

function list(raw: unknown, name: string): unknown[] {
  if (!Array.isArray(raw)) throw new Error(`Invalid data: ${name} is not a list`);
  return raw;
}

function parsePlayer(r: unknown): Player {
  if (!isObject(r) || !isInt(r.id) || r.id < 1) fail('player id', r);
  const name = r.name;
  if (!isObject(name) || !isText(name.he) || !isText(name.en)) fail('player name', r);
  if (typeof r.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(r.color)) fail('player color', r);
  return { id: r.id, name: { he: name.he, en: name.en }, color: r.color };
}

function parseSeason(r: unknown): Season {
  if (!isObject(r) || !isInt(r.id) || r.id < 1) fail('season id', r);
  if (!isCompetition(r.competition)) fail('competition', r);
  if (!isInt(r.year) || r.year < 2000 || r.year > 2100) fail('year', r);
  if (r.name !== undefined && !isText(r.name)) fail('name', r);
  if (r.pointsLost !== undefined && r.pointsLost !== true) fail('pointsLost', r);
  return {
    id: r.id,
    competition: r.competition,
    year: r.year,
    ...(isText(r.name) ? { name: r.name } : {}),
    pointsLost: r.pointsLost === true,
  };
}

function parseResult(r: unknown): Result {
  if (!isObject(r) || !isInt(r.season) || !isInt(r.player)) fail('result ids', r);
  if (r.rank !== null && (!isInt(r.rank) || r.rank < 1)) fail('rank', r);
  if (r.points !== null && (!isInt(r.points) || r.points < 0)) fail('points', r);
  if (r.team !== null && !isText(r.team)) fail('team', r);
  if (r.coach !== null && !isText(r.coach)) fail('coach', r);
  return {
    season: r.season,
    player: r.player,
    rank: r.rank,
    points: r.points,
    team: r.team,
    coach: r.coach,
  };
}

function unique<T>(items: T[], key: (item: T) => string, what: string) {
  const seen = new Set<string>();
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) fail(`duplicate ${what}`, item);
    seen.add(k);
  }
}

export interface RawLeague {
  players: unknown;
  seasons: unknown;
  results: unknown;
  proofs: unknown;
}

export function parseLeague(raw: RawLeague): League {
  const players = list(raw.players, 'players').map(parsePlayer);
  const seasons = list(raw.seasons, 'seasons').map(parseSeason);
  const results = list(raw.results, 'results').map(parseResult);

  unique(players, (p) => String(p.id), 'player id');
  unique(seasons, (s) => String(s.id), 'season id');
  unique(seasons, (s) => `${s.competition}:${s.year}`, 'season (competition and year)');
  unique(results, (r) => `${r.season}:${r.player}`, 'player in a season');
  unique(
    results.filter((r) => r.rank !== null),
    (r) => `${r.season}:${r.rank}`,
    'rank in a season',
  );

  const playerIds = new Set(players.map((p) => p.id));
  const seasonById = new Map(seasons.map((s) => [s.id, s]));
  for (const r of results) {
    const season = seasonById.get(r.season);
    if (!season) fail('unknown season', r);
    if (!playerIds.has(r.player)) fail('unknown player', r);
    if (season.pointsLost !== (r.points === null)) fail('points must be null exactly when lost', r);
  }

  // A better rank never has fewer points.
  for (const season of seasons) {
    const ranked = results
      .filter((r) => r.season === season.id && r.rank !== null && r.points !== null)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    ranked.forEach((r, i) => {
      const prev = ranked[i - 1];
      if (prev && (prev.points ?? 0) < (r.points ?? 0)) fail('points out of rank order', r);
    });
    if (!results.some((r) => r.season === season.id)) fail('season without results', season);
  }

  const proofs = new Map<number, string[]>();
  if (!isObject(raw.proofs)) throw new Error('Invalid data: proofs is not an object');
  for (const [key, paths] of Object.entries(raw.proofs)) {
    const id = Number(key);
    if (!seasonById.has(id)) fail('proof for unknown season', key);
    if (!Array.isArray(paths) || !paths.every(isProofPath)) fail('proof paths', paths);
    proofs.set(id, paths);
  }

  return { players, seasons, results, proofs };
}
