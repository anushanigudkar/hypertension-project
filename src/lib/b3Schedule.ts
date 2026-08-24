import { addDays, addMonths, dateKey, isDateKeyOnOrBefore } from "./dateKey";

// Pure scheduling logic for B3's 722 method setup. No React, no I/O — the
// screen reads/writes this shape via localStorage, but everything here is
// plain data in, plain data out, so the schedule math is unit-testable on
// its own (same split as scoring.ts / buildResultsSummary.ts).

// "Not something you do forever" (step 1's copy) is a real constraint, not
// just framing: a focused week is time-bounded, and re-surfacing the setup
// happens on a multi-month cadence rather than nagging daily indefinitely.
const FOCUSED_WEEK_DAYS = 7;
const RESURFACE_MONTHS = 3;

export type LoggingPreference = "tick" | "numbers";

export type B3RoutineChoice =
  | { type: "wake_sleep" }
  | { type: "tea_dinner" }
  | { type: "medicine" }
  | { type: "custom"; text: string };

export interface B3Config {
  routine: B3RoutineChoice;
  remindersEnabled: boolean;
  /** null whenever reminders are off — there's nothing to log. */
  loggingPreference: LoggingPreference | null;
  scheduleStartDate: string;
  scheduleEndDate: string;
  nextResurfaceDate: string;
}

export type B3ScheduleStatus = "none" | "active" | "resting" | "due";

export function buildB3Config(
  routine: B3RoutineChoice,
  remindersEnabled: boolean,
  loggingPreference: LoggingPreference | null,
  startDate: Date,
): B3Config {
  return {
    routine,
    remindersEnabled,
    loggingPreference: remindersEnabled ? loggingPreference : null,
    scheduleStartDate: dateKey(startDate),
    scheduleEndDate: dateKey(addDays(startDate, FOCUSED_WEEK_DAYS - 1)),
    nextResurfaceDate: dateKey(addMonths(startDate, RESURFACE_MONTHS)),
  };
}

// "active": still within the 7-day window (inclusive of the last day).
// "resting": the week is over, but it hasn't been a few months yet — no
// nagging, nothing to do until the next re-surface point.
// "due": the re-surface date has arrived — time to offer another round.
export function getB3ScheduleStatus(config: B3Config | null, today: Date): B3ScheduleStatus {
  if (!config) return "none";
  const todayKey = dateKey(today);
  if (isDateKeyOnOrBefore(todayKey, config.scheduleEndDate)) return "active";
  if (todayKey < config.nextResurfaceDate) return "resting";
  return "due";
}

// 1-indexed day count into the focused week, clamped to [1, 7] — for
// display ("Day 3 of 7"), not used for the status decision above.
export function daysElapsedInFocusedWeek(scheduleStartDate: string, today: Date): number {
  const start = parseDateKey(scheduleStartDate);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.min(FOCUSED_WEEK_DAYS, Math.max(1, diffDays));
}

export { FOCUSED_WEEK_DAYS };

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Human-readable description of the chosen check-in routine. linkedAnchorPhrase
// comes from B1's own stored anchor (see RoutineJarScreen.getLinkedMedicineAnchorPhrase) —
// passed in rather than read here so this stays a pure function.
export function describeB3Routine(routine: B3RoutineChoice, linkedAnchorPhrase: string | null): string {
  switch (routine.type) {
    case "wake_sleep":
      return "right when you wake up, and right before bed";
    case "tea_dinner":
      return "with your morning tea, and with dinner";
    case "medicine":
      return linkedAnchorPhrase ? `right after your medicine (${linkedAnchorPhrase})` : "right after your medicine";
    case "custom":
      return routine.text;
  }
}
