"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

type Confidence = "weak" | "medium" | "strong";

export type OptionsModalItem = {
  question: string;
  options: string[];
  recommendedIndex: number | null;
  confidence: Confidence;
};

type OptionsModalProps = {
  open: boolean;
  title: string;
  items: OptionsModalItem[];
  onClose: () => void;
  onSubmit: (selectedIndices: Array<number | null>, otherTexts: string[]) => void;
};

const confidenceColors: Record<Confidence, string> = {
  weak: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  medium: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  strong: "border-blue-400/30 bg-blue-400/10 text-blue-300",
};

export function OptionsModal({
  open,
  title,
  items,
  onClose,
  onSubmit,
}: OptionsModalProps) {
  const initialSelections = useMemo(
    () =>
      items.map((item) =>
        typeof item.recommendedIndex === "number" &&
        item.recommendedIndex >= 0 &&
        item.recommendedIndex < item.options.length
          ? item.recommendedIndex
          : null
      ),
    [items]
  );

  const [selectedIndices, setSelectedIndices] = useState<Array<number | null>>(
    initialSelections
  );
  // Track "Other" text per question (-1 means "Other" is selected)
  const [otherTexts, setOtherTexts] = useState<string[]>(() => items.map(() => ""));

  useEffect(() => {
    if (!open) return;
    setSelectedIndices(initialSelections);
    setOtherTexts(items.map(() => ""));
  }, [initialSelections, open, items]);

  if (!open) return null;

  const hasAnySelection = selectedIndices.some(
    (idx) => typeof idx === "number"
  ) || otherTexts.some((t) => t.trim().length > 0);

  const answeredCount = selectedIndices.filter((idx, i) =>
    typeof idx === "number" || otherTexts[i]?.trim()
  ).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-950/95 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xs font-mono text-accent uppercase tracking-widest mb-1">
                Research Analysis • Select Options
              </div>
              <div className="text-lg font-bold text-white">{title}</div>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <span className="text-xs font-mono text-zinc-400">{answeredCount}</span>
              <span className="text-xs text-zinc-600">/</span>
              <span className="text-xs font-mono text-zinc-500">{items.length}</span>
              <span className="text-xs text-zinc-600">answered</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-5">
            {items.map((item, itemIndex) => {
              const isAnswered = typeof selectedIndices[itemIndex] === "number";
              // Use 2 columns if all options are short enough
              const useGrid = item.options.every((o) => o.length < 60) && item.options.length >= 3;

              return (
                <div
                  key={`${itemIndex}-${item.question}`}
                  className={`border bg-zinc-950 p-5 transition-colors ${
                    isAnswered ? "border-emerald-500/20" : "border-zinc-800"
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-accent">
                      {itemIndex + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white leading-relaxed">
                        {item.question}
                      </div>
                    </div>
                    {isAnswered && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Options */}
                  <div
                    role="group"
                    aria-label={`Options for ${item.question}`}
                    className={useGrid ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 gap-2"}
                  >
                    {item.options.map((option, optionIndex) => {
                      const isSelected = selectedIndices[itemIndex] === optionIndex;
                      const isRecommended = item.recommendedIndex === optionIndex;
                      return (
                        <button
                          key={`${optionIndex}-${option}`}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedIndices((prev) => {
                              const next = [...prev];
                              next[itemIndex] =
                                prev[itemIndex] === optionIndex ? null : optionIndex;
                              return next;
                            });
                          }}
                          className={[
                            "w-full text-left border px-3 py-2.5 text-sm transition-all",
                            "focus:outline-none focus:ring-2 focus:ring-zinc-300/30",
                            isSelected
                              ? "border-accent/50 bg-accent/10 text-white ring-1 ring-accent/20"
                              : isRecommended
                                ? "border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800/50 text-zinc-200"
                                : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 text-zinc-300",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex-1">{option}</span>
                            {isRecommended && (
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider flex-shrink-0 ${confidenceColors[item.confidence]}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                {item.confidence}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Other: free-text option */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndices((prev) => {
                          const next = [...prev];
                          next[itemIndex] = prev[itemIndex] === -1 ? null : -1;
                          return next;
                        });
                      }}
                      className={[
                        "w-full text-left border px-3 py-2.5 text-sm transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-zinc-300/30",
                        selectedIndices[itemIndex] === -1
                          ? "border-accent/50 bg-accent/10 text-white ring-1 ring-accent/20"
                          : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 text-zinc-400 italic",
                      ].join(" ")}
                    >
                      Other...
                    </button>
                    {selectedIndices[itemIndex] === -1 && (
                      <input
                        type="text"
                        autoFocus
                        value={otherTexts[itemIndex] || ""}
                        onChange={(e) => {
                          setOtherTexts((prev) => {
                            const next = [...prev];
                            next[itemIndex] = e.target.value;
                            return next;
                          });
                        }}
                        placeholder="Type your answer..."
                        className="w-full mt-2 px-3 py-2.5 bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:outline-none focus:border-accent placeholder:text-zinc-600"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 bg-zinc-950/95 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="text-xs text-zinc-500 font-mono">
              Select one option per question. Unanswered questions will be skipped.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 text-sm font-mono hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => onSubmit(selectedIndices, otherTexts)}
                disabled={!hasAnySelection}
                className="px-6 py-2 bg-accent text-zinc-950 text-sm font-mono font-bold hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit {answeredCount > 0 ? `(${answeredCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
