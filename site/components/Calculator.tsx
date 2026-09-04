"use client";

import React, { useMemo, useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus, TAX_CONFIG } from "../lib/calculator";

const inputBaseClass =
  "w-full rounded-xl border border-[#e2deeb] bg-white p-4 min-h-[44px] text-[17px] font-medium text-[#17162a] transition-colors focus:outline-none focus:border-violet-focus focus:ring-2 focus:ring-violet-focus/15";

export default function Calculator() {
  const [inputs, setInputs] = useState<TaxInputs>({
    filingStatus: "single",
    w2Wages: 0,
    w2Withheld: 0,
    gross1099: 0,
    deductions: {
      certs: 0,
      liabilityIns: 0,
      gymRent: 0,
      equipment: 0,
      software: 0,
      mileage: 0,
      apparel: 0,
      marketing: 0,
      homeOffice: 0,
      other: 0,
    },
  });

  // Tracks which fields the user just tried to enter a negative value into,
  // so we can surface a message instead of silently clamping to 0.
  const [fieldWarnings, setFieldWarnings] = useState<Record<string, string>>({});

  const sanitizeNumber = (val: any) => {
    const num = Number(val);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const setWarning = (key: string, raw: any) => {
    const num = Number(raw);
    setFieldWarnings((prev) => {
      const next = { ...prev };
      if (raw !== "" && (isNaN(num) || num < 0)) {
        next[key] = "Can't be negative — using $0";
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const handleInputChange = (field: keyof TaxInputs, value: any) => {
    if (field !== "filingStatus") setWarning(field, value);
    const finalValue = field === "filingStatus" ? value : sanitizeNumber(value);
    setInputs((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleDeductionChange = (field: keyof TaxInputs["deductions"], value: any) => {
    setWarning(`deductions.${field}`, value);
    setInputs((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [field]: sanitizeNumber(value) },
    }));
  };

  const results = useMemo(() => calculateTaxes(inputs), [inputs]);
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const deductionsSum = useMemo(() => {
    const d = inputs.deductions;
    return (
      d.certs +
      d.liabilityIns +
      d.gymRent +
      d.equipment +
      d.software +
      d.mileage * TAX_CONFIG.MILEAGE_RATE +
      d.apparel +
      d.marketing +
      d.homeOffice +
      d.other
    );
  }, [inputs.deductions]);

  const hasIncome = inputs.gross1099 > 0 || inputs.w2Wages > 0;
  const deductionsExceedIncome = inputs.gross1099 > 0 && deductionsSum > inputs.gross1099;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      {/* Form */}
      <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(31,25,74,.1)] md:p-9 space-y-9">
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-semibold text-[#17162a] mb-4">1. The basics</h2>
          <div>
            <label htmlFor="filingStatus" className="block text-[13px] font-semibold text-[#413d57] mb-2">
              Filing status
            </label>
            <select
              id="filingStatus"
              value={inputs.filingStatus}
              onChange={(e) => handleInputChange("filingStatus", e.target.value as FilingStatus)}
              className={inputBaseClass}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
        </section>

        {/* W-2 + 1099 income */}
        <section>
          <h2 className="text-lg font-semibold text-[#17162a] mb-1">2. Your income</h2>
          <p className="text-sm text-[#66617a] mb-4">If you're an employee at a gym, add your W-2 wages too. If you're 100% independent, leave that at 0.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="w2Wages" className="block text-[13px] font-semibold text-[#413d57] mb-2">Annual W-2 wages</label>
              <input
                id="w2Wages"
                type="number"
                min="0"
                value={inputs.w2Wages || ""}
                onChange={(e) => handleInputChange("w2Wages", e.target.value)}
                className={inputBaseClass}
                placeholder="0"
                aria-describedby={fieldWarnings.w2Wages ? "w2Wages-warning" : undefined}
              />
              {fieldWarnings.w2Wages && (
                <p id="w2Wages-warning" role="alert" className="text-xs text-red-600 mt-1.5">{fieldWarnings.w2Wages}</p>
              )}
            </div>
            <div>
              <label htmlFor="gross1099" className="block text-[13px] font-semibold text-[#413d57] mb-2">Gross training income</label>
              <input
                id="gross1099"
                type="number"
                min="0"
                value={inputs.gross1099 || ""}
                onChange={(e) => handleInputChange("gross1099", e.target.value)}
                className={inputBaseClass}
                placeholder="0"
                aria-describedby={fieldWarnings.gross1099 ? "gross1099-warning" : undefined}
              />
              {fieldWarnings.gross1099 && (
                <p id="gross1099-warning" role="alert" className="text-xs text-red-600 mt-1.5">{fieldWarnings.gross1099}</p>
              )}
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="w2Withheld" className="block text-[13px] font-semibold text-[#413d57] mb-2">Tax already withheld from W-2</label>
            <input
              id="w2Withheld"
              type="number"
              min="0"
              value={inputs.w2Withheld || ""}
              onChange={(e) => handleInputChange("w2Withheld", e.target.value)}
              className={inputBaseClass + " sm:max-w-[240px]"}
              placeholder="0"
              aria-describedby={fieldWarnings.w2Withheld ? "w2Withheld-warning" : undefined}
            />
            {fieldWarnings.w2Withheld && (
              <p id="w2Withheld-warning" role="alert" className="text-xs text-red-600 mt-1.5">{fieldWarnings.w2Withheld}</p>
            )}
          </div>
        </section>

        {/* Deductions */}
        <section id="deductions" className="border-t border-[#e9e6f1] pt-7 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xl font-semibold text-[#17162a]">Did you deduct these?</p>
              <p className="mt-1 text-sm text-[#66617a]">Most trainers miss at least one.</p>
            </div>
            <p className="text-sm font-semibold text-violet-text whitespace-nowrap">{money(deductionsSum)} found</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DeductionInput
              id="deduction-certs"
              label="Certifications & CEUs"
              hint="NASM, ACE, renewals"
              value={inputs.deductions.certs}
              onChange={(v) => handleDeductionChange("certs", v)}
              warning={fieldWarnings["deductions.certs"]}
              tooltipText="Professional certifications, continuing education, and training expenses may qualify when they are related to maintaining or improving your current business skills. Eligibility depends on your situation."
            />
            <DeductionInput
              id="deduction-liabilityIns"
              label="Liability insurance"
              hint="Most trainers pay $150–$300/yr"
              value={inputs.deductions.liabilityIns}
              onChange={(v) => handleDeductionChange("liabilityIns", v)}
              warning={fieldWarnings["deductions.liabilityIns"]}
              tooltipText="Business liability insurance used to protect your training business may generally qualify as a business expense."
            />
            <DeductionInput
              id="deduction-gymRent"
              label="Gym rental / revenue split"
              hint="Booth fees or studio split"
              value={inputs.deductions.gymRent}
              onChange={(v) => handleDeductionChange("gymRent", v)}
              warning={fieldWarnings["deductions.gymRent"]}
              tooltipText="Include the portion of gym or studio rental costs you pay to operate your training business."
            />
            <DeductionInput
              id="deduction-equipment"
              label="Equipment"
              hint="Weights, bands, wearables"
              value={inputs.deductions.equipment}
              onChange={(v) => handleDeductionChange("equipment", v)}
              warning={fieldWarnings["deductions.equipment"]}
              tooltipText="Business-use equipment such as weights, resistance bands, mats, or other training gear may qualify. Keep records showing business use."
            />
            <DeductionInput
              id="deduction-software"
              label="Coaching software & apps"
              hint="Trainerize, Zoom, payment fees"
              value={inputs.deductions.software}
              onChange={(v) => handleDeductionChange("software", v)}
              warning={fieldWarnings["deductions.software"]}
              tooltipText="Software used to run or support your training business may qualify, such as scheduling, client-management, programming, or coaching platforms."
            />
            <DeductionInput
              id="deduction-mileage"
              label="Business mileage"
              hint="Between client locations"
              value={inputs.deductions.mileage}
              onChange={(v) => handleDeductionChange("mileage", v)}
              warning={fieldWarnings["deductions.mileage"]}
              prefix="miles"
              tooltipText="Generally, include qualifying business miles such as travel between clients or to off-site training locations. Normal commuting may not qualify."
              learnMoreLink="/guides/personal-trainer-tax-deductions#mileage"
            />
            <DeductionInput
              id="deduction-apparel"
              label="Branded apparel"
              hint="Only clothing with your logo"
              value={inputs.deductions.apparel}
              onChange={(v) => handleDeductionChange("apparel", v)}
              warning={fieldWarnings["deductions.apparel"]}
            />
            <DeductionInput
              id="deduction-marketing"
              label="Marketing"
              hint="Hosting, ads, business cards"
              value={inputs.deductions.marketing}
              onChange={(v) => handleDeductionChange("marketing", v)}
              warning={fieldWarnings["deductions.marketing"]}
            />
            <DeductionInput
              id="deduction-homeOffice"
              label="Home office deduction"
              hint="Simplified sq-footage estimate"
              value={inputs.deductions.homeOffice}
              onChange={(v) => handleDeductionChange("homeOffice", v)}
              warning={fieldWarnings["deductions.homeOffice"]}
            />
            <DeductionInput
              id="deduction-other"
              label="Other expenses"
              hint="Miscellaneous business costs"
              value={inputs.deductions.other}
              onChange={(v) => handleDeductionChange("other", v)}
              warning={fieldWarnings["deductions.other"]}
            />
          </div>
        </section>

        {/* Placeholder Ad Slot (for future AdSense) */}
        <div className="w-full p-4 border-2 border-dashed border-[#e2deeb] bg-[#faf9f7] text-center rounded-xl flex items-center justify-center min-h-[100px]">
          <span className="text-[#a29cb3] text-sm font-medium">Advertisement Slot (Future)</span>
        </div>
      </div>

      {/* Results */}
      <aside className="relative overflow-hidden rounded-[28px] bg-deep p-7 text-white md:p-9 lg:sticky lg:top-6">
        <div className="pointer-events-none absolute -right-20 -top-16 size-64 rounded-full bg-violet-soft/40 blur-3xl" />
        <div className="relative flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-accent-light">Your tax estimate</p>
            <InfoTooltip label="What is SE tax?" text="Self-employment (SE) tax covers Social Security and Medicare — the share normally split between an employer and employee, but paid entirely by you when you're self-employed." />
          </div>

          {!hasIncome ? (
            <EmptyResultsState />
          ) : (
            <div aria-live="polite" className="flex flex-1 flex-col">
              {deductionsExceedIncome && (
                <div className="mt-6 flex items-start gap-2 rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-200">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span>
                    Your deductions ({money(deductionsSum)}) exceed your gross training income. Double-check your numbers — profit below $0 is shown as $0.
                  </span>
                </div>
              )}

              <p key={results.totalLiability} className="value-pop mt-8 font-serif text-6xl md:text-7xl tracking-[-.06em] tabular-nums">
                {money(results.totalLiability)}
              </p>
              <p className="mt-2 text-sm text-[#cac7e6]">Estimated combined federal and self-employment tax</p>

              <div className="mt-8 space-y-3.5 border-y border-white/15 py-6 text-sm">
                <ResultRow label="Net self-employment profit" value={results.netSeProfit} />
                <ResultRow label="Total SE tax" value={results.seTax.total} />
                <ResultRow label="Federal income tax" value={results.federalTax} accent />
                {inputs.w2Withheld > 0 && <ResultRow label="W-2 tax already withheld" value={-inputs.w2Withheld} />}
                <ResultRow label="Estimated amount owed" value={results.amountOwed} bold />
              </div>

              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[.18em] text-[#a9dff4] font-semibold">Quarterly payment</p>
                <p key={results.quarterlyPayment} className="value-pop mt-1 text-3xl font-semibold tabular-nums">{money(results.quarterlyPayment)}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#cac7e6]">
                  <span className="rounded bg-white/10 px-2 py-1">Apr 15</span>
                  <span className="rounded bg-white/10 px-2 py-1">Jun 15</span>
                  <span className="rounded bg-white/10 px-2 py-1">Sep 15</span>
                  <span className="rounded bg-white/10 px-2 py-1">Jan 15</span>
                </div>
              </div>

              {/* TODO: Downloadable quarterly payment calendar feature stub */}
              <button type="button" className="mt-8 w-full rounded-full bg-accent py-4 font-semibold text-[#121127] transition hover:bg-white">
                Download calendar (.ics) — coming soon
              </button>

              {/* TODO: LLC vs S-Corp savings indicator feature stub */}
              {results.netSeProfit > 80000 && (
                <p className="mt-4 text-xs text-center text-[#cac7e6]">
                  💡 You're earning enough that an S-Corp might save you money. (Comparison coming soon)
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-[#a7a2c8]">
            For planning purposes only — not formal tax or legal advice.
          </p>
        </div>
      </aside>
    </div>
  );
}

function EmptyResultsState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center py-8">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-accent-light">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <p className="text-white font-semibold mb-1">Your estimate will appear here</p>
      <p className="text-sm text-[#a7a2c8] max-w-[240px]">Enter your W-2 wages or gross training income on the left to see your tax breakdown and quarterly payments.</p>
    </div>
  );
}

function InfoTooltip({ label, text }: { label: string; text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-[#a7a2c8] hover:text-accent-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full p-1.5 transition-colors"
        aria-label={label}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      {show && (
        <div className="absolute z-50 w-56 p-3 mt-2 text-xs leading-relaxed text-[#413d57] bg-white border border-[#e7e3ee] rounded-lg shadow-lg right-0">
          {text}
        </div>
      )}
    </div>
  );
}

function DeductionInput({
  id,
  label,
  hint,
  value,
  onChange,
  prefix = "$",
  tooltipText,
  learnMoreLink,
  warning,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (val: any) => void;
  prefix?: string;
  tooltipText?: string;
  learnMoreLink?: string;
  warning?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex min-h-[84px] items-center justify-between gap-3 rounded-[14px] border border-[#e7e3ee] p-3.5 transition hover:border-violet-lighter hover:-translate-y-0.5 relative group">
      <div className="flex flex-1 items-start gap-2">
        <div className="flex-1">
          <label htmlFor={id} className="block text-[13px] font-semibold text-[#17162a]">{label}</label>
          <p className="mt-0.5 text-[11px] leading-tight text-[#777287]">{hint}</p>
        </div>
        {tooltipText && (
          <div
            className="relative flex-shrink-0"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-[#a29cb3] hover:text-violet-focus focus:outline-none focus-visible:ring-2 focus-visible:ring-accent p-1.5 rounded-full transition-colors"
              aria-label={`More information about ${label}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>

            {showTooltip && (
              <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-[#413d57] bg-white border border-[#e7e3ee] rounded-lg shadow-lg right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
                <p className="leading-relaxed">{tooltipText}</p>
                {learnMoreLink && (
                  <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-semibold text-violet-focus hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                    Learn more &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="flex items-baseline gap-1 border-b border-[#ddd9e7] pb-1 min-h-[44px] items-center">
          {prefix === "$" && <span className="text-[#a29cb3] text-sm">$</span>}
          <input
            id={id}
            type="number"
            min="0"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 bg-transparent text-right font-semibold text-violet-focus outline-none"
            placeholder="0"
            aria-describedby={warning ? `${id}-warning` : undefined}
          />
          {prefix !== "$" && <span className="text-[#a29cb3] text-xs">{prefix}</span>}
        </div>
        {warning && (
          <p id={`${id}-warning`} role="alert" className="text-[10px] text-red-600 mt-1">{warning}</p>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, bold, accent }: { label: string; value: number; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-[#bab6d7]">{label}</span>
      <span key={value} className={`value-pop tabular-nums ${bold ? "font-semibold text-white" : accent ? "text-[#66d8f1] font-semibold" : "font-medium text-[#e5e3f5]"}`}>
        {value < 0 ? "− " : ""}
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(value))}
      </span>
    </div>
  );
}
