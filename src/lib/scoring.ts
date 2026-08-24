import type { Answers } from "@/types/questionnaire";

// Pure behavioral-profile scoring. No React, no I/O — takes the same raw
// answers object that gets saved to Supabase and returns a derived profile.
// Deliberately self-contained (doesn't import src/data/questions.ts) so the
// scale ranges below are the single source of truth for scoring, independent
// of how the UI happens to be wired.

export type Tier = "low" | "moderate" | "high";

export interface ConstructResult {
  score: number;
  tier: Tier;
}

export interface BehavioralProfile {
  constructs: {
    A1: ConstructResult;
    A4: ConstructResult;
    B1: ConstructResult;
  };
  flags: {
    monitorAccess: string;
    safety: {
      ayushReplacement: boolean;
    };
  };
  b3: {
    tier: Tier;
    possibleOvermonitoring: boolean;
  };
  diagnostics: {
    intentionalSkipReasons?: string[];
    avoidanceReasons?: string[];
  };
}

interface ScoredItem {
  id: string;
  scaleMin: number;
  scaleMax: number;
  reverse?: boolean;
}

// Only q9 is reverse-coded — it's the one item per construct where
// agreeing is the *low-barrier* answer, so raw and barrier-direction point
// opposite ways.
const CONSTRUCT_ITEMS: Record<keyof BehavioralProfile["constructs"], ScoredItem[]> = {
  A1: [
    { id: "q7", scaleMin: 1, scaleMax: 5 },
    { id: "q8", scaleMin: 1, scaleMax: 4 },
    { id: "q9", scaleMin: 1, scaleMax: 5, reverse: true },
  ],
  A4: [{ id: "q23", scaleMin: 1, scaleMax: 4 }],
  B1: [
    { id: "q15", scaleMin: 1, scaleMax: 4 },
    { id: "q16", scaleMin: 1, scaleMax: 4 },
    { id: "q17", scaleMin: 1, scaleMax: 5 },
  ],
};

function normalize(raw: number, scaleMin: number, scaleMax: number, reverse: boolean): number {
  return reverse ? (scaleMax - raw) / (scaleMax - scaleMin) : (raw - scaleMin) / (scaleMax - scaleMin);
}

function tierFor(score: number): Tier {
  if (score < 0.35) return "low";
  if (score < 0.65) return "moderate";
  return "high";
}

function getRawNumber(answers: Answers, item: ScoredItem): number {
  const raw = answers[item.id];
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    throw new Error(`scoreProfile: expected a numeric answer for "${item.id}", got ${JSON.stringify(raw)}`);
  }
  if (raw < item.scaleMin || raw > item.scaleMax) {
    throw new Error(
      `scoreProfile: "${item.id}" value ${raw} is outside its expected range [${item.scaleMin}, ${item.scaleMax}]`,
    );
  }
  return raw;
}

function scoreConstruct(answers: Answers, items: ScoredItem[]): ConstructResult {
  const normalized = items.map((item) =>
    normalize(getRawNumber(answers, item), item.scaleMin, item.scaleMax, Boolean(item.reverse)),
  );
  const score = normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  return { score, tier: tierFor(score) };
}

function scoreB3(q21: unknown): { tier: Tier; possibleOvermonitoring: boolean } {
  switch (q21) {
    case "dont_check_myself":
    case "only_when_unusual":
      return { tier: "high", possibleOvermonitoring: false };
    case "occasionally_no_pattern":
      return { tier: "moderate", possibleOvermonitoring: false };
    case "focused_stretches":
      return { tier: "low", possibleOvermonitoring: false };
    case "very_frequently":
      return { tier: "low", possibleOvermonitoring: true };
    default:
      throw new Error(`scoreProfile: unrecognized q21 value ${JSON.stringify(q21)}`);
  }
}

export function scoreProfile(answers: Answers): BehavioralProfile {
  const constructs = {
    A1: scoreConstruct(answers, CONSTRUCT_ITEMS.A1),
    A4: scoreConstruct(answers, CONSTRUCT_ITEMS.A4),
    B1: scoreConstruct(answers, CONSTRUCT_ITEMS.B1),
  };

  if (typeof answers.q22 !== "string") {
    throw new Error(`scoreProfile: expected a string answer for "q22", got ${JSON.stringify(answers.q22)}`);
  }

  return {
    constructs,
    flags: {
      monitorAccess: answers.q22,
      safety: {
        ayushReplacement: answers.q5b === "replaced_part",
      },
    },
    b3: scoreB3(answers.q21),
    diagnostics: {
      ...(Array.isArray(answers.q16f) ? { intentionalSkipReasons: answers.q16f as string[] } : {}),
      ...(Array.isArray(answers.q23f) ? { avoidanceReasons: answers.q23f as string[] } : {}),
    },
  };
}
