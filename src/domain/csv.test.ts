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
