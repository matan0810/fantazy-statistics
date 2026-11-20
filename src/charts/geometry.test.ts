import { describe, expect, it } from 'vitest';
import type { RankPoint } from '../domain/stats';
import { indexAt, labelStep, linePaths, xOf, yOf, type Frame } from './geometry';

const frame: Frame = {
  width: 400,
  height: 200,
  padTop: 0,
  padBottom: 0,
  padStart: 0,
  padEnd: 0,
  maxRank: 5,
  view: { from: 0, to: 4 },
};
const pt = (index: number, rank: number) => ({ index, rank }) as RankPoint;

describe('chart geometry', () => {
  it('runs time left to right and puts first place at the top', () => {
    expect(xOf(frame, 0)).toBe(0);
    expect(xOf(frame, 4)).toBe(400);
    expect(yOf(frame, 1)).toBe(0);
    expect(yOf(frame, 5)).toBe(200);
  });

  it('follows the zoomed view, and indexAt inverts xOf', () => {
    const zoomed = { ...frame, view: { from: 1, to: 3 } };
    expect(xOf(zoomed, 1)).toBe(0);
    expect(xOf(zoomed, 3)).toBe(400);
    expect(indexAt(zoomed, 200)).toBe(2);
  });

  it('draws consecutive seasons as one curve and bridges a missed season', () => {
    const { solid, bridges } = linePaths(frame, [pt(0, 1), pt(1, 2), pt(3, 1), pt(4, 3)]);
    expect(solid).toHaveLength(2);
    expect(bridges).toHaveLength(1);
    expect(solid[0]?.startsWith('M0,0C')).toBe(true);
  });

  it('draws nothing solid for a single season', () => {
    expect(linePaths(frame, [pt(2, 3)]).solid).toEqual([]);
  });

  it('thins the season labels when they would crowd', () => {
    expect(labelStep(1000, 10)).toBe(1);
    expect(labelStep(300, 10)).toBe(3);
  });
});
