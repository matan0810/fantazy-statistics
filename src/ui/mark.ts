/**
 * The site's mark, drawn once and used everywhere: the header, the home page's emblem,
 * the app icons and the favicon (scripts/icons.ts writes those from these same shapes).
 * Coordinates are in a 100 × 100 box.
 */

/** The solid trophy: cup, stem, foot and plinth are filled; the handles are strokes. */
export const TROPHY = {
  body: 'M30 16 H70 V34 C70 50 61 58 50 58 C39 58 30 50 30 34 Z M46 57 H54 V68 H46Z M38 68 H62 L65 78 H35Z M30 81 H70 V86 H30Z',
  handles:
    'M30 21 H23 C17 21 16 28 18 33 C20 39 26 43 33 45 M70 21 H77 C83 21 84 28 82 33 C80 39 74 43 67 45',
  /** A dark sheen down the cup, so the solid shape still reads as metal. */
  sheen: 'M37 22 V33 C37 41 40 47 45 50',
};

export interface Leaf {
  x: number;
  y: number;
  /** Degrees. */
  rotate: number;
  scale: number;
}

const LEAF_PATH = 'M0 0 Q4 -2.6 9 0 Q4 2.6 0 0Z';
export { LEAF_PATH };

/**
 * The leaves of one branch of the wreath: pairs along an arc from `from` to `to` degrees,
 * angled off the stem and growing smaller towards the tip.
 */
export function branch(
  cx: number,
  cy: number,
  r: number,
  from: number,
  to: number,
  pairs: number,
): { leaves: Leaf[]; stem: string } {
  const step = (to - from) / (pairs - 1);
  const leaves: Leaf[] = [];
  for (let i = 0; i < pairs; i++) {
    const deg = from + step * i;
    const a = (deg * Math.PI) / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    const along = deg + (step > 0 ? 90 : -90);
    const scale = 1.05 * (0.75 + 0.25 * (1 - i / pairs));
    for (const side of [-1, 1]) leaves.push({ x, y, rotate: along + side * 38, scale });
  }
  const point = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  };
  const stem = `M${point(from)} A${r} ${r} 0 0 ${step > 0 ? 1 : 0} ${point(to)}`;
  return { leaves, stem };
}

/** The two branches of the laurel wreath that frames the trophy in the emblem. */
export const WREATH = [branch(50, 50, 41, 105, 215, 8), branch(50, 50, 41, 75, -35, 8)];
/** Where the two branches meet at the bottom: a small tie. */
export const WREATH_TIE = 'M44 92 L50 88 L56 92';
