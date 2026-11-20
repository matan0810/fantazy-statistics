import { describe, expect, it } from 'vitest';
import { league } from '../../domain/league';
import { records } from '../../domain/stats';
import type { CompetitionId } from '../../domain/types';
import { STRINGS } from '../../i18n/strings';
import { recordCards } from './recordCards';

const cards = recordCards(
  records(league, new Set<CompetitionId>(['ucl', 'world-cup', 'euro'])),
  STRINGS.he,
  (p) => p.name.he,
);
const card = (key: string) => cards.find((c) => c.id === key);

describe('record cards', () => {
  it('opens a streak or an average on the competition it was set in', () => {
    expect(card('streak')?.href).toBe('#/player/4/ucl');
    expect(card('average')?.href).toMatch(/^#\/player\/\d+\/[a-z-]+$/);
  });

  it('opens a title race on its season and names the runner-up', () => {
    expect(card('closest')?.href).toBe('#/season/4');
    expect(card('closest')?.sub).toContain('מול גבי');
    expect(card('biggest')?.href).toBe('#/season/20');
  });

  it('opens career totals on the player', () => {
    expect(card('titles')?.href).toBe('#/player/4');
  });
});
