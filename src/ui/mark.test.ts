import { describe, expect, it } from 'vitest';
import { WREATH, branch } from './mark';

describe('the wreath', () => {
  it('has two mirrored branches of eight pairs of leaves', () => {
    expect(WREATH).toHaveLength(2);
    for (const b of WREATH) expect(b.leaves).toHaveLength(16);
    const [left, right] = WREATH;
    left?.leaves.forEach((leaf, i) => {
      const mirror = right?.leaves[i];
      expect(mirror && Math.abs(leaf.x + mirror.x - 100)).toBeLessThan(0.01);
      expect(mirror && Math.abs(leaf.y - mirror.y)).toBeLessThan(0.01);
    });
  });

  it('stays inside its box', () => {
    for (const leaf of WREATH.flatMap((b) => b.leaves)) {
      expect(leaf.x).toBeGreaterThan(0);
      expect(leaf.x).toBeLessThan(100);
      expect(leaf.y).toBeGreaterThan(0);
      expect(leaf.y).toBeLessThan(100);
    }
  });

  it('draws its stem as an arc', () => {
    expect(branch(50, 50, 40, 90, 180, 3).stem).toMatch(
      /^M50\.00 90\.00 A40 40 0 0 1 10\.00 50\.00$/,
    );
  });
});
