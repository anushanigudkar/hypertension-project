import { Answers, Question } from "@/types/questionnaire";
import { SingleSelectInput } from "./inputs/SingleSelectInput";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import { LikertInput } from "./inputs/LikertInput";
import { ForcedChoiceInput } from "./inputs/ForcedChoiceInput";
import { FrequencyInput } from "./inputs/FrequencyInput";

interface QuestionRendererProps {
  question: Question;
  answers: Answers;
  onAnswer: (questionId: string, value: Answers[string]) => void;
}

export function QuestionRenderer({ question, answers, onAnswer }: QuestionRendererProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[17px] font-medium leading-snug text-sage-900">{question.prompt}</p>
      {question.helperText && <p className="text-sm text-sage-500">{question.helperText}</p>}

      {question.type === "single-select" && (
        <SingleSelectInput
          question={question}
          value={answers[question.id] as string | undefined}
          onChange={(value) => onAnswer(question.id, value)}
        />
      )}

      {question.type === "multi-select" && (
        <MultiSelectInput
          question={question}
          value={answers[question.id] as string[] | undefined}
          onChange={(value) => onAnswer(question.id, value)}
        />
      )}

      {question.type === "likert-5" && (
        <LikertInput
          question={question}
          value={answers[question.id] as number | undefined}
          onChange={(value) => onAnswer(question.id, value)}
        />
      )}

      {question.type === "forced-choice-4" && (
        <ForcedChoiceInput
          question={question}
          value={answers[question.id] as number | undefined}
          onChange={(value) => onAnswer(question.id, value)}
        />
      )}

      {(question.type === "frequency-4a" || question.type === "frequency-4b") && (
        <FrequencyInput
          question={question}
          value={answers[question.id] as number | undefined}
          onChange={(value) => onAnswer(question.id, value)}
        />
      )}
    </div>
  );
}
