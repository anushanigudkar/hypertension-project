"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupportScreenLayout } from "./SupportScreenLayout";
import {
  fadeSlideVariants,
  staggerContainer,
  stepTransitionVariants,
  STEP_CROSS_FADE_TRANSITION,
  StepDots,
  SelectableCard,
  ValidationError,
} from "./stepFlow";
import { readJSON, writeJSON } from "@/lib/clientStorage";
import { dateKey } from "@/lib/dateKey";

const STORAGE_KEY = "hbp:b1-routine-jar";
// Not a deadline or a target you can "fail" — just how full the jar gets
// drawn. Chosen as a familiar "about three weeks" habit-forming stretch.
const JAR_MILESTONE_DAYS = 21;
const STEP_COUNT = 3;

// Exact hex requested for this screen's accent, used identically for the
// comparison illustration, the selected-card tint, and the jar fill.
const TEAL = "#1D9E75";

export type RoutinePresetId = "teeth" | "drink" | "lunch";

export interface RoutineChoice {
  /** null means a custom routine — see customText instead. */
  presetId: RoutinePresetId | null;
  customText: string;
}

export interface RoutineJarState {
  /** null until step 2 is completed. */
  routine: RoutineChoice | null;
  loggedDates: string[];
}

const EMPTY_STATE: RoutineJarState = { routine: null, loggedDates: [] };

const ROUTINE_PRESETS: { id: RoutinePresetId; cardLabel: string; captionPhrase: string }[] = [
  { id: "teeth", cardLabel: "After brushing my teeth", captionPhrase: "brushing your teeth" },
  { id: "drink", cardLabel: "With my morning tea or coffee", captionPhrase: "your morning tea or coffee" },
  { id: "lunch", cardLabel: "After lunch", captionPhrase: "lunch" },
];

function getCaptionPhrase(routine: RoutineChoice): string {
  if (routine.presetId) {
    return ROUTINE_PRESETS.find((p) => p.id === routine.presetId)?.captionPhrase ?? "";
  }
  return routine.customText;
}

// B3's routine step links to this when the user picks "right after my
// medicine" instead of treating it as an unrelated, separately-stored
// anchor. Reads live from storage (not a cached copy) so a later change to
// the B1 anchor is reflected immediately. Returns null if B1 hasn't been
// set up yet.
export function getLinkedMedicineAnchorPhrase(): string | null {
  const stored = readJSON(STORAGE_KEY, EMPTY_STATE);
  return stored.routine ? getCaptionPhrase(stored.routine) : null;
}

interface RoutineJarScreenProps {
  /** Dev-preview only: skips localStorage and starts from this state instead. */
  initialState?: RoutineJarState;
  /** Dev-preview only: when false, taps update the in-memory preview state without touching real localStorage. Defaults to true. */
  persistToStorage?: boolean;
}

