"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupportScreenLayout } from "./SupportScreenLayout";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import {
  fadeSlideVariants,
  staggerContainer,
  stepTransitionVariants,
  STEP_CROSS_FADE_TRANSITION,
  StepDots,
  SelectableCard,
  ValidationError,
} from "./stepFlow";
import { DayCardWeekIllustration, EVENING_COLOR } from "./dayCardWeek";
import { getLinkedMedicineAnchorPhrase } from "./RoutineJarScreen";
import { readJSON, writeJSON } from "@/lib/clientStorage";
import { formatFriendlyDate } from "@/lib/dateKey";
import {
  buildB3Config,
  daysElapsedInFocusedWeek,
  describeB3Routine,
  getB3ScheduleStatus,
  FOCUSED_WEEK_DAYS,
} from "@/lib/b3Schedule";
import type { B3Config, B3RoutineChoice, B3ScheduleStatus, LoggingPreference } from "@/lib/b3Schedule";

const STORAGE_KEY = "hbp:b3-722-method";
const STEP_COUNT = 4;

type RoutineOptionId = "wake_sleep" | "tea_dinner" | "medicine" | "custom";

const ROUTINE_OPTIONS: { id: RoutineOptionId; label: string }[] = [
  { id: "wake_sleep", label: "Right when I wake up, and right before bed" },
  { id: "tea_dinner", label: "With my morning tea, and with dinner" },
  { id: "medicine", label: "Right after my morning and evening medicine" },
];

interface B3State {
  config: B3Config | null;
}

const EMPTY_STATE: B3State = { config: null };

interface B3PatternScreenProps {
  /** Dev-preview only: skips localStorage and starts from this state instead. */
  initialState?: B3State;
  /** Dev-preview only: when false, changes update the in-memory preview state without touching real localStorage. Defaults to true. */
  persistToStorage?: boolean;
}

