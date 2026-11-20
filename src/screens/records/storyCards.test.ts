import { describe, expect, it } from 'vitest';
import { league } from '../../domain/league';
import { stories } from '../../domain/stories';
import type { CompetitionId } from '../../domain/types';
import { STRINGS } from '../../i18n/strings';
import { recordCards } from './recordCards';
import { inOrder, storyCards } from './storyCards';
import { feats } from '../../domain/feats';
import { records } from '../../domain/stats';

const filter = new Set<CompetitionId>(['ucl', 'world-cup', 'euro']);
const cards = storyCards(stories(league, filter), STRINGS.he, (p) => p.name.he);
const card = (id: string) => cards.find((c) => c.id === id);

describe('story cards', () => {
  it('has a card for every story', () => {
    expect(cards.map((c) => c.id)).toEqual([
      'thirds',
      'heartbreak',
      'without-title',
      'above-champion',
      'steadiest',
      'form',
      'wait',
      'loyal',
    ]);
  });

  it('names the champion a title was lost to, and opens that season', () => {
    expect(card('heartbreak')).toMatchObject({ value: 'שוויון', href: '#/season/4' });
    expect(card('heartbreak')?.sub).toContain('בשוויון נקודות עם מתן');
  });

  it('opens a season story on its season and a career story on the player', () => {
    expect(card('without-title')?.href).toMatch(/^#\/season\/\d+$/);
    expect(card('wait')?.href).toMatch(/^#\/season\/\d+$/);
    expect(card('steadiest')?.href).toBe('#/player/8');
    expect(card('loyal')?.sub).toContain('ריאל קוסקוס');
  });

  it('writes a spread and a percentage with their signs', () => {
    expect(card('steadiest')?.value).toBe('±0.5');
    expect(card('without-title')?.value).toBe('+31.8%');
  });
});

describe('all record cards', () => {
  const all = inOrder([
    ...recordCards(records(league, filter), feats(league, filter), STRINGS.he, (p) => p.name.he),
    ...cards,
  ]);

  it('lead with the titles and end with the seasons played', () => {
    expect(all[0]?.id).toBe('titles');
    expect(all.at(-1)?.id).toBe('seasons');
  });

  it('tell the stories of most of the league', () => {
    expect(new Set(all.map((c) => c.player.id)).size).toBeGreaterThanOrEqual(6);
  });
});
