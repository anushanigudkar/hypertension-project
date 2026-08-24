import { describe, expect, it } from "vitest";
import { addDays, addMonths, dateKey, formatFriendlyDate, isDateKeyOnOrBefore } from "./dateKey";

describe("dateKey", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(dateKey(new Date(2026, 7, 18))).toBe("2026-08-18"); // August is month index 7
  });

  it("pads single-digit months and days", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("uses the date's own local year/month/day, not UTC", () => {
    const d = new Date(2026, 11, 31);
    const key = dateKey(d);
    expect(key).toBe(`${d.getFullYear()}-12-31`);
  });
});

describe("addDays", () => {
  it("adds days within a month", () => {
    expect(dateKey(addDays(new Date(2026, 7, 18), 7))).toBe("2026-08-25");
  });

  it("rolls over a month boundary", () => {
    expect(dateKey(addDays(new Date(2026, 7, 28), 7))).toBe("2026-09-04");
  });

  it("does not mutate the original date", () => {
    const original = new Date(2026, 7, 18);
    addDays(original, 7);
    expect(dateKey(original)).toBe("2026-08-18");
  });
});

describe("addMonths", () => {
  it("adds months within a year", () => {
    expect(dateKey(addMonths(new Date(2026, 7, 18), 3))).toBe("2026-11-18");
  });

  it("rolls over a year boundary", () => {
    expect(dateKey(addMonths(new Date(2026, 10, 18), 3))).toBe("2027-02-18");
  });
});

describe("isDateKeyOnOrBefore", () => {
  it("compares chronologically via the zero-padded string format", () => {
    expect(isDateKeyOnOrBefore("2026-08-18", "2026-08-19")).toBe(true);
    expect(isDateKeyOnOrBefore("2026-08-18", "2026-08-18")).toBe(true);
    expect(isDateKeyOnOrBefore("2026-08-19", "2026-08-18")).toBe(false);
    expect(isDateKeyOnOrBefore("2026-09-01", "2026-08-31")).toBe(false);
  });
});

describe("formatFriendlyDate", () => {
  it("renders a readable month and day", () => {
    expect(formatFriendlyDate("2026-11-19")).toBe("November 19");
  });

  it("does not shift a day earlier near a UTC boundary", () => {
    expect(formatFriendlyDate("2026-01-01")).toBe("January 1");
  });
});
