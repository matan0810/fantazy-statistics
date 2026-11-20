import { describe, expect, it } from 'vitest';
import { entryOf, withEntry } from './historyEntry';

describe('history entry id', () => {
  it('reads only a string id', () => {
    expect(entryOf({ entry: 'a.1' })).toBe('a.1');
    expect(entryOf({ entry: 3 })).toBeNull();
    expect(entryOf(null)).toBeNull();
    expect(entryOf('entry')).toBeNull();
  });

  it('keeps what else the state holds', () => {
    expect(withEntry({ other: 1 }, 'b.2')).toEqual({ other: 1, entry: 'b.2' });
    expect(withEntry(null, 'c.3')).toEqual({ entry: 'c.3' });
  });
});
