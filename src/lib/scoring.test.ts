import { describe, expect, it } from "vitest";
import { scoreProfile } from "./scoring";
import type { Answers } from "@/types/questionnaire";

describe("scoreProfile", () => {
  it("scores a real captured submission", () => {
    const answers: Answers = {
      q1: "35_44",
      q2: "6mo_2yr",
      q6: ["other", "heart_condition", "diabetes"],
      q7: 2,
      q8: 3,
      q9: 3,
      q15: 2,
      q16: 2,
      q17: 5,
      q21: "occasionally_no_pattern",
      q22: "yes",
      q23: 2,
      q5a: "yes",
      q5b: "replaced_part",
      q16f: ["wanted_break"],
      q23f: ["anxious_about_number"],
    };

    const profile = scoreProfile(answers);

    // A1 = avg(q7=0.25, q8=0.6667, q9 reversed=0.5) = 17/36
    expect(profile.constructs.A1.score).toBeCloseTo(17 / 36, 6);
    expect(profile.constructs.A1.tier).toBe("moderate");

    // A4 = q23=0.3333
    expect(profile.constructs.A4.score).toBeCloseTo(1 / 3, 6);
    expect(profile.constructs.A4.tier).toBe("low");

    // B1 = avg(q15=0.3333, q16=0.3333, q17=1) = 5/9
    expect(profile.constructs.B1.score).toBeCloseTo(5 / 9, 6);
    expect(profile.constructs.B1.tier).toBe("moderate");

    expect(profile.flags.monitorAccess).toBe("yes");
    expect(profile.flags.safety.ayushReplacement).toBe(true);

    expect(profile.b3).toEqual({ tier: "moderate", possibleOvermonitoring: false });

    expect(profile.diagnostics.intentionalSkipReasons).toEqual(["wanted_break"]);
    expect(profile.diagnostics.avoidanceReasons).toEqual(["anxious_about_number"]);
  });

  it("scores every construct as 0 / low at the lowest-barrier extreme", () => {
    const answers: Answers = {
      q5a: "no",
      q7: 1,
      q8: 1,
      q9: 5, // reverse-coded: 5 is the low-barrier end
      q15: 1,
      q16: 1, // "Never" — so q16f is legitimately absent
      q17: 1,
      q21: "focused_stretches",
      q22: "yes",
      q23: 1, // "Never" — so q23f is legitimately absent
    };

    const profile = scoreProfile(answers);

    for (const key of ["A1", "A4", "B1"] as const) {
      expect(profile.constructs[key].score).toBeCloseTo(0, 10);
      expect(profile.constructs[key].tier).toBe("low");
    }

    expect(profile.flags.monitorAccess).toBe("yes");
    expect(profile.flags.safety.ayushReplacement).toBe(false);
    expect(profile.b3).toEqual({ tier: "low", possibleOvermonitoring: false });
    expect(profile.diagnostics.intentionalSkipReasons).toBeUndefined();
    expect(profile.diagnostics.avoidanceReasons).toBeUndefined();
  });

  it("scores every construct as 1 / high at the highest-barrier extreme", () => {
    const answers: Answers = {
      q5a: "yes",
      q5b: "replaced_part",
      q7: 5,
      q8: 4,
      q9: 1, // reverse-coded: 1 is the high-barrier end
      q15: 4,
      q16: 4,
      q16f: ["stressed_upset"],
      q17: 5,
      q21: "dont_check_myself",
      q22: "no",
      q23: 4,
      q23f: ["doesnt_feel_important"],
    };

    const profile = scoreProfile(answers);

    for (const key of ["A1", "A4", "B1"] as const) {
      expect(profile.constructs[key].score).toBeCloseTo(1, 10);
      expect(profile.constructs[key].tier).toBe("high");
    }

    expect(profile.flags.monitorAccess).toBe("no");
    expect(profile.flags.safety.ayushReplacement).toBe(true);
    expect(profile.b3).toEqual({ tier: "high", possibleOvermonitoring: false });
    expect(profile.diagnostics.intentionalSkipReasons).toEqual(["stressed_upset"]);
    expect(profile.diagnostics.avoidanceReasons).toEqual(["doesnt_feel_important"]);
  });

  it("flags possibleOvermonitoring when q21 is very_frequently, while still tiering low", () => {
    const base: Answers = {
      q5a: "no",
      q7: 1,
      q8: 1,
      q9: 5,
      q15: 1,
      q16: 1,
      q17: 1,
      q22: "yes",
      q23: 1,
    };

    const profile = scoreProfile({ ...base, q21: "very_frequently" });

    expect(profile.b3).toEqual({ tier: "low", possibleOvermonitoring: true });
  });

  it("throws on a missing or non-numeric scored item", () => {
    const answers: Record<string, unknown> = {
      q5a: "no",
      // q7 missing
      q8: 1,
      q9: 5,
      q15: 1,
      q16: 1,
      q17: 1,
      q21: "focused_stretches",
      q22: "yes",
      q23: 1,
    };

    expect(() => scoreProfile(answers as Answers)).toThrow(/q7/);
  });

  it("throws on an out-of-range scored item", () => {
    const answers: Record<string, unknown> = {
      q5a: "no",
      q7: 6, // out of the 1-5 likert range
      q8: 1,
      q9: 5,
      q15: 1,
      q16: 1,
      q17: 1,
      q21: "focused_stretches",
      q22: "yes",
      q23: 1,
    };

    expect(() => scoreProfile(answers as Answers)).toThrow(/q7/);
  });
});
