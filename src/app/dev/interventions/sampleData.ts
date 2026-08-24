import type { RoutineJarState } from "@/components/support/RoutineJarScreen";
import { buildB3Config } from "@/lib/b3Schedule";

// Hardcoded sample data for /dev/interventions previews only — never read
// from or written to real localStorage, and unrelated to the scoring
// pipeline. Dates aren't meant to be contiguous, just enough to show a
// partially-filled jar for design review.
export const SAMPLE_JAR_STATE: RoutineJarState = {
  routine: { presetId: "drink", customText: "" },
  loggedDates: [
    "2026-07-20",
    "2026-07-21",
    "2026-07-23",
    "2026-07-24",
    "2026-07-25",
    "2026-07-28",
    "2026-07-29",
    "2026-08-01",
    "2026-08-04",
    "2026-08-05",
    "2026-08-10",
    "2026-08-14",
  ],
};

// A function rather than a constant so "today" always reflects whenever the
// preview is actually viewed — shows an in-progress focused week (started
// a couple of days ago) rather than a schedule that could go stale relative
// to whenever this gets looked at.
export function buildSampleB3ActiveState(): { config: ReturnType<typeof buildB3Config> } {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  return { config: buildB3Config({ type: "wake_sleep" }, true, "tick", startDate) };
}
