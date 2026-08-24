import { RoutineJarScreen } from "@/components/support/RoutineJarScreen";
import { SAMPLE_JAR_STATE } from "../sampleData";

// Dev preview only — sample state, no localStorage writes.
export default function RoutineJarPreviewPage() {
  return <RoutineJarScreen initialState={SAMPLE_JAR_STATE} persistToStorage={false} />;
}
