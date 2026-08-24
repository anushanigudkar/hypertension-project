import { Answers } from "@/types/questionnaire";
import { getSupabaseClient } from "@/lib/supabase/client";

// Persists the full set of raw answers, keyed by question ID, as a single row.
// Scoring/profile logic is intentionally out of scope here — this only captures data.
export async function submitResponses(answers: Answers): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("questionnaire_responses").insert({ answers });

  if (error) {
    throw new Error(error.message);
  }
}
