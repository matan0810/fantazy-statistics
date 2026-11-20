import { describe, expect, it } from 'vitest';
import { feats } from './feats';
import { league } from './league';
import { ALL_COMPETITIONS } from './stats';

const WITHOUT_LIGAT = new Set(['ucl', 'world-cup', 'euro'] as const);

describe('feats, on the real data', () => {
  const f = feats(league, WITHOUT_LIGAT);

  it('finds the eternal runner-up', () => {
    expect(f.mostSeconds).toMatchObject({ value: 5, player: { id: 1 } });
  });

  it('finds the biggest leap between two seasons of a competition', () => {
    expect(f.biggestLeap).toMatchObject({
      value: 4,
      from: 5,
      placing: { player: { id: 5 }, season: { competition: 'euro', year: 2020 } },
    });
  });

  it('finds the most even of the frequent pairs', () => {
    expect(f.rivalry).toMatchObject({ leader: { id: 1 }, rival: { id: 2 }, wins: 8, losses: 7 });
  });

  it('has nothing to say about no competitions', () => {
    expect(feats(league, new Set())).toEqual({
      mostSeconds: undefined,
      biggestLeap: undefined,
      rivalry: undefined,
    });
  });

  it('works on every competition', () => {
    expect(feats(league, ALL_COMPETITIONS).rivalry).toBeDefined();
  });
});
