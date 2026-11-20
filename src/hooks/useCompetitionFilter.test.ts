import { describe, expect, it } from 'vitest';
import { readFilter } from './useCompetitionFilter';

describe('readFilter', () => {
  it('keeps known competitions in display order', () => {
    expect(readFilter(['euro', 'ucl', 'nba'])).toEqual(['ucl', 'euro']);
  });

  it('allows choosing none', () => {
    expect(readFilter([])).toEqual([]);
  });

  it('falls back to the default for anything unreadable', () => {
    expect(readFilter('ucl')).toEqual(['ucl', 'world-cup', 'euro']);
  });
});
