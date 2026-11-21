import { describe, expect, it } from 'vitest';
import { headToHead } from './headToHead';
import { league } from './league';

const WITHOUT_LIGAT = new Set(['ucl', 'world-cup', 'euro'] as const);

describe('head to head', () => {
  it('counts the seasons above and below each rival', () => {
    const gabi = headToHead(league, 1, WITHOUT_LIGAT);
    expect(gabi.find((m) => m.rival.id === 2)).toMatchObject({ above: 8, below: 7 });
  });

  it('mirrors between the two players', () => {
    for (const m of headToHead(league, 4)) {
      const back = headToHead(league, m.rival.id).find((x) => x.rival.id === 4);
      expect(back).toMatchObject({ above: m.below, below: m.above });
    }
  });

  it('lists the most frequent rivals first and never the player', () => {
    const list = headToHead(league, 4);
    expect(list.some((m) => m.rival.id === 4)).toBe(false);
    const totals = list.map((m) => m.above + m.below);
    expect(totals).toEqual([...totals].sort((a, b) => b - a));
  });
});
