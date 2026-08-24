import { SingleSelectQuestion } from "@/types/questionnaire";
import { OptionButton } from "./OptionButton";

interface SingleSelectInputProps {
  question: SingleSelectQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SingleSelectInput({ question, value, onChange }: SingleSelectInputProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((option) => (
        <OptionButton
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
