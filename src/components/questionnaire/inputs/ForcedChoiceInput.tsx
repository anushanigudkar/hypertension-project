import { ForcedChoiceQuestion } from "@/types/questionnaire";
import { OptionButton } from "./OptionButton";

interface ForcedChoiceInputProps {
  question: ForcedChoiceQuestion;
  value: number | undefined;
  onChange: (value: number) => void;
}

// Bipolar 4-point scale, no neutral midpoint:
// 1 = Strongly A, 2 = Somewhat A, 3 = Somewhat B, 4 = Strongly B.
export function ForcedChoiceInput({ question, value, onChange }: ForcedChoiceInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-sage-600">Pick the one that's closest to how you actually feel — there's no in-between option.</p>

      <div className="flex flex-col gap-2.5">
        <OptionButton
          sublabel="Strongly agree"
          label={question.statementA}
          selected={value === 1}
          onClick={() => onChange(1)}
        />
        <OptionButton
          sublabel="Somewhat agree"
          label={question.statementA}
          selected={value === 2}
          onClick={() => onChange(2)}
        />
      </div>

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-sage-400">
        <span className="h-px flex-1 bg-sage-200" />
        or
        <span className="h-px flex-1 bg-sage-200" />
      </div>

      <div className="flex flex-col gap-2.5">
        <OptionButton
          sublabel="Somewhat agree"
          label={question.statementB}
          selected={value === 3}
          onClick={() => onChange(3)}
        />
        <OptionButton
          sublabel="Strongly agree"
          label={question.statementB}
          selected={value === 4}
          onClick={() => onChange(4)}
        />
      </div>
    </div>
  );
}
