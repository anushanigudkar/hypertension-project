interface OptionButtonProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}

// Shared selectable-row primitive used by every input type so the
// questionnaire feels like one consistent, calm interface.
export function OptionButton({ label, sublabel, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        selected
          ? "border-sage-500 bg-sage-100 text-sage-900"
          : "border-sage-200 bg-white text-sage-800 hover:border-sage-300 hover:bg-sage-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-sage-600 bg-sage-600" : "border-sage-300 bg-white"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        <span className="flex flex-col">
          {sublabel && (
            <span className="text-xs font-medium uppercase tracking-wide text-sage-500">{sublabel}</span>
          )}
          <span className="text-[15px] leading-snug">{label}</span>
        </span>
      </div>
    </button>
  );
}
