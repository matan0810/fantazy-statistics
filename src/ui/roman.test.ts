import { describe, expect, it } from 'vitest';
import { roman } from './roman';

describe('roman', () => {
  it('writes the podium places', () => {
    expect([1, 2, 3].map((p) => roman(p as 1 | 2 | 3))).toEqual(['I', 'II', 'III']);
  });
});
