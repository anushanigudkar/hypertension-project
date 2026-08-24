// Thin, defensive localStorage wrapper — isolates the one side-effecting
// dependency B1/B3 rely on, so a missing `window` (SSR) or a disabled/full
// store (private browsing) fails quietly instead of crashing a screen.
// Not unit-tested: it's a deliberately trivial pass-through, and the logic
// worth testing (date-keying, jar math) lives in pure functions elsewhere.

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — the in-memory state still works for this
    // session, it just won't persist. Not worth surfacing to the user.
  }
}
