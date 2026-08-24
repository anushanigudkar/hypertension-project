"use client";

import { useRef } from "react";
import { ScalePoint } from "@/types/questionnaire";

interface LikertSliderProps {
  points: ScalePoint[];
  value: number | undefined;
  onChange: (value: number) => void;
}

// Custom 5-point discrete slider (not a native <input type="range">, which
// always paints a thumb at some position — usually the midpoint — even with
// no value set, which would visually bias toward "Neutral"). Nothing renders
// as selected until the user actively drags or taps a position.
export function LikertSlider({ points, value, onChange }: LikertSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = points.length;
  const selectedIndex = value === undefined ? -1 : points.findIndex((p) => p.value === value);

  // Dot centers sit at the midpoint of each equal-width grid column.
  const centerPercent = (index: number) => ((index + 0.5) / count) * 100;
  const trackStart = centerPercent(0);
  const trackEnd = centerPercent(count - 1);

  function indexFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const fraction = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
    const clamped = Math.min(0.999999, Math.max(0, fraction));
    return Math.floor(clamped * count);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture can fail in some browsers/edge cases; the tap/drag itself
      // still works via bubbling pointer events, so this is safe to ignore.
    }
    onChange(points[indexFromClientX(event.clientX)].value);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons === 0) return;
    onChange(points[indexFromClientX(event.clientX)].value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const current = selectedIndex === -1 ? 0 : selectedIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(points[Math.min(count - 1, current + 1)].value);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(points[Math.max(0, current - 1)].value);
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(points[0].value);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(points[count - 1].value);
    }
  }

  return (
    <div className="flex flex-col gap-3 select-none">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={points[0].value}
        aria-valuemax={points[count - 1].value}
        aria-valuenow={value}
        aria-valuetext={selectedIndex === -1 ? "No answer selected yet" : points[selectedIndex].label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        className="touch-none rounded-xl py-1 outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
      >
        <div className="relative flex h-5 items-center">
          <div
            className="pointer-events-none absolute h-1 -translate-y-1/2 rounded-full bg-sage-200"
            style={{ left: `${trackStart}%`, width: `${trackEnd - trackStart}%` }}
          />
          {selectedIndex !== -1 && (
            <div
              className="pointer-events-none absolute h-1 -translate-y-1/2 rounded-full bg-sage-500 transition-[width] duration-150 ease-out"
              style={{ left: `${trackStart}%`, width: `${centerPercent(selectedIndex) - trackStart}%` }}
            />
          )}
          <div className="relative grid w-full" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {points.map((point, index) => (
              <div key={point.value} className="flex items-center justify-center">
                <span
                  className={`pointer-events-none h-5 w-5 rounded-full border-2 transition-all ${
                    index === selectedIndex
                      ? "scale-110 border-sage-600 bg-sage-600"
                      : "border-sage-300 bg-white"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {points.map((point, index) => (
            <span
              key={point.value}
              className={`pointer-events-none px-0.5 text-center text-[11px] leading-tight transition-colors ${
                index === selectedIndex ? "font-medium text-sage-700" : "text-sage-500"
              }`}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>

      {selectedIndex === -1 && (
        <p className="text-xs text-sage-400">Tap a point or drag along the line to answer.</p>
      )}
    </div>
  );
}
