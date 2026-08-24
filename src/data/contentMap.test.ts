import { describe, expect, it } from "vitest";
import { getSupportSlug, getB3Slug } from "./contentMap";

describe("getSupportSlug", () => {
  it("returns the built content id for a mapped high-tier area", () => {
    expect(getSupportSlug("A1", "high")).toBe("pressure-pipe");
    expect(getSupportSlug("B1", "high")).toBe("routine-jar");
    expect(getSupportSlug("A4", "high")).toBe("monitoring-722");
  });

  it("falls back for tiers with no built content, even for a mapped area", () => {
    expect(getSupportSlug("A1", "moderate")).toBe("a1");
    expect(getSupportSlug("A1", "low")).toBe("a1");
  });
});

describe("getB3Slug", () => {
  it("routes to the standalone B3 screen when B3 is high but A4 isn't", () => {
    expect(getB3Slug("moderate", "high")).toBe("b3-pattern");
    expect(getB3Slug("low", "high")).toBe("b3-pattern");
  });

  it("routes to the combined A4+B3 flow when both are high, to avoid a near-duplicate screen", () => {
    expect(getB3Slug("high", "high")).toBe("monitoring-722");
  });

  it("falls back to the placeholder slug when B3 itself isn't high", () => {
    expect(getB3Slug("high", "moderate")).toBe("b3");
    expect(getB3Slug("high", "low")).toBe("b3");
  });
});
