import { LikertQuestion } from "@/types/questionnaire";
import { LIKERT_SCALE } from "@/data/scales";
import { LikertSlider } from "./LikertSlider";

interface LikertInputProps {
  question: LikertQuestion;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function LikertInput({ question, value, onChange }: LikertInputProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="rounded-2xl bg-sage-50 px-4 py-4 text-[15px] leading-relaxed text-sage-900">
        {question.statement}
      </p>
      <LikertSlider points={LIKERT_SCALE} value={value} onChange={onChange} />
    </div>
  );
}
