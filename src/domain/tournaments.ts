import { rankedTables } from './feats';
import type { Placing } from './stats';
import type { CompetitionId, League, Player } from './types';

/** The national-team tournaments: short, a month long, every two years. */
export const TOURNAMENTS: ReadonlySet<CompetitionId> = new Set(['world-cup', 'euro']);

export interface TournamentRow {
  player: Player;
  tournaments: number;
  titles: number;
  podiums: number;
  /** Average final place. */
  average: number;
}

/**
 * Everyone who played a World Cup or a Euro, by average place relative to the field (so a
 * fourth of eight counts as better than a fourth of five), then by titles.
 */
export function tournamentTable(league: League): TournamentRow[] {
  const rows = new Map<number, { player: Player; places: { p: Placing; field: number }[] }>();
  for (const table of rankedTables(league, TOURNAMENTS))
    for (const p of table) {
      const row = rows.get(p.player.id) ?? { player: p.player, places: [] };
      row.places.push({ p, field: table.length });
      rows.set(p.player.id, row);
    }
  const rank = (p: Placing) => p.result.rank ?? 0;
  return [...rows.values()]
    .map(({ player, places }) => ({
      relative:
        places.reduce((a, { p, field }) => a + (field > 1 ? (rank(p) - 1) / (field - 1) : 0), 0) /
        places.length,
      row: {
        player,
        tournaments: places.length,
        titles: places.filter(({ p }) => rank(p) === 1).length,
        podiums: places.filter(({ p }) => rank(p) <= 3).length,
        average:
          Math.round((places.reduce((a, { p }) => a + rank(p), 0) / places.length) * 10) / 10,
      },
    }))
    .sort(
      (a, b) =>
        a.relative - b.relative || b.row.titles - a.row.titles || a.row.player.id - b.row.player.id,
    )
    .map(({ row }) => row);
}
