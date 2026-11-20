export type Place = 1 | 2 | 3;

/** Left to right, as a podium is built: second, first, third. */
export const PODIUM_ORDER: readonly Place[] = [2, 1, 3];

/** Block height for each place, as a share of the first place's block. */
export const PODIUM_HEIGHT: Record<Place, number> = { 1: 1, 2: 0.7, 3: 0.52 };

/**
 * The three slots of a podium in build order, each with its entry or undefined. A missing
 * place still gets its (empty) block, so the podium keeps its shape in short seasons.
 */
export function podiumSlots<T extends { place: Place }>(
  entries: readonly T[],
): { place: Place; entry: T | undefined }[] {
  return PODIUM_ORDER.map((place) => ({ place, entry: entries.find((e) => e.place === place) }));
}
