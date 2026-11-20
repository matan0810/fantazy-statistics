/**
 * Reads a value saved in `localStorage`. Anything stored there may have been written by an
 * older release, edited by hand or by another page on the same origin (every project of
 * this GitHub account shares matan0810.github.io), so it is parsed and checked, never cast.
 */
export function readStored<T>(
  raw: string | null,
  fallback: T,
  parse: (value: unknown) => T | undefined,
): T {
  if (raw === null) return fallback;
  try {
    return parse(JSON.parse(raw)) ?? fallback;
  } catch {
    return fallback;
  }
}
