import { describe, expect, it } from 'vitest';
import { headToHead } from './headToHead';
import { league } from './league';
import { tournamentTable } from './tournaments';

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

describe('tournament table', () => {
  const table = tournamentTable(league);

  it('counts only World Cups and Euros', () => {
    const tournaments = league.seasons.filter(
      (s) => s.competition === 'world-cup' || s.competition === 'euro',
    ).length;
    expect(Math.max(...table.map((r) => r.tournaments))).toBeLessThanOrEqual(tournaments);
    expect(table.reduce((a, r) => a + r.titles, 0)).toBe(tournaments);
  });

  it('ranks by place relative to the field', () => {
    expect(table[0]).toMatchObject({ player: { id: 4 } });
    expect(table.every((r) => r.podiums >= r.titles && r.average >= 1)).toBe(true);
  });
});
