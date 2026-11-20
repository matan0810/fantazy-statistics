import { rankedTables } from './feats';
import { ALL_COMPETITIONS, type CompetitionFilter } from './stats';
import type { League, Player } from './types';

export interface Meeting {
  rival: Player;
  /** Seasons the player finished above the rival. */
  above: number;
  below: number;
}

/** A player's record against everyone they shared a season with, most meetings first. */
export function headToHead(
  league: League,
  playerId: number,
  filter: CompetitionFilter = ALL_COMPETITIONS,
): Meeting[] {
  const meetings = new Map<number, Meeting>();
  for (const table of rankedTables(league, filter)) {
    const mine = table.find((p) => p.player.id === playerId)?.result.rank;
    if (mine == null) continue;
    for (const other of table) {
      const theirs = other.result.rank;
      if (other.player.id === playerId || theirs === null) continue;
      const m = meetings.get(other.player.id) ?? { rival: other.player, above: 0, below: 0 };
      if (mine < theirs) m.above++;
      else m.below++;
      meetings.set(other.player.id, m);
    }
  }
  return [...meetings.values()].sort(
    (a, b) => b.above + b.below - (a.above + a.below) || a.rival.id - b.rival.id,
  );
}
