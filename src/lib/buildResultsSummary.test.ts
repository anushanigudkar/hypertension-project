import { describe, expect, it } from "vitest";
import { buildResultsSummary } from "./buildResultsSummary";
import type { BehavioralProfile, ConstructResult, Tier } from "./scoring";

function construct(tier: Tier, score: number): ConstructResult {
  return { tier, score };
}

// All-moderate baseline, overridable per test — keeps each test focused on
// just the fields it cares about.
function makeProfile(overrides: Partial<BehavioralProfile> = {}): BehavioralProfile {
  return {
    constructs: {
      A1: construct("moderate", 0.5),
      A4: construct("moderate", 0.5),
      B1: construct("moderate", 0.5),
      ...overrides.constructs,
    },
    flags: {
      monitorAccess: "yes",
      safety: { ayushReplacement: false },
      ...overrides.flags,
    },
    b3: { tier: "moderate", possibleOvermonitoring: false, ...overrides.b3 },
    diagnostics: { ...overrides.diagnostics },
  };
}

describe("buildResultsSummary", () => {
  it("surfaces only high-tier constructs, ordered most-severe first", () => {
    const profile = makeProfile({
      constructs: {
        A1: construct("high", 0.8),
        A4: construct("high", 0.7),
        B1: construct("high", 0.95),
      },
    });

    const summary = buildResultsSummary(profile);

    expect(summary.supportAreas.map((a) => a.id)).toEqual(["B1", "A1", "A4"]);
    // No raw numbers ever leak into the rendered content.
    for (const area of summary.supportAreas) {
      expect(area.title).not.toMatch(/\d/);
      expect(area.body).not.toMatch(/0\.\d/);
    }

    // All three now have built screens.
    expect(summary.supportAreas.map((a) => a.href)).toEqual([
      "/support/routine-jar",
      "/support/pressure-pipe",
      "/support/monitoring-722",
    ]);
  });

  it("omits moderate-tier constructs entirely — no card, no reassurance mention", () => {
    const profile = makeProfile(); // everything moderate

    const summary = buildResultsSummary(profile);

    expect(summary.supportAreas).toEqual([]);
    expect(summary.reassuranceText).toBeNull();
  });

  it("summarizes low-tier constructs as one lightweight reassurance sentence", () => {
    const profile = makeProfile({
      constructs: {
        A1: construct("low", 0.1),
        A4: construct("moderate", 0.5),
        B1: construct("low", 0.1),
      },
    });

    const summary = buildResultsSummary(profile);

    expect(summary.supportAreas).toEqual([]);
    expect(summary.reassuranceText).toBe(
      "You're already doing well with understanding your blood pressure and fitting your medicine into your routine.",
    );
  });

  it("joins three or more low-tier labels with a serial comma", () => {
    const profile = makeProfile({
      constructs: {
        A1: construct("low", 0.1),
        A4: construct("low", 0.1),
        B1: construct("low", 0.1),
      },
    });

    const summary = buildResultsSummary(profile);

    expect(summary.reassuranceText).toBe(
      "You're already doing well with understanding your blood pressure, keeping up with checking when you plan to, and fitting your medicine into your routine.",
    );
  });

  it("adds a B3 support area, after the scored constructs, when monitoring routine is high", () => {
    const profile = makeProfile({
      constructs: {
        A1: construct("high", 0.7),
        A4: construct("moderate", 0.5),
        B1: construct("moderate", 0.5),
      },
      b3: { tier: "high", possibleOvermonitoring: false },
    });

    const summary = buildResultsSummary(profile);

    expect(summary.supportAreas.map((a) => a.id)).toEqual(["A1", "B3"]);
    // A4 isn't high here, so B3 routes to the standalone screen rather
    // than the combined A4+B3 flow.
    expect(summary.supportAreas.map((a) => a.href)).toEqual(["/support/pressure-pipe", "/support/b3-pattern"]);
  });

  it("routes B3 to the combined A4+B3 flow instead of the standalone screen when A4 is also high", () => {
    const profile = makeProfile({
      constructs: {
        A1: construct("moderate", 0.5),
        A4: construct("high", 0.7),
        B1: construct("moderate", 0.5),
      },
      b3: { tier: "high", possibleOvermonitoring: false },
    });

    const summary = buildResultsSummary(profile);

    const b3Area = summary.supportAreas.find((a) => a.id === "B3");
    expect(b3Area?.href).toBe("/support/monitoring-722");
  });

  it("shows a reassuring overmonitoring note without treating it as a support area", () => {
    // Mirrors scoring.ts's actual behavior: possibleOvermonitoring only ever
    // fires alongside b3.tier === "low", never "high".
    const profile = makeProfile({
      b3: { tier: "low", possibleOvermonitoring: true },
    });

    const summary = buildResultsSummary(profile);

    expect(summary.supportAreas).toEqual([]);
    expect(summary.overmonitoringNote).toEqual({
      title: "A note on checking often",
      body: "You're checking your blood pressure very often. That's not a problem — but it's usually not necessary either. Checking a few times a week, or as your doctor suggests, is normally plenty.",
    });
  });

  it("never reflects the ayush-replacement safety flag — that's shown inline during the quiz", () => {
    const withFlag = buildResultsSummary(makeProfile({ flags: { monitorAccess: "yes", safety: { ayushReplacement: true } } }));
    const withoutFlag = buildResultsSummary(makeProfile());

    expect(withFlag).toEqual(withoutFlag);
  });

  it("returns an all-empty summary when nothing stands out", () => {
    const summary = buildResultsSummary(makeProfile());

    expect(summary).toEqual({
      supportAreas: [],
      overmonitoringNote: null,
      reassuranceText: null,
    });
  });
});
