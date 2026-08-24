import { MultiSelectQuestion } from "@/types/questionnaire";
import { OptionButton } from "./OptionButton";

interface MultiSelectInputProps {
  question: MultiSelectQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function MultiSelectInput({ question, value, onChange }: MultiSelectInputProps) {
  const selected = value ?? [];
  const exclusive = question.exclusiveValues ?? [];

  function toggle(optionValue: string) {
    const isExclusive = exclusive.includes(optionValue);

    if (isExclusive) {
      // Picking an exclusive option (e.g. "None") clears everything else.
      onChange(selected.includes(optionValue) ? [] : [optionValue]);
      return;
    }

    // Picking a regular option clears any exclusive selection already made.
    const withoutExclusive = selected.filter((v) => !exclusive.includes(v));
    const next = withoutExclusive.includes(optionValue)
      ? withoutExclusive.filter((v) => v !== optionValue)
      : [...withoutExclusive, optionValue];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((option) => (
        <OptionButton
          key={option.value}
          label={option.label}
          selected={selected.includes(option.value)}
          onClick={() => toggle(option.value)}
        />
      ))}
    </div>
  );
}
