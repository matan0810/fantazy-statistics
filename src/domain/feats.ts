import { COMPETITIONS } from './competitions';
import {
  ALL_COMPETITIONS,
  medalTable,
  seasonsOf,
  standings,
  type CompetitionFilter,
  type Placing,
  type PlayerValue,
} from './stats';
import type { League, Player } from './types';

/**
 * Records beyond the leaders: the runner-up, the leap, the rivalry and the last place.
 * They tell the stories of the rest of the league, not only of whoever wins most.
 */

export interface Leap {
  /** The season of the leap. */
  placing: Placing;
  /** The player's rank in their previous season of that competition. */
  from: number;
  /** Places gained. */
  value: number;
}

export interface Rivalry {
  /** The one ahead in their meetings (or the first of the two when level). */
  leader: Player;
  rival: Player;
  wins: number;
  losses: number;
}

export interface Feats {
  /** Most second places. */
  mostSeconds: PlayerValue | undefined;
  /** The most places gained from one season of a competition to the player's next. */
  biggestLeap: Leap | undefined;
  /** The most even of the pairs that met most often. */
  rivalry: Rivalry | undefined;
  /** Most last places, in fields of three or more. */
  woodenSpoon: PlayerValue | undefined;
}

/** Ranked seasons of the filter's competitions, oldest first. */
function rankedTables(league: League, filter: CompetitionFilter): Placing[][] {
  return COMPETITIONS.filter((c) => filter.has(c.id)).flatMap((c) =>
    seasonsOf(league, c.id)
      .reverse()
      .map((s) => standings(league, s).filter((p) => p.result.rank !== null)),
  );
}

export function feats(league: League, filter: CompetitionFilter = ALL_COMPETITIONS): Feats {
  const tables = rankedTables(league, filter);
  return {
    mostSeconds: mostSeconds(league, filter),
    biggestLeap: biggestLeap(tables),
    rivalry: rivalry(tables),
    woodenSpoon: woodenSpoon(tables),
  };
}

function mostSeconds(league: League, filter: CompetitionFilter): PlayerValue | undefined {
  const best = [...medalTable(league, filter)].sort(
    (a, b) => b.seconds - a.seconds || a.appearances - b.appearances,
  )[0];
  return best && best.seconds > 0 ? { player: best.player, value: best.seconds } : undefined;
}

function biggestLeap(tables: Placing[][]): Leap | undefined {
  const last = new Map<string, number>();
  let best: Leap | undefined;
  for (const table of tables) {
    for (const p of table) {
      const key = `${p.season.competition}:${p.player.id}`;
      const rank = p.result.rank ?? 0;
      const from = last.get(key);
      last.set(key, rank);
      if (from === undefined) continue;
      const value = from - rank;
      // Ties go to the leap that lands higher, then to the later one.
      if (
        value >= 2 &&
        (!best ||
          value > best.value ||
          (value === best.value && rank <= (best.placing.result.rank ?? 0)))
      )
        best = { placing: p, from, value };
    }
  }
  return best;
}

function rivalry(tables: Placing[][]): Rivalry | undefined {
  const pairs = new Map<string, { a: Player; b: Player; aAhead: number; bAhead: number }>();
  for (const table of tables) {
    table.forEach((x, i) =>
      table.slice(i + 1).forEach((y) => {
        const [a, b] = x.player.id < y.player.id ? [x, y] : [y, x];
        const key = `${a.player.id}:${b.player.id}`;
        const pair = pairs.get(key) ?? { a: a.player, b: b.player, aAhead: 0, bAhead: 0 };
        if ((a.result.rank ?? 0) < (b.result.rank ?? 0)) pair.aAhead++;
        else pair.bAhead++;
        pairs.set(key, pair);
      }),
    );
  }
  const all = [...pairs.values()];
  const meetings = (p: (typeof all)[number]) => p.aAhead + p.bAhead;
  const most = Math.max(0, ...all.map(meetings));
  // Only pairs that met at least half as often as the most frequent pair count as rivals.
  const rivals = all
    .filter((p) => most >= 4 && meetings(p) * 2 >= most)
    .sort(
      (x, y) =>
        Math.abs(x.aAhead - x.bAhead) - Math.abs(y.aAhead - y.bAhead) ||
        meetings(y) - meetings(x) ||
        x.a.id - y.a.id,
    );
  const top = rivals[0];
  if (!top) return undefined;
  return top.aAhead >= top.bAhead
    ? { leader: top.a, rival: top.b, wins: top.aAhead, losses: top.bAhead }
    : { leader: top.b, rival: top.a, wins: top.bAhead, losses: top.aAhead };
}

function woodenSpoon(tables: Placing[][]): PlayerValue | undefined {
  const count = new Map<number, { player: Player; value: number; seasons: number }>();
  for (const table of tables) {
    for (const p of table) {
      const entry = count.get(p.player.id) ?? { player: p.player, value: 0, seasons: 0 };
      entry.seasons++;
      if (table.length >= 3 && p.result.rank === table.length) entry.value++;
      count.set(p.player.id, entry);
    }
  }
  const worst = [...count.values()].sort(
    (a, b) => b.value - a.value || b.seasons - a.seasons || a.player.id - b.player.id,
  )[0];
  return worst && worst.value > 0 ? { player: worst.player, value: worst.value } : undefined;
}
