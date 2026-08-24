"use client";

import { motion, type Variants } from "framer-motion";

// Shared building blocks for every multi-step guided support screen (A1+A4
// combined, B1, and any future ones) so they share one consistent
// navigation feel rather than each reimplementing it slightly differently.

// Entrance animation for elements positioned via plain SVG attributes
// (cx/cy, x/y) — safe to slide in via a CSS transform, since there's no
// competing `transform` attribute for the animation to clobber.
export const fadeSlideVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Entrance animation for elements positioned via a `transform="translate(x,y)"`
// attribute. Framer Motion animates via the CSS `transform` property, which
// on SVG elements *replaces* the `transform` attribute's value rather than
// combining with it — animating x/y/scale here would snap the element to
// the wrong spot the instant the animation starts. Opacity has no such
// conflict, so it's the only safe entrance animation for these elements.
export const fadeOnlyVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

// The cross-fade wrapper should be the only element in a step's tree that
// declares its own initial/animate/exit. Everything nested inside should
// only declare `variants` and inherit the current "hidden"/"visible" state
// from this ancestor — nesting a second independent initial/animate pair
// inside an AnimatePresence-controlled element causes the outer fade to get
// stuck at opacity 0 (hit this exact bug prototyping the first guided screen).
export const stepTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const STEP_CROSS_FADE_TRANSITION = { duration: 0.2, ease: "easeInOut" as const };

export function StepDots({ step, count }: { step: number; count: number }) {
  return (
    <div className="flex justify-center gap-2 py-2" role="tablist" aria-label="Step progress">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          role="tab"
          aria-selected={i === step}
          className={`rounded-full transition-all duration-300 ${
            i === step ? "h-2.5 w-2.5 bg-sage-800" : "h-2 w-2 bg-sage-200"
          }`}
        />
      ))}
    </div>
  );
}

// Single-select card used across guided flows (B1's routine picker, B3's
// routine picker) — teal selected-state border/tint (#1D9E75), matching
// every screen's selection accent so far. Shared so the two pickers never
// drift apart visually.
export function SelectableCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      variants={fadeSlideVariants}
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        selected ? "border-[#1D9E75] bg-[#1D9E75]/10 text-sage-900" : "border-sage-200 bg-white text-sage-800 hover:border-sage-300 hover:bg-sage-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#1D9E75] bg-[#1D9E75]" : "border-sage-300 bg-white"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        <span className="text-[15px] leading-snug">{label}</span>
      </div>
    </motion.button>
  );
}

// Inline validation message for guided-flow steps that require a selection
// before advancing (e.g. "Choose one to continue."). Uses --text-danger,
// defined in globals.css, so it's visually distinct from the amber
// "worth noting, not alarming" accents used elsewhere.
export function ValidationError({ message }: { message: string }) {
  return (
    <motion.p variants={fadeSlideVariants} className="text-sm font-medium" style={{ color: "var(--text-danger)" }}>
      {message}
    </motion.p>
  );
}
