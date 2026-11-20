import { describe, expect, it } from 'vitest';
import { league } from './league';
import {
  career,
  champions,
  medalTable,
  playerById,
  rankChart,
  records,
  seasonById,
  standings,
  summarize,
} from './stats';
import type { CompetitionId } from './types';

const season = (id: number) => {
  const s = seasonById(league, id);
  if (!s) throw new Error(`no season ${id}`);
  return s;
};
const player = (id: number) => {
  const p = playerById(league, id);
  if (!p) throw new Error(`no player ${id}`);
  return p;
};
const WITHOUT_LIGAT = new Set<CompetitionId>(['ucl', 'world-cup', 'euro']);

describe('standings and summaries', () => {
  it('orders a season by rank with the gap to first', () => {
    const table = standings(league, season(4));
    expect(table.map((p) => p.result.rank)).toEqual([1, 2, 3, 4]);
    expect(table.map((p) => p.gap)).toEqual([null, 0, 52, 59]);
  });

  it('puts an unknown rank last and has no gaps when points were lost', () => {
    const table = standings(league, season(17));
    expect(table.at(-1)?.result.rank).toBeNull();
    expect(table.every((p) => p.gap === null)).toBe(true);
  });

  it('summarises the champion, the title margin and the average', () => {
    const s = summarize(league, season(22));
    expect(s.champion?.player.name.en).toBe('Gabi');
    expect(s.margin).toBe(17);
    expect(s.average).toBe(Math.round((876 + 859 + 799 + 743 + 528 + 292) / 6));
    expect(summarize(league, season(3)).margin).toBeNull();
  });
});

describe('careers and the medal table', () => {
  it('counts medals across every competition', () => {
    const matan = career(league, player(4));
    expect([matan.titles, matan.podiums, matan.appearances]).toEqual([11, 21, 23]);
    expect(matan.history[0]?.season.year).toBe(2026);
  });

  it('respects the competition filter', () => {
    const table = medalTable(league, WITHOUT_LIGAT);
    expect(table[0]?.player.name.en).toBe('Matan');
    expect(table[0]?.titles).toBe(9);
    expect(table[1]?.titles).toBe(4);
    expect(table.every((c) => c.byCompetition.every((cc) => cc.competition !== 'ligat-haal'))).toBe(
      true,
    );
  });

  it('averages only seasons with known points', () => {
    const ucl = career(league, player(4)).byCompetition.find((c) => c.competition === 'ucl');
    expect(ucl?.appearances).toBe(11);
    expect(ucl?.scoredSeasons).toBe(10);
  });
});

describe('records', () => {
  it('finds the all-time leaders', () => {
    const r = records(league);
    expect(r.mostTitles).toMatchObject({ value: 11, player: { id: 4 } });
    expect(r.mostPodiums).toMatchObject({ value: 21, player: { id: 4 } });
  });

  it('finds the longest run of titles in one competition', () => {
    expect(records(league).longestStreak).toMatchObject({
      value: 4,
      competition: 'ligat-haal',
      player: { id: 2 },
    });
    expect(records(league, WITHOUT_LIGAT).longestStreak).toMatchObject({
      value: 3,
      competition: 'ucl',
      player: { id: 4 },
    });
  });

  it('finds the closest and the most one-sided title', () => {
    const r = records(league, WITHOUT_LIGAT);
    expect(r.closestTitle).toMatchObject({ value: 0, placing: { season: { id: 4 } } });
    expect(r.biggestWin).toMatchObject({ value: 15.5, placing: { season: { id: 20 } } });
  });

  it('keeps one high score per competition', () => {
    const r = records(league);
    expect(r.highScores.map((h) => h.placing.season.competition)).toEqual([
      'ucl',
      'world-cup',
      'euro',
      'ligat-haal',
    ]);
    expect(r.highScores[0]?.value).toBe(928);
  });
});

describe('champions and rank chart', () => {
  it('lists champions newest first', () => {
    expect(champions(league, 'ucl').map((c) => c.champion.player.id)).toEqual([
      1, 2, 4, 4, 1, 4, 4, 1, 4, 4, 4,
    ]);
  });

  it('draws one line per player through the seasons, oldest first', () => {
    const chart = rankChart(league, 'ucl');
    expect(chart.seasons.map((s) => s.year)).toEqual([
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
    ]);
    expect(chart.maxRank).toBe(6);
    expect(chart.lines[0]?.player.id).toBe(4);
    for (const line of chart.lines) {
      const idx = line.points.map((p) => p.index);
      expect(idx).toEqual([...idx].sort((a, b) => a - b));
    }
  });
});
