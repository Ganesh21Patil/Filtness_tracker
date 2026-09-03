"use client";

import React, { useMemo, useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus, TAX_CONFIG } from "../lib/calculator";

const inputBaseClass =
  "w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 border p-3 min-h-[44px] text-dark transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40";

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
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Left Column: Form Inputs */}
      <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Basic Info */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. The Basics</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filing Status
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
          </div>
        </section>

        {/* W-2 Income */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. W-2 Income (Gym Paycheck)</h2>
          <p className="text-sm text-gray-500 mb-4">If you are an employee at a gym, enter your wages here. If you are 100% independent, leave this at 0.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="w2Wages" className="block text-sm font-medium text-gray-700 mb-1">
                Annual W-2 Wages ($)
              </label>
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
                <p id="w2Wages-warning" role="alert" className="text-xs text-red-600 mt-1">{fieldWarnings.w2Wages}</p>
              )}
            </div>
            <div>
              <label htmlFor="w2Withheld" className="block text-sm font-medium text-gray-700 mb-1">
                Tax Already Withheld ($)
              </label>
              <input
                id="w2Withheld"
                type="number"
                min="0"
                value={inputs.w2Withheld || ""}
                onChange={(e) => handleInputChange("w2Withheld", e.target.value)}
                className={inputBaseClass}
                placeholder="0"
                aria-describedby={fieldWarnings.w2Withheld ? "w2Withheld-warning" : undefined}
              />
              {fieldWarnings.w2Withheld && (
                <p id="w2Withheld-warning" role="alert" className="text-xs text-red-600 mt-1">{fieldWarnings.w2Withheld}</p>
              )}
            </div>
          </div>
        </section>

        {/* 1099 Income */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. 1099 / Self-Employment Income</h2>
          <div className="mb-6">
            <label htmlFor="gross1099" className="block text-sm font-medium text-gray-700 mb-1">
              Gross Training Income ($)
            </label>
            <p className="text-xs text-gray-500 mb-2">Total money you collected from private clients or your own studio before any expenses.</p>
            <input
              id="gross1099"
              type="number"
              min="0"
              value={inputs.gross1099 || ""}
              onChange={(e) => handleInputChange("gross1099", e.target.value)}
              className="w-full rounded-lg border-brand-300 shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 p-4 min-h-[44px] bg-brand-50 border text-lg font-semibold text-brand-900 transition-colors"
              placeholder="0"
              aria-describedby={fieldWarnings.gross1099 ? "gross1099-warning" : undefined}
            />
            {fieldWarnings.gross1099 && (
              <p id="gross1099-warning" role="alert" className="text-xs text-red-600 mt-1">{fieldWarnings.gross1099}</p>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Did you deduct these?</h3>
          <p className="text-sm text-gray-600 mb-4 font-medium">Most trainers miss these deductions, let's find yours. Enter your annual expenses below.</p>

          <div className="space-y-4">
            <DeductionInput
              id="deduction-certs"
              label="Certifications & CEUs"
              hint="NASM, ACE, renewals. Typical: $200-$800/yr"
              value={inputs.deductions.certs}
              onChange={(v) => handleDeductionChange("certs", v)}
              warning={fieldWarnings["deductions.certs"]}
              tooltipText="Professional certifications, continuing education, and training expenses may qualify when they are related to maintaining or improving your current business skills. Eligibility depends on your situation."
            />
            <DeductionInput
              id="deduction-liabilityIns"
              label="Liability Insurance"
              hint="Most trainers pay $150-$300/year"
              value={inputs.deductions.liabilityIns}
              onChange={(v) => handleDeductionChange("liabilityIns", v)}
              warning={fieldWarnings["deductions.liabilityIns"]}
              tooltipText="Business liability insurance used to protect your training business may generally qualify as a business expense."
            />
            <DeductionInput
              id="deduction-gymRent"
              label="Gym Rental / Revenue Split"
              hint="Booth fees or % paid to the studio"
              value={inputs.deductions.gymRent}
              onChange={(v) => handleDeductionChange("gymRent", v)}
              warning={fieldWarnings["deductions.gymRent"]}
              tooltipText="Include the portion of gym or studio rental costs you pay to operate your training business."
            />
            <DeductionInput
              id="deduction-equipment"
              label="Equipment"
              hint="Weights, bands, wearables for client use"
              value={inputs.deductions.equipment}
              onChange={(v) => handleDeductionChange("equipment", v)}
              warning={fieldWarnings["deductions.equipment"]}
              tooltipText="Business-use equipment such as weights, resistance bands, mats, or other training gear may qualify. Keep records showing business use."
            />
            <DeductionInput
              id="deduction-software"
              label="Coaching Software & Apps"
              hint="Trainerize, TrueCoach, Zoom, payment fees"
              value={inputs.deductions.software}
              onChange={(v) => handleDeductionChange("software", v)}
              warning={fieldWarnings["deductions.software"]}
              tooltipText="Software used to run or support your training business may qualify, such as scheduling, client-management, programming, or coaching platforms."
            />
            <DeductionInput
              id="deduction-mileage"
              label="Business Mileage"
              hint="Miles driven between client locations (not commute)"
              value={inputs.deductions.mileage}
              onChange={(v) => handleDeductionChange("mileage", v)}
              warning={fieldWarnings["deductions.mileage"]}
              prefix="miles"
              tooltipText="Generally, include qualifying business miles such as travel between clients or to off-site training locations. Normal commuting may not qualify."
              learnMoreLink="/guides/personal-trainer-tax-deductions#mileage"
            />
            <DeductionInput
              id="deduction-apparel"
              label="Branded Apparel"
              hint="Only clothing with your logo is deductible"
              value={inputs.deductions.apparel}
              onChange={(v) => handleDeductionChange("apparel", v)}
              warning={fieldWarnings["deductions.apparel"]}
            />
            <DeductionInput
              id="deduction-marketing"
              label="Marketing"
              hint="Website hosting, ads, business cards"
              value={inputs.deductions.marketing}
              onChange={(v) => handleDeductionChange("marketing", v)}
              warning={fieldWarnings["deductions.marketing"]}
            />
            <DeductionInput
              id="deduction-homeOffice"
              label="Home Office Deduction"
              hint="Simplified estimate based on dedicated sq footage"
              value={inputs.deductions.homeOffice}
              onChange={(v) => handleDeductionChange("homeOffice", v)}
              warning={fieldWarnings["deductions.homeOffice"]}
            />
            <DeductionInput
              id="deduction-other"
              label="Other Expenses"
              hint="Catch-all for miscellaneous business costs"
              value={inputs.deductions.other}
              onChange={(v) => handleDeductionChange("other", v)}
              warning={fieldWarnings["deductions.other"]}
            />
          </div>
        </section>

        {/* Placeholder Ad Slot (for future AdSense) */}
        <div className="w-full p-4 border-2 border-dashed border-gray-200 bg-gray-50 text-center rounded-xl my-6 flex items-center justify-center min-h-[100px]">
          <span className="text-gray-400 text-sm font-medium">Advertisement Slot (Future)</span>
        </div>
      </div>

      {/* Right Column: Sticky Results */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-6 bg-dark text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-6">
            <h2 className="text-xl font-bold text-brand-100">Your Tax Estimate</h2>
            <InfoTooltip label="What is SE tax?" text="Self-employment (SE) tax covers Social Security and Medicare — the share normally split between an employer and employee, but paid entirely by you when you're self-employed." />
          </div>

          {!hasIncome ? (
            <EmptyResultsState />
          ) : (
            <div aria-live="polite" className="flex flex-col flex-grow">
              {deductionsExceedIncome && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-xs text-amber-200">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span>
                    Your deductions (${deductionsSum.toLocaleString("en-US", { maximumFractionDigits: 0 })}) exceed your gross training income. Double-check your numbers — profit below $0 is shown as $0.
                  </span>
                </div>
              )}

              <div className="space-y-4 flex-grow">
                <ResultRow label="Net Self-Employment Profit" value={results.netSeProfit} highlight />
                <div className="pt-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Self-Employment Tax Breakdown</p>
                  <ResultRow label="Social Security" value={results.seTax.socialSecurity} sub />
                  <ResultRow label="Medicare" value={results.seTax.medicare} sub />
                  {results.seTax.additionalMedicare > 0 && (
                    <ResultRow label="Additional Medicare" value={results.seTax.additionalMedicare} sub />
                  )}
                  <ResultRow label="Total SE Tax" value={results.seTax.total} bold />
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <ResultRow label="Federal Income Tax" value={results.federalTax} bold />
                </div>

                <div className="pt-4 border-t border-gray-700 mt-2">
                  <ResultRow label="Total Estimated Liability" value={results.totalLiability} />
                  {inputs.w2Withheld > 0 && (
                    <ResultRow label="W-2 Tax Already Withheld" value={-inputs.w2Withheld} sub />
                  )}
                  <ResultRow label="Total Estimated Amount Owed" value={results.amountOwed} bold />
                </div>
              </div>

              {/* Quarterly payment is the most actionable number — it's the visual anchor of the panel */}
              <div className="mt-8 bg-brand-600 rounded-xl p-5 text-center shadow-inner">
                <p className="text-xs text-brand-100 uppercase tracking-wide font-bold mb-1">Your Quarterly Payment</p>
                <p key={results.quarterlyPayment} className="value-pop text-4xl font-extrabold text-white mb-1 tabular-nums">
                  ${results.quarterlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-brand-100/80 mb-4">
                  ${results.amountOwed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} estimated total for the year
                </p>

                <div className="flex flex-wrap justify-center gap-2 text-xs text-brand-100">
                  <span className="bg-brand-700 px-2 py-1 rounded">Apr 15</span>
                  <span className="bg-brand-700 px-2 py-1 rounded">Jun 15</span>
                  <span className="bg-brand-700 px-2 py-1 rounded">Sep 15</span>
                  <span className="bg-brand-700 px-2 py-1 rounded">Jan 15</span>
                </div>
                {/* TODO: Downloadable quarterly payment calendar feature stub */}
                <div className="mt-3 text-xs text-brand-200 hover:text-white cursor-pointer underline decoration-brand-400 underline-offset-2">
                  Download Calendar (.ics) (Coming Soon)
                </div>
              </div>

              {/* TODO: LLC vs S-Corp savings indicator feature stub */}
              {results.netSeProfit > 80000 && (
                <div className="mt-4 p-3 border border-brand-500/30 rounded-lg bg-brand-900/40 text-xs text-center text-brand-200">
                  💡 You're earning enough that an S-Corp might save you money. (Comparison coming soon)
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-6 text-center">
            This is an estimate for planning purposes, not formal tax advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyResultsState() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-grow py-8">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-brand-300">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <p className="text-white font-semibold mb-1">Your estimate will appear here</p>
      <p className="text-sm text-gray-400 max-w-[240px]">Enter your W-2 wages or gross training income on the left to see your tax breakdown and quarterly payments.</p>
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
        className="text-gray-400 hover:text-brand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-full p-1.5 transition-colors"
        aria-label={label}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      {show && (
        <div className="absolute z-50 w-56 p-3 mt-2 text-xs leading-relaxed text-gray-700 bg-white border border-gray-100 rounded-lg shadow-lg right-0">
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 transition-colors relative group">
      <div className="flex-1 flex items-start">
        <div className="flex-1">
          <label htmlFor={id} className="block text-sm font-semibold text-gray-800">{label}</label>
          <span className="inline-block mt-1 text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">{hint}</span>
        </div>
        {tooltipText && (
          <div
            className="relative ml-2 flex-shrink-0"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 p-1.5 rounded-full transition-colors"
              aria-label={`More information about ${label}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>

            {showTooltip && (
              <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 transition-opacity animate-in fade-in zoom-in-95 duration-150">
                <p className="leading-relaxed">{tooltipText}</p>
                {learnMoreLink && (
                  <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-semibold text-brand-600 hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded">
                    Learn more &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full sm:w-32 flex-shrink-0">
        <div className="relative">
          {prefix === "$" && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>}
          <input
            id={id}
            type="number"
            min="0"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-md border-gray-300 shadow-sm bg-gray-50 border text-gray-900 font-medium p-2.5 min-h-[44px] transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 ${prefix === "$" ? "pl-7" : "pr-12"}`}
            placeholder="0"
            aria-describedby={warning ? `${id}-warning` : undefined}
          />
          {prefix !== "$" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">{prefix}</span>}
        </div>
        {warning && (
          <p id={`${id}-warning`} role="alert" className="text-[11px] text-red-600 mt-1 text-right">{warning}</p>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, sub, bold, highlight }: { label: string; value: number; sub?: boolean; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center gap-3 ${sub ? "text-gray-400 text-sm pl-2" : highlight ? "text-brand-300 font-semibold" : bold ? "font-semibold text-white" : "text-gray-200"}`}>
      <span>{label}</span>
      <span key={value} className="value-pop tabular-nums">{value < 0 ? "-" : ""}${Math.abs(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
    </div>
  );
}
