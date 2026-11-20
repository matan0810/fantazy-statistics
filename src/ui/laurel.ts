/**
 * Leaves of one laurel branch, along the left side of a circle, from near the bottom to
 * near the top. The right branch is the same branch mirrored. Each leaf is placed on the
 * arc, turned along it and tilted alternately out and in, which is what reads as laurel.
 */
export interface Leaf {
  x: number;
  y: number;
  /** Degrees, for an SVG rotate(). */
  angle: number;
  scale: number;
}

export function laurelBranch(center: number, radius: number, count: number): Leaf[] {
  const start = 0.42; // radians from the bottom of the circle
  const end = 2.55; // stop short of the top, leaving the crown open
  return Array.from({ length: count }, (_, i) => {
    const t = start + ((end - start) * i) / Math.max(1, count - 1);
    const outward = i % 2 === 0 ? 1 : -1;
    const x = center - radius * Math.sin(t) - outward * 4 * Math.sin(t);
    const y = center + radius * Math.cos(t) + outward * 4 * Math.cos(t);
    // direction of travel up the arc
    const tangent = (Math.atan2(-Math.sin(t), -Math.cos(t)) * 180) / Math.PI;
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      angle: Math.round(tangent - outward * 28),
      // leaves taper toward the tip of the branch
      scale: Math.round((1.08 - (0.38 * i) / Math.max(1, count - 1)) * 100) / 100,
    };
  });
}
