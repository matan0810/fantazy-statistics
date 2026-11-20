import type { League } from './types';

export type Route =
  | { name: 'home' }
  | { name: 'season'; id: number }
  | { name: 'player'; id: number }
  | { name: 'records' };

/**
 * Every screen has its own address in the hash, so it can be shared and survives a
 * reload. Unknown addresses fall back to home. `#/stats` is the old address of records.
 */
export function parseRoute(hash: string, league: League): Route {
  const [name, rawId] = hash.replace(/^#\/?/, '').split(/[/?]/);
  const id = Number(rawId);
  if (name === 'season' && league.seasons.some((s) => s.id === id)) return { name, id };
  if (name === 'player' && league.players.some((p) => p.id === id)) return { name, id };
  if (name === 'records' || name === 'stats') return { name: 'records' };
  return { name: 'home' };
}

export function routeHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'records':
      return '#/records';
    case 'season':
      return `#/season/${route.id}`;
    case 'player':
      return `#/player/${route.id}`;
  }
}
