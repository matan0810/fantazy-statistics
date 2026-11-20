const NUMERALS = ['I', 'II', 'III'] as const;

/** Places on a podium are written in Roman numerals, as on a monument. */
export function roman(place: 1 | 2 | 3): string {
  return NUMERALS[place - 1] ?? String(place);
}
