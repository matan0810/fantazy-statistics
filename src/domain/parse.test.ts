import { describe, expect, it } from 'vitest';
import { league } from './league';
import { parseLeague } from './parse';

type Rec = Record<string, unknown>;
interface Raw {
  players: Rec[];
  seasons: Rec[];
  results: Rec[];
  proofs: Rec;
}

const base = (): Raw => ({
  players: [
    { id: 1, name: { he: 'א', en: 'A' }, color: '#112233' },
    { id: 2, name: { he: 'ב', en: 'B' }, color: '#445566' },
  ],
  seasons: [{ id: 1, competition: 'ucl', year: 2020 }],
  results: [
    { season: 1, player: 1, rank: 1, points: 10, team: 'T', coach: null },
    { season: 1, player: 2, rank: 2, points: 8, team: null, coach: null },
  ],
  proofs: { '1': ['/proofs/x.png'] },
});

/** The i-th record of a list, which the test data always has. */
const at = (list: Rec[], i: number): Rec => {
  const item = list[i];
  if (!item) throw new Error(`no record ${i}`);
  return item;
};

describe('parseLeague', () => {
  it('accepts the data the site is built with', () => {
    expect(league.players).toHaveLength(9);
    expect(league.seasons).toHaveLength(23);
    expect(league.results).toHaveLength(101);
    expect(league.proofs.get(22)?.length).toBeGreaterThan(0);
  });

  it('accepts a small valid league', () => {
    expect(parseLeague(base()).results).toHaveLength(2);
  });

  const broken: [string, (raw: Raw) => void][] = [
    ['an unknown competition', (r) => void (at(r.seasons, 0).competition = 'nba')],
    ['a duplicate rank', (r) => void (at(r.results, 1).rank = 1)],
    ['a player twice in a season', (r) => void (at(r.results, 1).player = 1)],
    ['an unknown player', (r) => void (at(r.results, 1).player = 9)],
    ['points out of rank order', (r) => void (at(r.results, 1).points = 11)],
    ['points on a season marked lost', (r) => void (at(r.seasons, 0).pointsLost = true)],
    ['a bad colour', (r) => void (at(r.players, 0).color = 'red')],
    ['a proof outside /proofs/', (r) => void (r.proofs['1'] = ['https://x'])],
    ['a blank team name', (r) => void (at(r.results, 0).team = '  ')],
  ];

  it.each(broken)('rejects %s', (_, breakIt) => {
    const raw = base();
    breakIt(raw);
    expect(() => parseLeague(raw)).toThrow(/Invalid data/);
  });
});
