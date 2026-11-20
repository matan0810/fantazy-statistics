import { describe, expect, it } from 'vitest';
import { clampView, fullView, isZoomed, panView, zoomView } from './zoom';

describe('zoom', () => {
  it('starts on the whole axis', () => {
    expect(fullView(11)).toEqual({ from: 0, to: 10 });
    expect(isZoomed(fullView(11), 11)).toBe(false);
  });

  it('zooms in around the anchor, which stays in place', () => {
    const v = zoomView(fullView(11), 0.5, 5, 11);
    expect(v).toEqual({ from: 2.5, to: 7.5 });
    expect(isZoomed(v, 11)).toBe(true);
  });

  it('never shows fewer than three seasons or more than the axis', () => {
    expect(zoomView({ from: 4, to: 6 }, 0.1, 5, 11)).toEqual({ from: 4, to: 6 });
    expect(zoomView({ from: 2, to: 8 }, 10, 5, 11)).toEqual({ from: 0, to: 10 });
  });

  it('pans and stops at either end', () => {
    expect(panView({ from: 2, to: 5 }, 3, 11)).toEqual({ from: 5, to: 8 });
    expect(panView({ from: 2, to: 5 }, 30, 11)).toEqual({ from: 7, to: 10 });
    expect(panView({ from: 2, to: 5 }, -30, 11)).toEqual({ from: 0, to: 3 });
  });

  it('copes with very short competitions', () => {
    expect(clampView({ from: 0, to: 5 }, 2)).toEqual({ from: 0, to: 1 });
    expect(fullView(1)).toEqual({ from: 0, to: 0 });
  });
});
