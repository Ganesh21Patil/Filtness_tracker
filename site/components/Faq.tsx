"use client";

import { useState } from "react";
import { faqs } from "../lib/faqs";

export default function Faq() {
  // First question open by default so the pattern is obvious; multiple can be open.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="mt-12 divide-y divide-[#e2deeb] border-y border-[#e2deeb]">
      {faqs.map(([question, answer], i) => {
        const isOpen = open.has(i);
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-inktext transition-colors hover:text-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {question}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={`size-5 flex-shrink-0 text-accent-deep motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </h3>
            {/* 0fr -> 1fr grid rows animate to the content's natural height without
                measuring it in JS. visibility rides the same transition so collapsed
                answers leave the accessibility tree once the animation finishes. */}
            <div
              id={panelId}
              className={`grid overflow-hidden motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-[220ms] motion-safe:ease-out ${
                isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0">
                <p className="pb-6 pr-8 leading-relaxed text-[#413d57]">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
