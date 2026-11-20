import { describe, expect, it } from 'vitest';
import { seasonLabel } from './competitions';

describe('seasonLabel', () => {
  it('shows two-year leagues as start/end', () => {
    expect(seasonLabel(2026, 'ucl')).toBe('25/26');
    expect(seasonLabel(2000, 'ligat-haal')).toBe('99/00');
  });

  it('shows summer tournaments as one year', () => {
    expect(seasonLabel(2026, 'world-cup')).toBe('2026');
    expect(seasonLabel(2024, 'euro')).toBe('2024');
  });
});
