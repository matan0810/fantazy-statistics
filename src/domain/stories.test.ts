import { describe, expect, it } from 'vitest';
import { league } from './league';
import { stories } from './stories';

const s = stories(league, new Set(['ucl', 'world-cup', 'euro']));

describe('stories, on the real data', () => {
  it('finds the most third places', () => {
    expect(s.mostThirds).toMatchObject({ value: 6, player: { id: 2 } });
  });

  it('finds the title lost by the fewest points, with its champion', () => {
    expect(s.heartbreak).toMatchObject({
      value: 0,
      placing: { player: { id: 1 }, season: { id: 4 } },
      champion: { player: { id: 4 } },
    });
  });

  it('finds the best season of someone who did not win it', () => {
    expect(s.bestWithoutTitle).toMatchObject({
      value: 31.8,
      placing: {
        player: { id: 2 },
        result: { rank: 2 },
        season: { competition: 'ucl', year: 2020 },
      },
    });
  });

  it('finds the steadiest over five seasons or more', () => {
    expect(s.steadiest).toMatchObject({ player: { id: 8 }, seasons: 5, value: 0.5 });
  });

  it('counts finishes above the reigning champion, fewer seasons first on a tie', () => {
    expect(s.aboveChampion).toMatchObject({ value: 6, player: { id: 1 } });
  });

  it('reads the current form from the last four seasons, tournaments after club seasons', () => {
    expect(s.form).toMatchObject({ player: { id: 4 }, value: 1.8, played: 4, of: 4 });
  });

  it('finds the longest wait for a first title, the later on a tie', () => {
    expect(s.longestWait).toMatchObject({
      value: 4,
      placing: { player: { id: 5 }, season: { competition: 'euro', year: 2020 } },
    });
  });

  it('finds the team name kept longest', () => {
    expect(s.loyalName).toMatchObject({ player: { id: 6 }, team: 'ריאל קוסקוס', value: 3 });
  });

  it('says nothing about no competitions', () => {
    expect(Object.values(stories(league, new Set()))).toEqual(Array(8).fill(undefined));
  });
});
