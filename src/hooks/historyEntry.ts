/** The id the site keeps in a history entry's state, without disturbing anything else there. */
export function entryOf(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('entry' in state)) return null;
  return typeof state.entry === 'string' ? state.entry : null;
}

export function withEntry(state: unknown, entry: string): Record<string, unknown> {
  return typeof state === 'object' && state !== null ? { ...state, entry } : { entry };
}
