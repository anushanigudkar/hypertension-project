import { B3PatternScreen } from "@/components/support/B3PatternScreen";

// Dev preview only — forces a fresh (no config) state so Steps 1-4 are
// reviewable directly. No localStorage writes.
export default function B3PatternFreshStartPreviewPage() {
  return <B3PatternScreen initialState={{ config: null }} persistToStorage={false} />;
}
