/**
 * Excel-friendly CSV: a UTF-8 BOM (so Hebrew opens correctly), CRLF and quoted cells.
 *
 * A text cell that starts like a formula (`=`, `+`, `-`, `@`, a tab or a carriage return)
 * gets a leading apostrophe, so a spreadsheet shows it as text instead of running it
 * ("CSV injection"). Numbers are written as numbers.
 */
export function toCsv(
  headers: readonly string[],
  rows: readonly (readonly (string | number | null)[])[],
): string {
  const cell = (v: string | number | null) => {
    if (v === null) return '';
    const s = typeof v === 'number' ? String(v) : /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + [headers, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
}
