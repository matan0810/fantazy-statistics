import { describe, expect, it } from 'vitest';
import { toCsv } from './csv';

describe('toCsv', () => {
  it('starts with a BOM and quotes only what needs it', () => {
    const csv = toCsv(
      ['a', 'b'],
      [
        ['x, y', 'say "hi"'],
        [1, null],
      ],
    );
    expect(csv).toBe('﻿a,b\r\n"x, y","say ""hi"""\r\n1,');
  });
});

describe('toCsv and formulas', () => {
  it('turns text that a spreadsheet would run into plain text', () => {
    const csv = toCsv(
      ['team'],
      [['=HYPERLINK("http://x","y")'], ['+1'], ['-2+3'], ['@SUM(A1)'], ['\tcmd']],
    );
    expect(csv.split('\r\n').slice(1)).toEqual([
      `"'=HYPERLINK(""http://x"",""y"")"`,
      "'+1",
      "'-2+3",
      "'@SUM(A1)",
      "'\tcmd",
    ]);
  });

  it('leaves numbers, negative ones included, as numbers', () => {
    expect(toCsv(['gap'], [[-17], [0]])).toBe('﻿gap\r\n-17\r\n0');
  });

  it('leaves ordinary names alone', () => {
    expect(toCsv(['team'], [['FC agvaniya'], ['מסיבמבה']])).toBe('﻿team\r\nFC agvaniya\r\nמסיבמבה');
  });
});
