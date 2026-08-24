import type { BehavioralProfile } from "./scoring";
import { CONSTRUCT_COPY, B3_HIGH_COPY, OVERMONITORING_COPY } from "@/data/resultsCopy";
import { getSupportSlug, getB3Slug } from "@/data/contentMap";

// Pure transform from a BehavioralProfile to exactly what the results screen
// should render. No React — the display rules (what counts as a "support
// area", ordering, when to omit) live here so they're testable on plain
// objects, same as scoring.ts itself.
//
// Rules encoded here:
//   - Only "high" tier constructs become active support areas. "moderate"
//     is intentionally not surfaced as either a concern or a reassurance —
//     it's the quiet middle ground.
//   - "low" tier constructs are optionally summarized in one lightweight
//     reassurance sentence, never as individual cards.
//   - b3 (monitoring routine) is scored separately from profile.constructs,
//     so it's handled on its own: "high" tier joins the support areas list,
//     and possibleOvermonitoring produces a distinct, non-alarming note.
//     These two are mutually exclusive by construction in scoring.ts.
//   - b3's link target also depends on A4's tier (see getB3Slug): when both
//     are high, the combined A4+B3 flow already covers B3, so it routes
//     there instead of a near-duplicate standalone screen.
//   - flags.safety.ayushReplacement is deliberately never surfaced here —
//     that's shown inline during the quiz itself, not repeated at the end.

export interface SupportArea {
  id: string;
  title: string;
  body: string;
  /** Where "see what might help" links to — a built screen, or a placeholder if none exists yet. */
  href: string;
}

export interface ResultsSummary {
  supportAreas: SupportArea[];
  overmonitoringNote: { title: string; body: string } | null;
  reassuranceText: string | null;
}

export function buildResultsSummary(profile: BehavioralProfile): ResultsSummary {
  const supportAreas: SupportArea[] = CONSTRUCT_COPY.map((copy) => ({
    copy,
    result: profile.constructs[copy.id],
  }))
    .filter(({ result }) => result.tier === "high")
    // Every entry here is already tier "high"; break ties using the
    // underlying score (never shown to the user) so the most severe leads.
    .sort((a, b) => b.result.score - a.result.score)
    .map(({ copy }) => ({
      id: copy.id,
      title: copy.highTitle,
      body: copy.highBody,
      href: `/support/${getSupportSlug(copy.id, "high")}`,
    }));

  if (profile.b3.tier === "high") {
    supportAreas.push({
      id: "B3",
      title: B3_HIGH_COPY.title,
      body: B3_HIGH_COPY.body,
      href: `/support/${getB3Slug(profile.constructs.A4.tier, profile.b3.tier)}`,
    });
  }

  const lowLabels = CONSTRUCT_COPY.filter((copy) => profile.constructs[copy.id].tier === "low").map(
    (copy) => copy.lowLabel,
  );

  return {
    supportAreas,
    overmonitoringNote: profile.b3.possibleOvermonitoring
      ? { title: OVERMONITORING_COPY.title, body: OVERMONITORING_COPY.body }
      : null,
    reassuranceText: lowLabels.length > 0 ? formatReassurance(lowLabels) : null,
  };
}

function formatReassurance(labels: string[]): string {
  let list: string;
  if (labels.length === 1) {
    list = labels[0];
  } else if (labels.length === 2) {
    list = `${labels[0]} and ${labels[1]}`;
  } else {
    list = `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
  }
  return `You're already doing well with ${list}.`;
}
