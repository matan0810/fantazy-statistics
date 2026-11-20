/**
 * The visible stretch of the time axis, in season positions (0 = the oldest season).
 * Fractions are allowed, so zooming and panning move smoothly between seasons.
 */
export interface View {
  from: number;
  to: number;
}

/** The narrowest view: three seasons. */
export const MIN_SPAN = 2;

export function fullView(columns: number): View {
  return { from: 0, to: Math.max(0, columns - 1) };
}

/** Keeps a view inside the axis and no narrower than MIN_SPAN. */
export function clampView(view: View, columns: number): View {
  const last = Math.max(0, columns - 1);
  const span = Math.min(Math.max(view.to - view.from, Math.min(MIN_SPAN, last)), last);
  const from = Math.min(Math.max(view.from, 0), last - span);
  return { from, to: from + span };
}

/**
 * Zooms by `factor` (below 1 zooms in) keeping `anchor`, a season position, at the
 * same place on screen: under the pointer, or between the fingers.
 */
export function zoomView(view: View, factor: number, anchor: number, columns: number): View {
  const span = view.to - view.from || 1;
  const t = (anchor - view.from) / span;
  // limit the span first, so the anchor stays put even at the deepest zoom
  const last = Math.max(0, columns - 1);
  const next = Math.min(Math.max(span * factor, Math.min(MIN_SPAN, last)), last);
  const from = anchor - t * next;
  return clampView({ from, to: from + next }, columns);
}

export function panView(view: View, delta: number, columns: number): View {
  return clampView({ from: view.from + delta, to: view.to + delta }, columns);
}

export function isZoomed(view: View, columns: number): boolean {
  return view.from > 0.001 || view.to < columns - 1 - 0.001;
}
