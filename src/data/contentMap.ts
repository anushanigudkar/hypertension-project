import type { Tier } from "@/lib/scoring";

export type SupportAreaId = "A1" | "A4" | "B1" | "B3";
export type ContentId = "pressure-pipe" | "routine-jar" | "monitoring-reframe" | "monitoring-722" | "b3-pattern";

// Maps a (construct, tier) pair to a built content id. Only "high" tier
// entries exist today — ResultsScreen only ever links out for high-tier
// support areas, so that's the only tier this is ever queried with. As more
// intervention screens get built, add their entries here rather than
// touching the routing or results-screen code.
//
// B3 is deliberately absent here — its routing depends on A4's tier too
// (see getB3Slug below), which a static (area, tier) -> id map can't
// express. "monitoring-reframe" is an earlier A4 screen that's no longer
// routed to from here but is kept as a working standalone route rather
// than deleted. The old day-by-day focused-week tracker was fully replaced
// by "b3-pattern" (see B3PatternScreen) and removed entirely — it's not
// an orphaned route, it no longer exists.
export const CONTENT_MAP: Partial<Record<SupportAreaId, Partial<Record<Tier, ContentId>>>> = {
  A1: { high: "pressure-pipe" },
  A4: { high: "monitoring-722" },
  B1: { high: "routine-jar" },
};

// The /support/[slug] segment for a given area+tier: a real content id if
// one's built, otherwise the area id itself (lowercased). Every area+tier
// combination ResultsScreen actually links out for (all four areas at
// "high") resolves to a real built screen now, so that fallback slug is
// purely defensive — the dynamic route 404s on it rather than showing a
// placeholder, since there's no longer a legitimate "not built yet" state.
export function getSupportSlug(area: SupportAreaId, tier: Tier): string {
  return CONTENT_MAP[area]?.[tier] ?? area.toLowerCase();
}

// B3's routing depends on whether A4 is *also* high: the combined
// "monitoring-722" flow's step 2 already covers the 722 checking pattern,
// so someone flagged on both constructs should see that single flow rather
// than a near-duplicate screen. Only route to the standalone B3-only
// screen when B3 is high but A4 isn't — those users don't need the
// avoidance-reframing content in the combined flow's steps 1 and 3.
export function getB3Slug(a4Tier: Tier, b3Tier: Tier): string {
  if (b3Tier !== "high") return "b3";
  return a4Tier === "high" ? "monitoring-722" : "b3-pattern";
}