// B1 — routine & recall, as a 3-step guided flow: why linking to a routine
// works, picking that routine, then the ongoing jar. Steps 1-2 are one-time
// setup; a returning visit (routine already chosen) skips straight to the
// jar in step 3, though Back still reaches steps 1-2 to change it.
export function RoutineJarScreen({ initialState, persistToStorage = true }: RoutineJarScreenProps = {}) {
  const [state, setState] = useState<RoutineJarState | null>(initialState ?? null);
  const [step, setStep] = useState(() => (initialState?.routine ? 2 : 0));

  const [selectedPresetId, setSelectedPresetId] = useState<RoutinePresetId | "custom" | null>(null);
  const [customText, setCustomText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialState) return;
    const loaded = readJSON(STORAGE_KEY, EMPTY_STATE);
    setState(loaded);
    setStep(loaded.routine ? 2 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seed step 2's local selection UI from whatever's already persisted, so
  // pressing Back to revise a choice doesn't start from a blank slate.
  useEffect(() => {
    const routine = state?.routine;
    if (!routine) return;
    if (routine.presetId) {
      setSelectedPresetId(routine.presetId);
    } else {
      setSelectedPresetId("custom");
      setCustomText(routine.customText);
    }
  }, [state?.routine]);

  function persist(update: (prev: RoutineJarState) => RoutineJarState) {
    setState((prev) => {
      if (!prev) return prev;
      const next = update(prev);
      if (persistToStorage) writeJSON(STORAGE_KEY, next);
      return next;
    });
  }

  function selectCard(id: RoutinePresetId | "custom") {
    setSelectedPresetId(id);
    setValidationError(null);
  }

  function handleCustomTextChange(value: string) {
    setCustomText(value);
    if (value.trim()) setValidationError(null);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleStep2Next() {
    if (!selectedPresetId || (selectedPresetId === "custom" && !customText.trim())) {
      setValidationError("Choose one to continue.");
      return;
    }
    const routine: RoutineChoice =
      selectedPresetId === "custom" ? { presetId: null, customText: customText.trim() } : { presetId: selectedPresetId, customText: "" };
    persist((prev) => ({ ...prev, routine }));
    setValidationError(null);
    setStep(2);
  }

  function logToday() {
    const today = dateKey();
    persist((prev) => (prev.loggedDates.includes(today) ? prev : { ...prev, loggedDates: [...prev.loggedDates, today] }));
  }

  if (!state) {
    return (
      <SupportScreenLayout>
        <div aria-hidden="true" />
      </SupportScreenLayout>
    );
  }

  return (
    <SupportScreenLayout>
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
          {step === 1 && (
            <Step2
              selectedPresetId={selectedPresetId}
              customText={customText}
              validationError={validationError}
              onSelectCard={selectCard}
              onCustomTextChange={handleCustomTextChange}
            />
          )}
          {step === 2 && state.routine && <Step3 routine={state.routine} loggedDates={state.loggedDates} onLogToday={logToday} />}
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
            onClick={handleStep2Next}
            className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
          >
            Next
          </button>
        )}
      </div>
    </SupportScreenLayout>
  );
}

function Step1() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Why link it to a routine</h1>

      <motion.svg
        viewBox="0 0 320 130"
        className="w-full"
        role="img"
        aria-label="Comparing trying to just remember with linking a habit to something you already do"
        variants={staggerContainer}
      >
        <motion.circle cx="80" cy="55" r="28" fill="none" stroke="#a9bdb0" strokeWidth="3" strokeDasharray="6 6" variants={fadeSlideVariants} />
        <motion.text x="80" y="64" textAnchor="middle" className="fill-sage-400 text-[22px] font-medium" variants={fadeSlideVariants}>
          ?
        </motion.text>
        <motion.text x="80" y="106" textAnchor="middle" className="fill-sage-500 text-[11px]" variants={fadeSlideVariants}>
          just remembering
        </motion.text>

        <motion.line x1="205" y1="55" x2="235" y2="55" stroke={TEAL} strokeWidth="3" variants={fadeSlideVariants} />
        <motion.circle cx="205" cy="55" r="14" fill={TEAL} variants={fadeSlideVariants} />
        <motion.circle cx="235" cy="55" r="14" fill={TEAL} variants={fadeSlideVariants} />
        <motion.text x="220" y="106" textAnchor="middle" className="fill-sage-500 text-[11px]" variants={fadeSlideVariants}>
          linked to a routine
        </motion.text>
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        Trying to just remember rarely works, there&apos;s a lot going on in a day. But linking a
        new habit to something you already do without thinking, like brushing your teeth or
        making tea, makes it far more likely to stick.
      </p>
    </div>
  );
}

interface Step2Props {
  selectedPresetId: RoutinePresetId | "custom" | null;
  customText: string;
  validationError: string | null;
  onSelectCard: (id: RoutinePresetId | "custom") => void;
  onCustomTextChange: (value: string) => void;
}

