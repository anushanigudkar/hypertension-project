import { B3PatternScreen } from "@/components/support/B3PatternScreen";
import { buildSampleB3ActiveState } from "../sampleData";

// Dev preview only — sample state, no localStorage writes.
export default function B3PatternActivePreviewPage() {
  return <B3PatternScreen initialState={buildSampleB3ActiveState()} persistToStorage={false} />;
}
