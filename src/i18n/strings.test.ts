import { describe, expect, it } from 'vitest';
import { defaultLanguage, STRINGS } from './strings';

function shape(value: unknown): unknown {
  if (typeof value === 'function') return 'function';
  if (typeof value === 'object' && value !== null)
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  return typeof value;
}

describe('strings', () => {
  it('English has exactly the keys Hebrew has, of the same kind', () => {
    expect(shape(STRINGS.en)).toEqual(shape(STRINGS.he));
  });

  it('no text is left empty', () => {
    const walk = (v: unknown): string[] =>
      typeof v === 'string'
        ? [v]
        : typeof v === 'object' && v
          ? Object.values(v).flatMap(walk)
          : [];
    for (const lang of [STRINGS.he, STRINGS.en])
      expect(walk(lang).every((s) => s.trim())).toBe(true);
  });

  it('picks Hebrew for Hebrew browsers and Israeli clocks', () => {
    expect(defaultLanguage(['he-IL', 'en'])).toBe('he');
    expect(defaultLanguage(['en-US'], 'Asia/Jerusalem')).toBe('he');
    expect(defaultLanguage(['en-US'], 'Europe/London')).toBe('en');
  });
});
