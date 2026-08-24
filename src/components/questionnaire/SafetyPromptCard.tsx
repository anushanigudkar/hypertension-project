import { SafetyPrompt } from "@/types/questionnaire";

interface SafetyPromptCardProps {
  prompt: SafetyPrompt;
  onAcknowledge: () => void;
}

// A safety notice, not a form question — visually distinct (warm amber
// rather than sage) so it doesn't read as just another question card, and
// requires its own explicit acknowledgment rather than blending into Next.
export function SafetyPromptCard({ prompt, onAcknowledge }: SafetyPromptCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
      <div className="flex items-start gap-2.5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-amber-600"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="7.5" x2="12" y2="12.5" />
          <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
        <p className="text-[15px] leading-relaxed text-amber-900">{prompt.message}</p>
      </div>
      <button
        type="button"
        onClick={onAcknowledge}
        className="self-start rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800 active:bg-amber-900"
      >
        {prompt.acknowledgeLabel}
      </button>
    </div>
  );
}