// B3 — monitoring routine, as a 4-step guided flow: why the 722 method,
// what it looks like, tying it to a routine, then reminder/logging
// preferences. Replaces the earlier day-by-day tracker entirely — there's
// no in-app checklist here; the real tracking happens through whatever
// reminder gets configured in step 4. A returning visit with an active or
// recently-finished setup skips the flow and shows a status summary
// instead, and the whole thing is designed to re-surface every few months
// rather than live as a daily nag — see src/lib/b3Schedule.ts.
export function B3PatternScreen({ initialState, persistToStorage = true }: B3PatternScreenProps = {}) {
  const [state, setState] = useState<B3State | null>(initialState ?? null);
  const [status, setStatus] = useState<B3ScheduleStatus>(() => getB3ScheduleStatus(initialState?.config ?? null, new Date()));
  const [step, setStep] = useState(0);
  const [linkedAnchorPhrase, setLinkedAnchorPhrase] = useState<string | null>(null);

  const [selectedRoutineId, setSelectedRoutineId] = useState<RoutineOptionId | null>(null);
  const [customText, setCustomText] = useState("");
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const [remindersChoice, setRemindersChoice] = useState<"yes" | "no" | null>(null);
  const [loggingPreference, setLoggingPreference] = useState<LoggingPreference>("tick");

  useEffect(() => {
    setLinkedAnchorPhrase(getLinkedMedicineAnchorPhrase());
    if (initialState) return;
    const loaded = readJSON<B3State>(STORAGE_KEY, EMPTY_STATE);
    setState(loaded);
    setStatus(getB3ScheduleStatus(loaded.config, new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seed steps 3-4's local selection UI from whatever's already persisted,
  // so "Change settings" (or a "due" re-run) doesn't start from a blank slate.
  useEffect(() => {
    const config = state?.config;
    if (!config) return;
    if (config.routine.type === "custom") {
      setSelectedRoutineId("custom");
      setCustomText(config.routine.text);
    } else {
      setSelectedRoutineId(config.routine.type);
    }
    setRemindersChoice(config.remindersEnabled ? "yes" : "no");
    if (config.loggingPreference) setLoggingPreference(config.loggingPreference);
  }, [state?.config]);

  function persist(update: (prev: B3State) => B3State) {
    setState((prev) => {
      if (!prev) return prev;
      const next = update(prev);
      if (persistToStorage) writeJSON(STORAGE_KEY, next);
      return next;
    });
  }

  function selectRoutine(id: RoutineOptionId) {
    setSelectedRoutineId(id);
    setStep3Error(null);
  }

  function handleCustomTextChange(value: string) {
    setCustomText(value);
    if (value.trim()) setStep3Error(null);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleStep3Next() {
    if (!selectedRoutineId || (selectedRoutineId === "custom" && !customText.trim())) {
      setStep3Error("Choose one to continue.");
      return;
    }
    setStep3Error(null);
    setStep(3);
  }

  function handleFinish() {
    if (!remindersChoice || !selectedRoutineId) return;
    const routine: B3RoutineChoice =
      selectedRoutineId === "custom" ? { type: "custom", text: customText.trim() } : { type: selectedRoutineId };
    const config = buildB3Config(
      routine,
      remindersChoice === "yes",
      remindersChoice === "yes" ? loggingPreference : null,
      new Date(),
    );
    persist((prev) => ({ ...prev, config }));
    setStatus(getB3ScheduleStatus(config, new Date()));
  }

  function handleChangeSettings() {
    setStatus("none");
    setStep(2);
  }

  if (!state) {
    return (
      <SupportScreenLayout>
        <div aria-hidden="true" />
      </SupportScreenLayout>
    );
  }

  if ((status === "active" || status === "resting") && state.config) {
    return (
      <StatusView
        config={state.config}
        status={status}
        linkedAnchorPhrase={linkedAnchorPhrase}
        onChangeSettings={handleChangeSettings}
      />
    );
  }

  return (
    <SupportScreenLayout>
      {status === "due" && (
        <p className="rounded-2xl bg-sage-50 px-4 py-3 text-sm leading-relaxed text-sage-600">
          It&apos;s been a few months since your last focused week — here&apos;s a quick refresher.
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepTransitionVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={STEP_CROSS_FADE_TRANSITION}
        >
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && (
            <Step3
              selectedId={selectedRoutineId}
              customText={customText}
              error={step3Error}
              linkedAnchorPhrase={linkedAnchorPhrase}
              onSelect={selectRoutine}
              onCustomTextChange={handleCustomTextChange}
            />
          )}
          {step === 3 && (
            <Step4
              remindersChoice={remindersChoice}
              loggingPreference={loggingPreference}
              onSelectReminders={setRemindersChoice}
              onSelectLogging={setLoggingPreference}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <StepDots step={step} count={STEP_COUNT} />

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-2xl border border-sage-200 px-5 py-4 text-[15px] font-medium text-sage-600 transition-colors hover:bg-sage-50"
          >
            Back
          </button>
        )}
        {step === 0 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
          >
            Next
          </button>
        )}
        {step === 1 && (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
          >
            Next
          </button>
        )}
        {step === 2 && (
          <button
            type="button"
            onClick={handleStep3Next}
            className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!remindersChoice}
            className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:bg-sage-300"
          >
            Save
          </button>
        )}
      </div>
    </SupportScreenLayout>
  );
}

function Step1() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Why the 722 method</h1>

      <motion.svg
        viewBox="0 0 320 110"
        className="w-full"
        role="img"
        aria-label="One faded reading compared with a small connected trend line of four readings"
        variants={staggerContainer}
      >
        <motion.circle cx="60" cy="55" r="8" className="fill-sage-300" variants={fadeSlideVariants} />
        <motion.text x="60" y="90" textAnchor="middle" className="fill-sage-500 text-[11px]" variants={fadeSlideVariants}>
          one reading
        </motion.text>

        <motion.path
          d="M180,60 L215,45 L250,50 L285,40"
          fill="none"
          stroke={EVENING_COLOR}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={fadeSlideVariants}
        />
        {[
          { x: 180, y: 60 },
          { x: 215, y: 45 },
          { x: 250, y: 50 },
          { x: 285, y: 40 },
        ].map((p) => (
          <motion.circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="5" fill={EVENING_COLOR} variants={fadeSlideVariants} />
        ))}
        <motion.text x="232" y="90" textAnchor="middle" className="fill-sage-500 text-[11px]" variants={fadeSlideVariants}>
          the 722 method
        </motion.text>
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        One reading only shows a single moment. The <span className="font-medium">722 method</span> means
        checking <span style={{ color: EVENING_COLOR }}>twice</span> a day, morning and evening, two
        readings each time, for seven days, that&apos;s where the name comes from.
      </p>

      <p className="text-[15px] leading-relaxed text-sage-700">
        And it&apos;s not something you do forever: just a focused week, every few months, is
        enough to see your real pattern clearly.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Here&apos;s exactly what that looks like:</h1>

      <DayCardWeekIllustration />

      <p className="text-[15px] leading-relaxed text-sage-700">
        Two readings, morning and evening, for about a week.
      </p>
    </div>
  );
}

interface Step3Props {
  selectedId: RoutineOptionId | null;
  customText: string;
  error: string | null;
  linkedAnchorPhrase: string | null;
  onSelect: (id: RoutineOptionId) => void;
  onCustomTextChange: (value: string) => void;
}

function Step3({ selectedId, customText, error, linkedAnchorPhrase, onSelect, onCustomTextChange }: Step3Props) {
  return (
    <motion.div className="flex flex-col gap-5" variants={staggerContainer}>
      <motion.h1 variants={fadeSlideVariants} className="text-xl font-semibold leading-snug text-sage-900">
        When will you check, morning and evening?
      </motion.h1>

      <div className="flex flex-col gap-2.5">
        {ROUTINE_OPTIONS.map((option) => (
          <div key={option.id} className="flex flex-col gap-1">
            <SelectableCard label={option.label} selected={selectedId === option.id} onClick={() => onSelect(option.id)} />
            {option.id === "medicine" && linkedAnchorPhrase && (
              <motion.p variants={fadeSlideVariants} className="pl-1 text-xs text-sage-500">
                Linked to your medicine reminder: right after {linkedAnchorPhrase}
              </motion.p>
            )}
          </div>
        ))}
        <SelectableCard label="Something else" selected={selectedId === "custom"} onClick={() => onSelect("custom")} />

        {selectedId === "custom" && (
          <motion.input
            variants={fadeSlideVariants}
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="e.g. lunch and before bed"
            autoFocus
            className="rounded-2xl border border-sage-200 bg-white px-4 py-3 text-[15px] text-sage-800 outline-none focus:border-sage-400"
          />
        )}
      </div>

      {error && <ValidationError message={error} />}
    </motion.div>
  );
}

interface Step4Props {
  remindersChoice: "yes" | "no" | null;
  loggingPreference: LoggingPreference;
  onSelectReminders: (choice: "yes" | "no") => void;
  onSelectLogging: (preference: LoggingPreference) => void;
}

function Step4({ remindersChoice, loggingPreference, onSelectReminders, onSelectLogging }: Step4Props) {
  return (
    <motion.div className="flex flex-col gap-5" variants={staggerContainer}>
      <motion.h1 variants={fadeSlideVariants} className="text-xl font-semibold leading-snug text-sage-900">
        Would you like a reminder to help with this?
      </motion.h1>

      <div className="flex flex-col gap-2.5">
        <SelectableCard label="Yes, remind me" selected={remindersChoice === "yes"} onClick={() => onSelectReminders("yes")} />
        <SelectableCard label="No thanks" selected={remindersChoice === "no"} onClick={() => onSelectReminders("no")} />
      </div>

      {remindersChoice === "yes" && (
        <motion.div variants={fadeSlideVariants} className="flex flex-col gap-3">
          <p className="text-[15px] font-medium text-sage-900">How would you like to log it?</p>
          <div className="flex flex-col gap-2.5">
            <SelectableCard label="Just a quick tick" selected={loggingPreference === "tick"} onClick={() => onSelectLogging("tick")} />
            <SelectableCard
              label="Record the actual numbers"
              selected={loggingPreference === "numbers"}
              onClick={() => onSelectLogging("numbers")}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatusView({
  config,
  status,
  linkedAnchorPhrase,
  onChangeSettings,
}: {
  config: B3Config;
  status: "active" | "resting";
  linkedAnchorPhrase: string | null;
  onChangeSettings: () => void;
}) {
  const routinePhrase = describeB3Routine(config.routine, linkedAnchorPhrase);
  const reminderLine = config.remindersEnabled
    ? `Reminders are on — ${config.loggingPreference === "tick" ? "a quick tick each time" : "recording your actual numbers"}.`
    : "Reminders are off.";

  return (
    <SupportScreenLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold leading-snug text-sage-900">
          {status === "active" ? "Your focused week is underway" : "You finished your focused week"}
        </h1>

        <p className="text-[15px] leading-relaxed text-sage-700">Checking {routinePhrase}, morning and evening.</p>

        {status === "active" && (
          <ProgressBar current={daysElapsedInFocusedWeek(config.scheduleStartDate, new Date())} total={FOCUSED_WEEK_DAYS} label="Day" />
        )}

        <p className="text-sm leading-relaxed text-sage-500">{reminderLine}</p>

        {status === "resting" && (
          <p className="text-sm leading-relaxed text-sage-500">
            Your next check-in is around {formatFriendlyDate(config.nextResurfaceDate)}.
          </p>
        )}

        <button
          type="button"
          onClick={onChangeSettings}
          className="rounded-2xl border border-sage-200 px-5 py-4 text-[15px] font-medium text-sage-600 transition-colors hover:bg-sage-50"
        >
          Change settings
        </button>
      </div>
    </SupportScreenLayout>
  );
}
