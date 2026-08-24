import { RoutineJarScreen } from "@/components/support/RoutineJarScreen";

// Dev preview only — forces a fresh (no routine chosen) state so Steps 1-2
// are reviewable directly, since the plain "routine-jar" preview
// intentionally starts on Step 3 to show the in-progress jar. No
// localStorage writes.
export default function RoutineJarFreshStartPreviewPage() {
  return <RoutineJarScreen initialState={{ routine: null, loggedDates: [] }} persistToStorage={false} />;
}
