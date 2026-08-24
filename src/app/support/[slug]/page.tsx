import { notFound } from "next/navigation";
import type { ContentId } from "@/data/contentMap";
import { PressurePipeScreen } from "@/components/support/PressurePipeScreen";
import { MonitoringReframeScreen } from "@/components/support/MonitoringReframeScreen";
import { Monitoring722Screen } from "@/components/support/Monitoring722Screen";
import { B3PatternScreen } from "@/components/support/B3PatternScreen";
import { RoutineJarScreen } from "@/components/support/RoutineJarScreen";

const SCREENS: Record<ContentId, React.ComponentType> = {
  "pressure-pipe": PressurePipeScreen,
  // No longer routed to from CONTENT_MAP (superseded by monitoring-722 for
  // A4), kept as a working standalone route rather than deleted.
  "monitoring-reframe": MonitoringReframeScreen,
  "monitoring-722": Monitoring722Screen,
  "b3-pattern": B3PatternScreen,
  "routine-jar": RoutineJarScreen,
};

function isKnownContentId(slug: string): slug is ContentId {
  return slug in SCREENS;
}

interface SupportPageProps {
  params: { slug: string };
}

export default function SupportPage({ params }: SupportPageProps) {
  if (isKnownContentId(params.slug)) {
    const Screen = SCREENS[params.slug];
    return <Screen />;
  }

  // Every slug the app can legitimately generate now maps to a real built
  // screen (see contentMap.ts) — a genuinely unrecognized slug here means
  // a bad/stale link, not a "not built yet" state, so it 404s.
  notFound();
}
