import { describe, expect, it } from 'vitest';
import { shiftIntoView } from './menuPlacement';

describe('keeping a menu on screen', () => {
  it('leaves a menu that fits where it is', () => {
    expect(shiftIntoView(40, 300, 390)).toBe(0);
  });

  it('moves a menu back from either edge', () => {
    expect(shiftIntoView(173, 433, 390)).toBe(-55);
    expect(shiftIntoView(-80, 180, 390)).toBe(92);
  });

  it('keeps the start of a menu wider than the screen on screen', () => {
    expect(shiftIntoView(0, 500, 390)).toBe(12);
  });
});
