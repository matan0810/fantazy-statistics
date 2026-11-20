import { describe, expect, it } from 'vitest';
import { league } from './league';
import { parseRoute, routeHash, type Route } from './routes';

describe('routes', () => {
  it.each<[string, Route]>([
    ['', { name: 'home' }],
    ['#/', { name: 'home' }],
    ['#/season/12', { name: 'season', id: 12 }],
    ['#/player/4', { name: 'player', id: 4 }],
    ['#/player/4/euro', { name: 'player', id: 4, competition: 'euro' }],
    ['#/player/4/nba', { name: 'player', id: 4 }],
    ['#/records', { name: 'records' }],
    ['#/stats', { name: 'records' }],
    ['#/season/999', { name: 'home' }],
    ['#/player/abc', { name: 'home' }],
    ['#/nowhere', { name: 'home' }],
  ])('%s', (hash, route) => {
    expect(parseRoute(hash, league)).toEqual(route);
  });

  it('round-trips every route', () => {
    const all: Route[] = [
      { name: 'home' },
      { name: 'records' },
      { name: 'season', id: 1 },
      { name: 'player', id: 9 },
      { name: 'player', id: 9, competition: 'ligat-haal' },
    ];
    for (const r of all) expect(parseRoute(routeHash(r), league)).toEqual(r);
  });
});
