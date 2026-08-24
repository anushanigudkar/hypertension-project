import { describe, expect, it } from "vitest";
import { buildB3Config, daysElapsedInFocusedWeek, describeB3Routine, getB3ScheduleStatus } from "./b3Schedule";
import type { B3Config } from "./b3Schedule";

describe("buildB3Config", () => {
  it("computes a 7-day window inclusive of the start date", () => {
    const config = buildB3Config({ type: "wake_sleep" }, true, "tick", new Date(2026, 7, 18));
    expect(config.scheduleStartDate).toBe("2026-08-18");
    expect(config.scheduleEndDate).toBe("2026-08-24"); // 7 days total, including the 18th
  });

  it("sets the re-surface date about 3 months out", () => {
    const config = buildB3Config({ type: "wake_sleep" }, true, "tick", new Date(2026, 7, 18));
    expect(config.nextResurfaceDate).toBe("2026-11-18");
  });

  it("nulls out the logging preference when reminders are disabled", () => {
    const config = buildB3Config({ type: "wake_sleep" }, false, "numbers", new Date(2026, 7, 18));
    expect(config.remindersEnabled).toBe(false);
    expect(config.loggingPreference).toBeNull();
  });
});

describe("getB3ScheduleStatus", () => {
  const config: B3Config = {
    routine: { type: "wake_sleep" },
    remindersEnabled: true,
    loggingPreference: "tick",
    scheduleStartDate: "2026-08-18",
    scheduleEndDate: "2026-08-24",
    nextResurfaceDate: "2026-11-18",
  };

  it("returns 'none' when there's no config yet", () => {
    expect(getB3ScheduleStatus(null, new Date(2026, 7, 18))).toBe("none");
  });

  it("returns 'active' on the start date, mid-week, and the last day (inclusive)", () => {
    expect(getB3ScheduleStatus(config, new Date(2026, 7, 18))).toBe("active");
    expect(getB3ScheduleStatus(config, new Date(2026, 7, 21))).toBe("active");
    expect(getB3ScheduleStatus(config, new Date(2026, 7, 24))).toBe("active");
  });

  it("returns 'resting' the day after the window ends, up to just before re-surfacing", () => {
    expect(getB3ScheduleStatus(config, new Date(2026, 7, 25))).toBe("resting");
    expect(getB3ScheduleStatus(config, new Date(2026, 10, 17))).toBe("resting"); // Nov 17, day before resurface
  });

  it("returns 'due' exactly on and after the re-surface date", () => {
    expect(getB3ScheduleStatus(config, new Date(2026, 10, 18))).toBe("due"); // Nov 18
    expect(getB3ScheduleStatus(config, new Date(2027, 0, 1))).toBe("due");
  });
});

describe("daysElapsedInFocusedWeek", () => {
  it("is day 1 on the start date and day 7 on the last day, clamped in between", () => {
    expect(daysElapsedInFocusedWeek("2026-08-18", new Date(2026, 7, 18))).toBe(1);
    expect(daysElapsedInFocusedWeek("2026-08-18", new Date(2026, 7, 21))).toBe(4);
    expect(daysElapsedInFocusedWeek("2026-08-18", new Date(2026, 7, 24))).toBe(7);
    expect(daysElapsedInFocusedWeek("2026-08-18", new Date(2026, 7, 30))).toBe(7); // clamped, doesn't overrun
  });
});

describe("describeB3Routine", () => {
  it("describes each preset routine in plain language", () => {
    expect(describeB3Routine({ type: "wake_sleep" }, null)).toBe("right when you wake up, and right before bed");
    expect(describeB3Routine({ type: "tea_dinner" }, null)).toBe("with your morning tea, and with dinner");
    expect(describeB3Routine({ type: "custom", text: "lunch and before bed" }, null)).toBe("lunch and before bed");
  });

  it("links the medicine routine to B1's actual anchor phrase when available", () => {
    expect(describeB3Routine({ type: "medicine" }, "brushing your teeth")).toBe(
      "right after your medicine (brushing your teeth)",
    );
  });

  it("falls back to a generic phrase when no B1 anchor is linked", () => {
    expect(describeB3Routine({ type: "medicine" }, null)).toBe("right after your medicine");
  });
});