function Step2({ selectedPresetId, customText, validationError, onSelectCard, onCustomTextChange }: Step2Props) {
  return (
    <motion.div className="flex flex-col gap-5" variants={staggerContainer}>
      <motion.h1 variants={fadeSlideVariants} className="text-xl font-semibold leading-snug text-sage-900">
        When would you like to take your medicine?
      </motion.h1>

      <div className="flex flex-col gap-2.5">
        {ROUTINE_PRESETS.map((preset) => (
          <SelectableCard key={preset.id} label={preset.cardLabel} selected={selectedPresetId === preset.id} onClick={() => onSelectCard(preset.id)} />
        ))}
        <SelectableCard label="Something else" selected={selectedPresetId === "custom"} onClick={() => onSelectCard("custom")} />

        {selectedPresetId === "custom" && (
          <motion.input
            variants={fadeSlideVariants}
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="e.g. feeding the dog"
            autoFocus
            className="rounded-2xl border border-sage-200 bg-white px-4 py-3 text-[15px] text-sage-800 outline-none focus:border-sage-400"
          />
        )}
      </div>

      {validationError && <ValidationError message={validationError} />}
    </motion.div>
  );
}

interface Step3Props {
  routine: RoutineChoice;
  loggedDates: string[];
  onLogToday: () => void;
}

function Step3({ routine, loggedDates, onLogToday }: Step3Props) {
  const loggedToday = loggedDates.includes(dateKey());
  const fillPercent = Math.min(1, loggedDates.length / JAR_MILESTONE_DAYS);
  const phrase = getCaptionPhrase(routine);

  return (
    <motion.div className="flex flex-col gap-5" variants={staggerContainer}>
      <motion.p variants={fadeSlideVariants} className="text-[15px] leading-relaxed text-sage-700">
        Right after {phrase}, take your medicine. Then come back here and tap the jar.
      </motion.p>

      <motion.div variants={fadeSlideVariants}>
        <JarIllustration fillPercent={fillPercent} />
      </motion.div>

      <motion.p variants={fadeSlideVariants} className="text-center text-[15px] text-sage-700">
        {loggedDates.length} {loggedDates.length === 1 ? "day" : "days"} logged
      </motion.p>

      <motion.div variants={fadeSlideVariants}>
        {loggedToday ? (
          <p className="text-center text-[15px] font-medium text-sage-700">Logged. See you tomorrow.</p>
        ) : (
          <button
            type="button"
            onClick={onLogToday}
            className="w-full rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
          >
            I took it, tap the jar
          </button>
        )}
      </motion.div>

      <motion.p variants={fadeSlideVariants} className="text-center text-sm leading-relaxed text-sage-500">
        Each day adds a little more. It never resets if you miss one.
      </motion.p>
    </motion.div>
  );
}

function JarIllustration({ fillPercent }: { fillPercent: number }) {
  const bodyTop = 30;
  const bodyHeight = 160;
  const fillHeight = bodyHeight * fillPercent;
  const fillY = bodyTop + (bodyHeight - fillHeight);

  return (
    <svg
      viewBox="0 0 160 200"
      className="mx-auto h-44 w-auto"
      role="img"
      aria-label={`Jar ${Math.round(fillPercent * 100)} percent full`}
    >
      <defs>
        <clipPath id="jarBodyClip">
          <rect x="20" y={bodyTop} width="120" height={bodyHeight} rx="16" />
        </clipPath>
      </defs>
      <rect x="20" y={bodyTop} width="120" height={bodyHeight} rx="16" className="fill-sage-50" />
      <g clipPath="url(#jarBodyClip)">
        <rect x="20" y={fillY} width="120" height={fillHeight} fill={TEAL} className="transition-[y,height] duration-[600ms] ease-in-out" />
      </g>
      <rect x="20" y={bodyTop} width="120" height={bodyHeight} rx="16" fill="none" className="stroke-sage-300" strokeWidth="4" />
      <rect x="55" y="10" width="50" height="24" rx="6" fill="none" className="stroke-sage-300" strokeWidth="4" />
    </svg>
  );
}
