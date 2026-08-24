interface ProgressBarProps {
  current: number;
  total: number;
  /** Defaults to "Question" for the questionnaire; pass e.g. "Day" for other progress contexts. */
  label?: string;
}

export function ProgressBar({ current, total, label = "Question" }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
        <div
          className="h-full rounded-full bg-sage-500 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-sage-400">
        {label} {current} of {total}
      </span>
    </div>
  );
}
