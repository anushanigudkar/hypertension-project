import { FrequencyQuestion } from "@/types/questionnaire";
import { FREQUENCY_A_SCALE, FREQUENCY_B_SCALE } from "@/data/scales";
import { OptionButton } from "./OptionButton";

interface FrequencyInputProps {
  question: FrequencyQuestion;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function FrequencyInput({ question, value, onChange }: FrequencyInputProps) {
  const scale = question.type === "frequency-4a" ? FREQUENCY_A_SCALE : FREQUENCY_B_SCALE;

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-sage-50 px-4 py-4 text-[15px] leading-relaxed text-sage-900">
        {question.statement}
      </p>
      <div className="flex flex-col gap-2.5">
        {scale.map((point) => (
          <OptionButton
            key={point.value}
            label={point.label}
            selected={value === point.value}
            onClick={() => onChange(point.value)}
          />
        ))}
      </div>
    </div>
  );
}
