/** Excel-friendly CSV: a UTF-8 BOM (so Hebrew opens correctly), CRLF and quoted cells. */
export function toCsv(
  headers: readonly string[],
  rows: readonly (readonly (string | number | null)[])[],
): string {
  const cell = (v: string | number | null) => {
    if (v === null) return '';
    const s = String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + [headers, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
}
