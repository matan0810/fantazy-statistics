import { describe, expect, it } from 'vitest';
import { laurelBranch } from './laurel';

describe('laurelBranch', () => {
  const leaves = laurelBranch(100, 70, 9);

  it('climbs the left side from the bottom toward the top', () => {
    expect(leaves).toHaveLength(9);
    const first = leaves[0];
    const last = leaves.at(-1);
    expect(first && last && first.y > last.y).toBe(true);
    expect(leaves.every((l) => l.x < 100)).toBe(true);
  });

  it('alternates the tilt and tapers toward the tip', () => {
    const [a, b] = leaves;
    expect(a && b && a.angle !== b.angle).toBe(true);
    expect(leaves.map((l) => l.scale)).toEqual(
      [...leaves.map((l) => l.scale)].sort((x, y) => y - x),
    );
  });
});
