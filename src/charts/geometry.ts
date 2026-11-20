import type { RankPoint } from '../domain/stats';
import type { View } from './zoom';

/**
 * The plot area. Time always runs left to right, as on any chart, in Hebrew too; the
 * visible stretch of seasons is `view`, so the chart can be zoomed and panned.
 */
export interface Frame {
  width: number;
  height: number;
  padTop: number;
  padBottom: number;
  padStart: number;
  padEnd: number;
  maxRank: number;
  view: View;
}

const inner = (f: Frame) => f.width - f.padStart - f.padEnd;

export function xOf(f: Frame, index: number): number {
  const span = f.view.to - f.view.from;
  if (span <= 0) return f.padStart + inner(f) / 2;
  return f.padStart + ((index - f.view.from) * inner(f)) / span;
}

/** The season position under an x coordinate: the inverse of xOf. */
export function indexAt(f: Frame, x: number): number {
  const w = inner(f) || 1;
  return f.view.from + ((x - f.padStart) / w) * (f.view.to - f.view.from);
}

export function yOf(f: Frame, rank: number): number {
  const h = f.height - f.padTop - f.padBottom;
  return f.padTop + (f.maxRank <= 1 ? 0 : ((rank - 1) * h) / (f.maxRank - 1));
}

/**
 * Splits a player's points into runs of consecutive seasons, each drawn as a smooth
 * curve (level tangents at every point, the usual bump-chart shape). Seasons the player
 * missed leave a gap, bridged by a separate faint path.
 */
export function linePaths(
  f: Frame,
  points: readonly RankPoint[],
): { solid: string[]; bridges: string[] } {
  const solid: string[] = [];
  const bridges: string[] = [];
  let current = '';
  points.forEach((p, i) => {
    const x = xOf(f, p.index);
    const y = yOf(f, p.rank);
    const prev = points[i - 1];
    if (!prev) {
      current = `M${x},${y}`;
      return;
    }
    const px = xOf(f, prev.index);
    const py = yOf(f, prev.rank);
    const mid = (px + x) / 2;
    const curve = `C${mid},${py} ${mid},${y} ${x},${y}`;
    if (p.index - prev.index === 1) {
      current += curve;
    } else {
      if (current.includes('C')) solid.push(current);
      bridges.push(`M${px},${py}${curve}`);
      current = `M${x},${y}`;
    }
  });
  if (current.includes('C')) solid.push(current);
  return { solid, bridges };
}

/** Every how many seasons a label fits: 1, 2 or 3, by the room per visible season. */
export function labelStep(width: number, visibleSpan: number): number {
  const room = visibleSpan > 0 ? width / visibleSpan : width;
  return room < 34 ? 3 : room < 52 ? 2 : 1;
}
