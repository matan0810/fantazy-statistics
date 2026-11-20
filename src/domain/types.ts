export type Lang = 'he' | 'en';

export const COMPETITION_IDS = ['ucl', 'world-cup', 'euro', 'ligat-haal'] as const;
export type CompetitionId = (typeof COMPETITION_IDS)[number];

export interface Player {
  id: number;
  name: Record<Lang, string>;
  /** Identity colour: the player's line, dot and avatar everywhere on the site. */
  color: string;
}

export interface Season {
  id: number;
  competition: CompetitionId;
  /** Calendar year the season ended in (2026 = the 25/26 season for two-year leagues). */
  year: number;
  /** The league's own name that season, when it had one. */
  name?: string;
  /** The final points were not kept; only the finishing order is known. */
  pointsLost: boolean;
}

export interface Result {
  season: number;
  player: number;
  /** Final position, 1 = champion. null when it was not recorded. */
  rank: number | null;
  /** null exactly when the season's points were lost. */
  points: number | null;
  team: string | null;
  coach: string | null;
}

export interface League {
  players: Player[];
  seasons: Season[];
  results: Result[];
  /** Proof screenshots per season id, as paths under public/. */
  proofs: ReadonlyMap<number, string[]>;
}
