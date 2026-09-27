"use client";

import { useState } from "react";
import { faqs } from "../lib/faqs";
import { ChevronDownIcon } from "./icons";

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
    <div className="glass divide-y divide-white/[.08] rounded-card px-5 sm:px-8">
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
                className="group flex w-full items-center justify-between gap-4 rounded py-5 text-left text-lg font-semibold text-offwhite transition-colors hover:text-accent-light"
              >
                {question}
                <span
                  aria-hidden="true"
                  className={`grid size-8 flex-shrink-0 place-items-center rounded-full border transition-colors ${
                    isOpen ? "border-accent/50 bg-accent/10 text-accent-light" : "border-white/15 text-dusk group-hover:text-accent-light"
                  }`}
                >
                  <ChevronDownIcon className={`size-4 motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
            </h3>
            {/* 0fr -> 1fr grid rows animate to the content's natural height without
                measuring it in JS. visibility rides the same transition so collapsed
                answers leave the accessibility tree once the animation finishes. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid overflow-hidden motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-[220ms] motion-safe:ease-out ${
                isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0">
                <p className="pb-6 pr-10 leading-relaxed text-haze">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
