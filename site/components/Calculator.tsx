"use client";

import React, { useEffect, useMemo, useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus, TAX_CONFIG } from "../lib/calculator";
import SaveEstimateButton from "./SaveEstimateButton";

const inputBaseClass =
  "w-full rounded-xl border border-[#e2deeb] bg-white p-4 min-h-[44px] text-[17px] font-medium text-inktext transition-colors focus:outline-none focus:border-accent-deep focus:ring-2 focus:ring-accent-deep/15";

// Flip to true once real ads are wired up.
const AD_SLOT_ENABLED = false;

function AdSlot() {
  return (
    <div className="w-full p-4 border-2 border-dashed border-[#e2deeb] bg-[#faf9f7] text-center rounded-xl flex items-center justify-center min-h-[100px]">
      <span className="text-[#a29cb3] text-sm font-medium">Advertisement Slot (Future)</span>
    </div>
  );
}

const STORAGE_KEY = "trainerledger-inputs-v2";

const emptyInputs: TaxInputs = {
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
    mileageH1: 0,
    mileageH2: 0,
    apparel: 0,
    marketing: 0,
    homeOffice: 0,
    other: 0,
  },
};

// Plausible starting numbers for someone who doesn't have exact figures yet —
// clearly labeled as an example in the UI, never silently applied.
const typicalInputs: TaxInputs = {
  filingStatus: "single",
  w2Wages: 0,
  w2Withheld: 0,
  gross1099: 65000,
  deductions: {
    certs: 400,
    liabilityIns: 220,
    gymRent: 3000,
    equipment: 600,
    software: 300,
    mileageH1: 400,
    mileageH2: 400,
    apparel: 150,
    marketing: 250,
    homeOffice: 500,
    other: 200,
  },
};

function hasShape(v: any): v is TaxInputs {
  return v && typeof v === "object" && v.deductions && typeof v.deductions.mileageH1 === "number";
}

type WorkType = "independent" | "contractor" | "hybrid" | "studio";
type DeductionKey = keyof TaxInputs["deductions"];

const WORKTYPE_STORAGE_KEY = "trainerledger-worktype-v1";

const WORK_TYPES: { id: WorkType; label: string; hint: string }[] = [
  { id: "independent", label: "Independent trainer", hint: "Your own clients, no gym affiliation" },
  { id: "contractor", label: "Gym contractor", hint: "You pay a gym or studio to train there" },
  { id: "hybrid", label: "Hybrid", hint: "A gym paycheck plus your own private clients" },
  { id: "studio", label: "Studio owner", hint: "You run your own space" },
];

const DEDUCTION_FIELDS: {
  key: DeductionKey;
  label: string;
  hint: string;
  prefix?: string;
  tooltipText?: string;
  learnMoreLink?: string;
}[] = [
  {
    key: "gymRent",
    label: "Gym rental / revenue split",
    hint: "Booth fees or studio split",
    tooltipText: "Include the portion of gym or studio rental costs you pay to operate your training business.",
  },
  {
    key: "certs",
    label: "Certifications & CEUs",
    hint: "NASM, ACE, renewals",
    tooltipText: "Professional certifications, continuing education, and training expenses may qualify when they are related to maintaining or improving your current business skills. Eligibility depends on your situation.",
  },
  {
    key: "liabilityIns",
    label: "Liability insurance",
    hint: "Most trainers pay $150–$300/yr",
    tooltipText: "Business liability insurance used to protect your training business may generally qualify as a business expense.",
  },
  {
    key: "equipment",
    label: "Equipment",
    hint: "Weights, bands, wearables",
    tooltipText: "Business-use equipment such as weights, resistance bands, mats, or other training gear may qualify. Keep records showing business use. Under Section 179, qualifying equipment can generally be deducted in full the year you buy it, rather than depreciated over several years.",
  },
  {
    key: "software",
    label: "Coaching software & apps",
    hint: "Trainerize, Zoom, payment fees",
    tooltipText: "Software used to run or support your training business may qualify, such as scheduling, client-management, programming, or coaching platforms.",
  },
  {
    key: "mileageH1",
    label: "Business mileage (Jan 1 – Jun 30)",
    hint: "72.5¢/mile — first half of 2026",
    prefix: "miles",
    tooltipText: "The IRS made a rare mid-year rate change for 2026 (announced July 13). Miles driven before July 1 are deducted at 72.5¢/mile. Include qualifying business miles such as travel between clients — normal commuting doesn't count.",
    learnMoreLink: "/guides/personal-trainer-tax-deductions#mileage",
  },
  {
    key: "mileageH2",
    label: "Business mileage (Jul 1 – Dec 31)",
    hint: "76¢/mile — second half of 2026",
    prefix: "miles",
    tooltipText: "Miles driven on or after July 1, 2026 are deducted at the higher 76¢/mile rate the IRS announced mid-year. Only miles driven after the change qualify for this rate.",
    learnMoreLink: "/guides/personal-trainer-tax-deductions#mileage",
  },
  { key: "marketing", label: "Marketing", hint: "Hosting, ads, business cards" },
  { key: "apparel", label: "Branded apparel", hint: "Only clothing with your logo" },
  { key: "homeOffice", label: "Home office deduction", hint: "Simplified sq-footage estimate" },
  { key: "other", label: "Other expenses", hint: "Miscellaneous business costs" },
];

