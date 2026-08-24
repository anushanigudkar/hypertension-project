// Pure local-date-key helper for day-based progress tracking (B1's jar,
// B3's focused week). Uses the browser's local calendar date, not UTC —
// otherwise "today" could flip at the wrong moment for the user's timezone.
export function dateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(base: Date, months: number): Date {
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return next;
}

// dateKey strings are always "YYYY-MM-DD", so lexicographic comparison
// already matches chronological order — this just gives that comparison a
// readable name at call sites instead of a bare string `<=`/`<`.
export function isDateKeyOnOrBefore(a: string, b: string): boolean {
  return a <= b;
}

// A human-friendly rendering of a dateKey, e.g. "2026-11-19" -> "November 19".
// Parses the key's own year/month/day directly rather than `new Date(key)`,
// which some engines interpret as UTC midnight and can render a day early
// in timezones behind UTC.
export function formatFriendlyDate(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
