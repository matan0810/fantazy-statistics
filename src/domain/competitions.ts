import type { CompetitionId } from './types';

export interface Competition {
  id: CompetitionId;
  /** Accent used for the competition's tags and charts. */
  color: string;
  /** Runs across two calendar years (shown as 25/26) rather than one summer. */
  spansTwoYears: boolean;
}

/** In display order. Names live in i18n (`competition.<id>`). */
export const COMPETITIONS: readonly Competition[] = [
  { id: 'ucl', color: '#7d9be0', spansTwoYears: true },
  { id: 'world-cup', color: '#d08a5a', spansTwoYears: false },
  { id: 'euro', color: '#5eb5b8', spansTwoYears: false },
  { id: 'ligat-haal', color: '#6fb38a', spansTwoYears: true },
];

export function competition(id: CompetitionId): Competition {
  const found = COMPETITIONS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown competition ${id}`);
  return found;
}

/** "25/26" for two-year leagues, "2026" for summer tournaments. */
export function seasonLabel(year: number, id: CompetitionId): string {
  if (!competition(id).spansTwoYears) return String(year);
  const two = (n: number) => String(((n % 100) + 100) % 100).padStart(2, '0');
  return `${two(year - 1)}/${two(year)}`;
}
