import { describe, expect, it } from 'vitest';
import { readStored } from './storage';

const whole = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) ? v : undefined);

describe('reading saved values', () => {
  it('returns a value that passes its check', () => {
    expect(readStored('12', null, whole)).toBe(12);
  });

  it('falls back on nothing saved, broken JSON or the wrong shape', () => {
    expect(readStored(null, null, whole)).toBeNull();
    expect(readStored('{oops', null, whole)).toBeNull();
    expect(readStored('"12"', null, whole)).toBeNull();
    expect(readStored('{"__proto__":{"x":1}}', null, whole)).toBeNull();
    expect(readStored('1.5', 7, whole)).toBe(7);
  });
});
