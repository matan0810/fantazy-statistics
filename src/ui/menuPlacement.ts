/** Room kept between an open menu and the edge of the screen, in pixels. */
export const EDGE = 12;

/**
 * How far to move a box sideways so it lies on a screen `width` wide, with `EDGE` to spare
 * on each side. A box wider than the screen keeps its start on screen.
 */
export function shiftIntoView(left: number, right: number, width: number): number {
  if (right > width - EDGE) {
    const shift = width - EDGE - right;
    return left + shift < EDGE ? EDGE - left : shift;
  }
  return left < EDGE ? EDGE - left : 0;
}