// The categories most likely to apply per work type, in the order they should
// appear. Everything else waits behind the expander. This never hides a field
// that already has a value in it — see isDeductionVisible below.
const CORE_DEDUCTIONS: Record<WorkType | "unset", DeductionKey[]> = {
  unset: ["certs", "liabilityIns", "equipment", "software", "mileageH1", "mileageH2"],
  independent: ["certs", "liabilityIns", "mileageH1", "mileageH2", "equipment", "software"],
  contractor: ["gymRent", "certs", "liabilityIns", "mileageH1", "mileageH2", "equipment"],
  hybrid: ["certs", "liabilityIns", "mileageH1", "mileageH2", "equipment", "software"],
  studio: ["gymRent", "equipment", "marketing", "software", "liabilityIns"],
};

function labelFor(field: (typeof DEDUCTION_FIELDS)[number], workType: WorkType | null) {
  if (field.key === "gymRent" && workType === "studio") return "Studio rent / lease";
  return field.label;
}

function SectionHeading({ n, title, done, children }: { n: number; title: string; done: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-6 flex-shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors ${
          done ? "bg-accent-deep text-white" : "bg-[#efecf5] text-[#8b869c]"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-inktext">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Calculator({ embed = false }: { embed?: boolean }) {
  const [inputs, setInputs] = useState<TaxInputs>(emptyInputs);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [workType, setWorkType] = useState<WorkType | null>(null);
  const [showAllFields, setShowAllFields] = useState(false);

  // Restore a returning visitor's numbers from their own browser — never sent
  // anywhere, consistent with the privacy policy. Skipped entirely in embed
  // mode: the widget is meant to be a stateless anonymous tool wherever it's
  // dropped, and this origin's localStorage would otherwise leak a visitor's
  // numbers from the main site into every blog that embeds it, or vice versa.
  useEffect(() => {
    if (embed) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (hasShape(parsed)) setInputs(parsed);
      }
      const savedWorkType = window.localStorage.getItem(WORKTYPE_STORAGE_KEY);
      if (WORK_TYPES.some((w) => w.id === savedWorkType)) setWorkType(savedWorkType as WorkType);
    } catch {
      // ignore — worst case, the form just starts empty
    } finally {
      setLoadedFromStorage(true);
    }
  }, [embed]);

  useEffect(() => {
    if (embed || !loadedFromStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
      if (workType) window.localStorage.setItem(WORKTYPE_STORAGE_KEY, workType);
    } catch {
      // storage full or unavailable — the calculator still works, it just won't persist
    }
  }, [inputs, workType, loadedFromStorage, embed]);

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
      d.mileageH1 * TAX_CONFIG.MILEAGE_RATE_H1 +
      d.mileageH2 * TAX_CONFIG.MILEAGE_RATE_H2 +
      d.apparel +
      d.marketing +
      d.homeOffice +
      d.other
    );
  }, [inputs.deductions]);

  // Exact per-field and total savings: recompute the real tax engine with
  // that field (or all fields) zeroed out and diff the actual totalLiability.
  // Not an approximation — this can't overstate savings when federal tax is
  // already $0, or misjudge QBI-floor/threshold effects, because it's just
  // running the same calculation the results panel uses, twice.
  const fieldSavings = useMemo(() => {
    const d = inputs.deductions;
    const savings = {} as Record<keyof TaxInputs["deductions"], number>;
    (Object.keys(d) as (keyof TaxInputs["deductions"])[]).forEach((key) => {
      if (!d[key]) {
        savings[key] = 0;
        return;
      }
      const without = calculateTaxes({ ...inputs, deductions: { ...d, [key]: 0 } });
      savings[key] = Math.max(0, without.totalLiability - results.totalLiability);
    });
    return savings;
  }, [inputs, results.totalLiability]);

  const estimatedSavings = useMemo(() => {
    if (deductionsSum <= 0) return 0;
    const zeroedDeductions = { ...inputs.deductions };
    (Object.keys(zeroedDeductions) as (keyof TaxInputs["deductions"])[]).forEach((key) => {
      zeroedDeductions[key] = 0;
    });
    const without = calculateTaxes({ ...inputs, deductions: zeroedDeductions });
    return Math.max(0, without.totalLiability - results.totalLiability);
  }, [inputs, deductionsSum, results.totalLiability]);
  const hasIncome = inputs.gross1099 > 0 || inputs.w2Wages > 0;
  const deductionsExceedIncome = inputs.gross1099 > 0 && deductionsSum > inputs.gross1099;

  // Progressive disclosure, with one hard rule: a field that currently holds a
  // value is always visible, whatever the work type says. Hiding a field that
  // is still changing the number would make the estimate quietly unexplainable.
  const coreDeductions = CORE_DEDUCTIONS[workType ?? "unset"];
  const isDeductionVisible = (key: DeductionKey) =>
    showAllFields || coreDeductions.includes(key) || inputs.deductions[key] > 0;

  const visibleDeductions = [
    ...coreDeductions,
    ...DEDUCTION_FIELDS.map((f) => f.key).filter((k) => !coreDeductions.includes(k) && isDeductionVisible(k)),
  ];
  const hiddenDeductionCount = DEDUCTION_FIELDS.filter((f) => !isDeductionVisible(f.key)).length;

  const showW2Section =
    showAllFields ||
    workType === null ||
    workType === "hybrid" ||
    workType === "studio" ||
    inputs.w2Wages > 0 ||
    inputs.w2Withheld > 0;

  const fillTypical = () => setInputs(typicalInputs);

  const downloadIcs = () => {
    const year = TAX_CONFIG.TAX_YEAR;
    const amount = results.quarterlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const dates: [string, string][] = [
      [`${year}0415`, "Q1"],
      [`${year}0615`, "Q2"],
      [`${year}0915`, "Q3"],
      [`${year + 1}0115`, "Q4"],
    ];
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const events = dates
      .map(
        ([date, label], i) => `BEGIN:VEVENT
UID:trainerledger-${year}-${label}-${i}@trainerledger
DTSTAMP:${stamp}
DTSTART;VALUE=DATE:${date}
SUMMARY:Estimated tax payment due (${label}) — ~$${amount}
DESCRIPTION:Estimated quarterly tax payment from TrainerLedger. This is a planning estimate\\, not formal tax advice.
END:VEVENT`
      )
      .join("\n");
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TrainerLedger//Quarterly Tax Calendar//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trainerledger-quarterly-taxes-${year}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      {/* Form */}
      <div className="print:hidden rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(31,25,74,.1)] md:p-9 space-y-9">
        <section>
          <SectionHeading n={1} title="About your work" done={workType !== null}>
            <p className="mt-1 text-sm text-[#66617a]">This just decides which fields you see. Nothing is locked away.</p>
          </SectionHeading>

          <fieldset className="mt-5">
            <legend className="mb-2 text-[13px] font-semibold text-[#413d57]">What kind of training work do you do?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {WORK_TYPES.map((w) => (
                <label
                  key={w.id}
                  className={`cursor-pointer rounded-[14px] border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    workType === w.id ? "border-accent-deep bg-accent-deep/[.06]" : "border-[#e7e3ee] hover:border-accent-deep/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="workType"
                    value={w.id}
                    checked={workType === w.id}
                    onChange={() => setWorkType(w.id)}
                    className="sr-only"
                  />
                  <span className="block text-[13px] font-semibold text-inktext">{w.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-[#777287]">{w.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
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

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={fillTypical}
              className="text-xs font-semibold text-accent-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Not sure? Fill typical trainer numbers
            </button>
            <button
              type="button"
              onClick={() => setShowAllFields((v) => !v)}
              className="text-xs font-semibold text-[#66617a] hover:text-accent-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              {showAllFields ? "Use the guided view" : "Show all fields"}
            </button>
          </div>
        </section>

        {/* W-2 + 1099 income */}
        <section>
          <SectionHeading n={2} title="Your income" done={hasIncome} />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {showW2Section && (
              <div className={workType === "hybrid" ? "sm:order-2" : undefined}>
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
            )}
            <div className={workType === "hybrid" ? "sm:order-1" : undefined}>
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
          {workType === "hybrid" && (
            <p className="mt-4 text-xs leading-relaxed text-[#413d57] bg-accent-deep/[.06] border border-accent-deep/20 rounded-lg p-3">
              <strong>Both boxes matter for you.</strong> Your gym already withheld Social Security on the W-2 side, so entering those wages stops the calculator from charging you that portion twice on your private-client income.
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-[#8b869c] bg-[#faf9f7] border border-[#e2deeb] rounded-lg p-3">
            <strong className="text-[#413d57]">Not receiving a 1099 doesn&apos;t mean it isn&apos;t taxable.</strong> For 2026, clients don&apos;t have to send you a 1099-NEC unless they paid you $2,000+ (up from $600), and payment apps only issue a 1099-K above $20,000 and 200 transactions. Track and report all your training income yourself, regardless of what forms show up.
          </p>
          {showW2Section && (
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
          )}
        </section>

        {/* Deductions */}
        <section id="deductions" className="border-t border-[#e9e6f1] pt-7 scroll-mt-24">
          <SectionHeading n={3} title="Your deductions" done={deductionsSum > 0}>
            <p className="mt-1 text-sm text-[#66617a]">Most trainers miss at least one.</p>
          </SectionHeading>

          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="max-w-[24ch] text-xs text-[#8b869c]">
              {workType === null
                ? "Pick a work type above and this list narrows to what applies to you."
                : "Showing what usually applies to your setup."}
            </p>
            <div className="whitespace-nowrap text-right">
              <p className="text-sm font-semibold text-accent-deep">{money(deductionsSum)} found</p>
              {estimatedSavings > 0 && <p className="text-xs text-[#66617a]">≈ {money(estimatedSavings)} saved</p>}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {visibleDeductions.map((key) => {
              const field = DEDUCTION_FIELDS.find((f) => f.key === key)!;
              return (
                <DeductionInput
                  key={key}
                  id={`deduction-${key}`}
                  label={labelFor(field, workType)}
                  hint={field.hint}
                  prefix={field.prefix}
                  tooltipText={field.tooltipText}
                  learnMoreLink={field.learnMoreLink}
                  value={inputs.deductions[key]}
                  onChange={(v) => handleDeductionChange(key, v)}
                  warning={fieldWarnings[`deductions.${key}`]}
                  savings={fieldSavings[key]}
                />
              );
            })}
          </div>

          {hiddenDeductionCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllFields(true)}
              className="mt-4 w-full rounded-[14px] border border-dashed border-[#d9d4e6] py-3 text-sm font-semibold text-accent-deep transition hover:border-accent-deep/60 hover:bg-accent-deep/[.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Show {hiddenDeductionCount} more {hiddenDeductionCount === 1 ? "deduction" : "deductions"} — most trainers miss at least one
            </button>
          )}
        </section>

        {/* Ad slot: kept in the codebase for when real ads are wired up, but not
            rendered — a visible placeholder isn't something a live site should ship. */}
        {AD_SLOT_ENABLED && <AdSlot />}
      </div>

      {/* Results */}
      <aside className="print:col-span-2 relative overflow-hidden rounded-[28px] bg-deep p-7 text-white md:p-9 lg:sticky lg:top-6">
        <div className="pointer-events-none absolute -right-20 -top-16 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className={`relative flex flex-col ${hasIncome ? "min-h-[420px]" : ""}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[.17em] text-accent-light">Your tax estimate</p>
            <InfoTooltip label="What is SE tax?" text="Self-employment (SE) tax covers Social Security and Medicare — the share normally split between an employer and employee, but paid entirely by you when you're self-employed." />
          </div>

          {!hasIncome ? (
            <EmptyResultsState />
          ) : (
            <div aria-live="polite" className="flex flex-1 flex-col motion-safe:animate-[results-in_320ms_ease-out]">
              {deductionsExceedIncome && (
                <div className="mt-6 flex items-start gap-2 rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-200">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span>
                    Your deductions ({money(deductionsSum)}) exceed your gross training income. Double-check your numbers — profit below $0 is shown as $0.
                  </span>
                </div>
              )}

              {results.qbiAboveSimpleThreshold && (
                <div className="mt-6 flex items-start gap-2 rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-200">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span>
                    Your income is above the $201,750 / $403,500 QBI phase-in threshold, where the real deduction gets more complex (W-2 wage and property limits, possible SSTB rules). This estimate uses a simplified flat calculation above that point — talk to a CPA.
                  </span>
                </div>
              )}

              {/* Quarterly payment is the most actionable number on the page — it's what a trainer actually has to go do something about four times a year. */}
              <p className="mt-8 text-xs font-semibold uppercase tracking-[.18em] text-[#a9dff4]">Your quarterly payment</p>
              <p key={results.quarterlyPayment} className="value-pop mt-1 font-serif text-6xl md:text-7xl tracking-[-.06em] tabular-nums">
                {money(results.quarterlyPayment)}
              </p>
              <p className="mt-2 text-sm text-[#cac7e6]">
                Due <strong className="text-white">Apr 15, Jun 15, Sep 15 &amp; Jan 15</strong> — {money(results.amountOwed)} estimated total for the year
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={downloadIcs} className="flex-1 rounded-full bg-accent py-3.5 font-semibold text-[#121127] transition hover:bg-white">
                  Add due dates to calendar (.ics)
                </button>
                {/* Printing from inside a third-party site's iframe is unpredictable
                    (wrong page chrome, cross-origin print quirks) — desktop/full-page only. */}
                {!embed && (
                  <button type="button" onClick={() => window.print()} className="flex-1 rounded-full border border-white/25 py-3.5 font-semibold text-white transition hover:bg-white/10">
                    Print / save as PDF
                  </button>
                )}
              </div>

              {/* The embed is meant to work fully anonymously wherever it's dropped —
                  a sign-in link would either hijack the host page's iframe or 404
                  against the host's own domain, and it doesn't belong there anyway. */}
              {!embed && <SaveEstimateButton inputs={inputs} results={results} />}

              <div className="mt-8 space-y-3.5 border-y border-white/15 py-6 text-sm">
                <ResultRow label="Net self-employment profit" value={results.netSeProfit} />
                <ResultRow label="Total SE tax" value={results.seTax.total} />
                <ResultRow label="Federal income tax" value={results.federalTax} accent />
                {inputs.w2Withheld > 0 && <ResultRow label="W-2 tax already withheld" value={-inputs.w2Withheld} />}
                <ResultRow label="Total estimated liability" value={results.totalLiability} bold />
              </div>

              <TaxBreakdownBar w2Wages={inputs.w2Wages} gross1099={inputs.gross1099} seTax={results.seTax.total} federalTax={results.federalTax} money={money} />

              {/* TODO: LLC vs S-Corp savings indicator — needs CPA-reviewed logic before shipping real numbers */}
              {results.netSeProfit > 80000 && (
                <p className="mt-6 text-xs text-center text-[#cac7e6]">
                  💡 You&apos;re earning enough that an S-Corp might save you money. (Comparison coming soon)
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

function TaxBreakdownBar({ w2Wages, gross1099, seTax, federalTax, money }: { w2Wages: number; gross1099: number; seTax: number; federalTax: number; money: (n: number) => string }) {
  const total = w2Wages + gross1099;
  if (total <= 0) return null;
  const seTaxPct = Math.max(0, Math.min(100, (seTax / total) * 100));
  const fedTaxPct = Math.max(0, Math.min(100 - seTaxPct, (federalTax / total) * 100));
  const takeHomePct = Math.max(0, 100 - seTaxPct - fedTaxPct);

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#a9dff4] mb-3">Where your income goes</p>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${seTaxPct.toFixed(0)}% self-employment tax, ${fedTaxPct.toFixed(0)}% federal tax, ${takeHomePct.toFixed(0)}% take-home`}>
        <div className="h-full bg-accent" style={{ width: `${seTaxPct}%` }} />
        <div className="h-full bg-[#66d8f1]/60" style={{ width: `${fedTaxPct}%` }} />
        <div className="h-full bg-white/25" style={{ width: `${takeHomePct}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#cac7e6]">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" />SE tax {money(seTax)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#66d8f1]/60" />Federal tax {money(federalTax)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-white/40" />Take-home {money(Math.max(0, total - seTax - federalTax))}</span>
      </div>
    </div>
  );
}

function EmptyResultsState() {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-accent-light">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <p className="text-white font-semibold mb-1">Your estimate will appear here</p>
      <p className="text-sm text-[#a7a2c8] max-w-[250px]">Add your income on the left and this panel fills in.</p>
      <ul className="mt-5 w-full max-w-[250px] space-y-2 text-left text-xs text-[#a7a2c8]">
        {[
          "What to set aside each quarter",
          "The four IRS due dates, downloadable",
          "Self-employment tax and federal tax, split out",
          "Where your income actually goes",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-accent/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoTooltip({ label, text }: { label: string; text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="print:hidden relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
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
  savings,
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
  savings?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex min-h-[84px] items-center justify-between gap-3 rounded-[14px] border border-[#e7e3ee] p-3.5 transition hover:border-accent-deep/60 hover:-translate-y-0.5 relative group">
      <div className="flex flex-1 items-start gap-2">
        <div className="flex-1">
          <label htmlFor={id} className="block text-[13px] font-semibold text-inktext">{label}</label>
          <p className="mt-0.5 text-[11px] leading-tight text-[#777287]">{hint}</p>
        </div>
        {tooltipText && (
          <div
            className="print:hidden relative flex-shrink-0"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-[#a29cb3] hover:text-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent p-1.5 rounded-full transition-colors"
              aria-label={`More information about ${label}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>

            {showTooltip && (
              <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-[#413d57] bg-white border border-[#e7e3ee] rounded-lg shadow-lg right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
                <p className="leading-relaxed">{tooltipText}</p>
                {learnMoreLink && (
                  <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-semibold text-accent-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                    Learn more
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
            className="w-16 bg-transparent text-right font-semibold text-inktext outline-none"
            placeholder="0"
            aria-describedby={warning ? `${id}-warning` : undefined}
          />
          {prefix !== "$" && <span className="text-[#a29cb3] text-xs">{prefix}</span>}
        </div>
        {warning ? (
          <p id={`${id}-warning`} role="alert" className="text-[10px] text-red-600 mt-1">{warning}</p>
        ) : savings && savings > 0.5 ? (
          <p className="text-[10px] text-accent-deep mt-1">≈ {money(savings)} saved</p>
        ) : null}
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
