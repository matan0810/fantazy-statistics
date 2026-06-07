// Placeholder team names used in old records where the real name was lost
// (e.g. "???", "אין"). Treated as "missing" so the UI can show a gentle note
// instead of the raw placeholder text.
const PLACEHOLDERS = new Set(["???", "ללא", "-", "—", "–"]);

export function isLostName(name) {
  if (!name) return true;
  const trimmed = String(name).trim();
  if (!trimmed) return true;
  if (PLACEHOLDERS.has(trimmed)) return true;
  return /^[?\-–—\s]+$/.test(trimmed);
}

// Champions League (1) and Ligat HaAl (4) run across two calendar years; the
// stored year is the END year (e.g. 2026 = the 25/26 season). Summer
// tournaments (Mondial, Euro) stay a single year.
const TWO_YEAR_TYPES = new Set([1, 4]);

export function formatSeasonYear(year, type) {
  if (year == null) return "";
  if (!TWO_YEAR_TYPES.has(type)) return String(year);
  const a = String((year - 1) % 100).padStart(2, "0");
  const b = String(year % 100).padStart(2, "0");
  return `${a}/${b}`;
}
