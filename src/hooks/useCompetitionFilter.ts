import { useMemo } from 'react';
import { COMPETITION_IDS, type CompetitionId } from '../domain/types';
import { useLocalStorage } from './useLocalStorage';

// Keys keep the site's first name, so visitors' saved choices survive the rename.
const KEY = 'hall-of-fame:records-filter';
/** The Israeli league is a full-year season, so it is not counted unless chosen. */
export const DEFAULT_COMPETITIONS: readonly CompetitionId[] = ['ucl', 'world-cup', 'euro'];

/** Keeps only known competitions, in display order; anything unreadable is the default. */
export function readFilter(stored: unknown): CompetitionId[] {
  if (!Array.isArray(stored)) return [...DEFAULT_COMPETITIONS];
  return COMPETITION_IDS.filter((id) => stored.includes(id));
}

/**
 * The competitions counted in the medal table and the records, shared by the home page
 * and the records page and remembered. It may be empty: then nothing is counted.
 */
export function useCompetitionFilter() {
  const [active, setStored] = useLocalStorage<CompetitionId[]>(
    KEY,
    [...DEFAULT_COMPETITIONS],
    readFilter,
  );
  const filter = useMemo(() => new Set(active), [active]);
  const toggle = (id: CompetitionId) =>
    setStored(active.includes(id) ? active.filter((x) => x !== id) : [...active, id]);
  return { active, filter, toggle };
}
