import { describe, expect, it } from 'vitest';
import { fileName } from './download';

describe('file names', () => {
  it('keeps the title readable', () => {
    expect(fileName('ליגת האלופות 25/26 · טבלה סופית', 'csv')).toBe(
      'ליגת_האלופות_2526_·_טבלה_סופית.csv',
    );
  });

  it('cannot climb folders or hide the extension', () => {
    expect(fileName('../../etc/passwd', 'csv')).toBe('etcpasswd.csv');
    expect(fileName('photo‮gnp.exe', 'png')).toBe('photognp.exe.png');
    expect(fileName('a\u0000b\nc', 'csv')).toBe('abc.csv');
  });

  it('never leaves an empty or hidden name', () => {
    expect(fileName('???', 'png')).toBe('file.png');
    expect(fileName('.hidden', 'png')).toBe('hidden.png');
  });

  it('keeps names short', () => {
    expect(fileName('x'.repeat(200), 'csv')).toHaveLength(84);
  });
});
