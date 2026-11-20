import type { RankPoint } from '../domain/stats';

export interface Frame {
  width: number;
  height: number;
  padTop: number;
  padBottom: number;
  padStart: number;
  padEnd: number;
  columns: number;
  maxRank: number;
  /** Time runs right to left in Hebrew. */
  rtl: boolean;
}

export function xOf(f: Frame, index: number): number {
  const inner = f.width - f.padStart - f.padEnd;
  const x = f.columns <= 1 ? inner / 2 : (index * inner) / (f.columns - 1);
  const fromLeft = f.padStart + x;
  return f.rtl ? f.width - fromLeft : fromLeft;
}

export function yOf(f: Frame, rank: number): number {
  const inner = f.height - f.padTop - f.padBottom;
  return f.padTop + (f.maxRank <= 1 ? 0 : ((rank - 1) * inner) / (f.maxRank - 1));
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

/** Which season labels fit: all of them, or every other one on a narrow chart. */
export function labelStep(width: number, columns: number): number {
  const room = columns > 1 ? width / (columns - 1) : width;
  return room < 34 ? 3 : room < 52 ? 2 : 1;
}
