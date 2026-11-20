import { describe, expect, it } from 'vitest';
import { league } from '../../domain/league';
import { feats } from '../../domain/feats';
import { records } from '../../domain/stats';
import type { CompetitionId } from '../../domain/types';
import { STRINGS } from '../../i18n/strings';
import { recordCards } from './recordCards';

const filter = new Set<CompetitionId>(['ucl', 'world-cup', 'euro']);
const cards = recordCards(
  records(league, filter),
  feats(league, filter),
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
    expect(card('leap')?.sub).toContain('ממקום 5 למקום 1');
  });

  it('names the rival', () => {
    expect(card('rivalry')).toMatchObject({ value: '8–7', href: '#/player/1' });
    expect(card('rivalry')?.sub).toContain('מול נתי');
  });

  it('tells more than one player’s story', () => {
    expect(new Set(cards.map((c) => c.player.id)).size).toBeGreaterThanOrEqual(5);
  });

  it('opens career totals on the player', () => {
    expect(card('titles')?.href).toBe('#/player/4');
  });
});
