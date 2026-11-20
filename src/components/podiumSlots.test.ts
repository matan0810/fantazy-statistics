import { describe, expect, it } from 'vitest';
import { podiumSlots, PODIUM_HEIGHT } from './podiumSlots';

describe('podiumSlots', () => {
  it('builds second, first, third from left to right', () => {
    const slots = podiumSlots([
      { place: 1 as const },
      { place: 2 as const },
      { place: 3 as const },
    ]);
    expect(slots.map((s) => s.place)).toEqual([2, 1, 3]);
  });

  it('keeps an empty block for a missing place', () => {
    const slots = podiumSlots([{ place: 1 as const }]);
    expect(slots.map((s) => s.entry === undefined)).toEqual([true, false, true]);
  });

  it('makes first the tallest, third the shortest', () => {
    expect(PODIUM_HEIGHT[1]).toBeGreaterThan(PODIUM_HEIGHT[2]);
    expect(PODIUM_HEIGHT[2]).toBeGreaterThan(PODIUM_HEIGHT[3]);
  });
});
