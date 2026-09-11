"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus, TAX_CONFIG } from "../lib/calculator";
import SaveEstimateButton from "./SaveEstimateButton";
import Link from "next/link";
import { downloadQuarterlyIcs } from "../lib/ics";
import Tooltip from "./Tooltip";
import { button, field, fieldError, fieldLabel, linkOnLight } from "./ui";
import { AlertIcon, ArrowDownIcon, ArrowRightIcon, CalendarIcon, CheckIcon, DollarIcon, InfoIcon, PrinterIcon } from "./icons";

// Flip to true once real ads are wired up.
const AD_SLOT_ENABLED = false;

function AdSlot() {
  return (
    <div className="w-full p-4 border-2 border-dashed border-line bg-cream2 text-center rounded-control flex items-center justify-center min-h-[100px]">
      <span className="text-inkmuted text-sm font-medium">Advertisement Slot (Future)</span>
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
        className={`mt-0.5 grid size-6 flex-shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
          done ? "bg-accent-deep text-white" : "bg-line text-inkmuted"
        }`}
      >
        {done ? <CheckIcon className="size-3.5" strokeWidth={2.5} /> : n}
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

  // Mobile summary bar. Below lg the results panel sits under a long form, so
  // the live number is out of sight while you type. One observer watches both:
  // the bar shows while the form is on screen and the panel isn't, and gets out
  // of the way on its own once you reach the panel or scroll past the form.
  const formRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const [formInView, setFormInView] = useState(false);
  const [asideInView, setAsideInView] = useState(false);
  useEffect(() => {
    if (embed) return;
    const form = formRef.current;
    const aside = asideRef.current;
    if (!form || !aside || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === form) setFormInView(entry.isIntersecting);
          else setAsideInView(entry.isIntersecting);
        }
      },
      { rootMargin: "-72px 0px 0px 0px" } // what's under the sticky header doesn't count
    );
    io.observe(form);
    io.observe(aside);
    return () => io.disconnect();
  }, [embed]);
  const showSummaryBar = !embed && hasIncome && formInView && !asideInView;

  const scrollToResults = () => {
    const aside = asideRef.current;
    if (!aside) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    aside.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    aside.focus({ preventScroll: true });
  };

  const fillTypical = () => setInputs(typicalInputs);

  const downloadIcs = () => downloadQuarterlyIcs(results.quarterlyPayment);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      {/* Form */}
      <div ref={formRef} className="print:hidden rounded-card bg-white p-6 shadow-card md:p-9 space-y-9">
        <section>
          <SectionHeading n={1} title="About your work" done={workType !== null}>
            <p className="mt-1 text-sm text-inkmuted">This just decides which fields you see. Nothing is locked away.</p>
          </SectionHeading>

          <fieldset className="mt-5">
            <legend className="mb-2 text-[13px] font-semibold text-inksoft">What kind of training work do you do?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {WORK_TYPES.map((w) => (
                <label
                  key={w.id}
                  className={`relative cursor-pointer rounded-tile border p-3 pr-10 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--ring)] ${
                    workType === w.id ? "border-accent-deep bg-accent-deep/[.06]" : "border-line hover:border-accent-deep/60"
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
                  <span className="mt-0.5 block text-xs leading-tight text-inkmuted">{w.hint}</span>
                  {/* Visible radio state. The native input is sr-only, so without
                      this the only cue for the choice was a faint border tint. */}
                  <span
                    aria-hidden="true"
                    className={`absolute right-3 top-3 grid size-5 place-items-center rounded-full transition-colors ${
                      workType === w.id ? "bg-accent-deep text-white" : "border border-linestrong bg-white"
                    }`}
                  >
                    {workType === w.id && <CheckIcon className="size-3.5" strokeWidth={2.5} />}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="filingStatus" className={fieldLabel}>
              Filing status
            </label>
            <select
              id="filingStatus"
              value={inputs.filingStatus}
              onChange={(e) => handleInputChange("filingStatus", e.target.value as FilingStatus)}
              className={`${field} cursor-pointer`}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5">
            <button
              type="button"
              onClick={fillTypical}
              className={`inline-flex min-h-[44px] items-center rounded text-sm ${linkOnLight}`}
            >
              Not sure? Fill typical trainer numbers
            </button>
            <button
              type="button"
              onClick={() => setShowAllFields((v) => !v)}
              className="inline-flex min-h-[44px] items-center rounded text-sm font-semibold text-inkmuted underline-offset-4 hover:text-accent-deep hover:underline"
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
                <label htmlFor="w2Wages" className={fieldLabel}>Annual W-2 wages</label>
                <MoneyInput id="w2Wages" value={inputs.w2Wages} onChange={(v) => handleInputChange("w2Wages", v)} warning={fieldWarnings.w2Wages} />
              </div>
            )}
            <div className={workType === "hybrid" ? "sm:order-1" : undefined}>
              <label htmlFor="gross1099" className={fieldLabel}>Gross training income</label>
              <MoneyInput id="gross1099" value={inputs.gross1099} onChange={(v) => handleInputChange("gross1099", v)} warning={fieldWarnings.gross1099} />
            </div>
          </div>
          {workType === "hybrid" && (
            <p className="mt-4 text-xs leading-relaxed text-inksoft bg-accent-deep/[.06] border border-accent-deep/20 rounded-control p-3">
              <strong>Both boxes matter for you.</strong> Your gym already withheld Social Security on the W-2 side, so entering those wages stops the calculator from charging you that portion twice on your private-client income.
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-inkmuted bg-cream2 border border-line rounded-control p-3">
            <strong className="text-inksoft">Not receiving a 1099 doesn&apos;t mean it isn&apos;t taxable.</strong> For 2026, clients don&apos;t have to send you a 1099-NEC unless they paid you $2,000+ (up from $600), and payment apps only issue a 1099-K above $20,000 and 200 transactions. Track and report all your training income yourself, regardless of what forms show up.
          </p>
          {showW2Section && (
            <div className="mt-5">
              <label htmlFor="w2Withheld" className={fieldLabel}>Tax already withheld from W-2</label>
              <MoneyInput
                id="w2Withheld"
                value={inputs.w2Withheld}
                onChange={(v) => handleInputChange("w2Withheld", v)}
                warning={fieldWarnings.w2Withheld}
                className="sm:max-w-[240px]"
              />
            </div>
          )}
        </section>

        {/* Deductions */}
        <section id="deductions" className="border-t border-line pt-7 scroll-mt-24">
          <SectionHeading n={3} title="Your deductions" done={deductionsSum > 0}>
            <p className="mt-1 text-sm text-inkmuted">Most trainers miss at least one.</p>
          </SectionHeading>

          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="max-w-[24ch] text-xs text-inkmuted">
              {workType === null
                ? "Pick a work type above and this list narrows to what applies to you."
                : "Showing what usually applies to your setup."}
            </p>
            <div className="whitespace-nowrap text-right">
              <p className="text-sm font-semibold text-accent-deep">{money(deductionsSum)} found</p>
              {estimatedSavings > 0 && <p className="text-xs text-inkmuted">≈ {money(estimatedSavings)} saved</p>}
            </div>
          </div>

          {/* One column between lg and xl: the form column is only ~530px wide
              there, and two cards per row squeezed labels onto four lines. */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
              className="mt-4 w-full rounded-tile border border-dashed border-line py-3 text-sm font-semibold text-accent-deep transition hover:border-accent-deep/60 hover:bg-accent-deep/[.04]"
            >
              Show {hiddenDeductionCount} more {hiddenDeductionCount === 1 ? "deduction" : "deductions"} — most trainers miss at least one
            </button>
          )}
        </section>

        {/* Ad slot: kept in the codebase for when real ads are wired up, but not
            rendered — a visible placeholder isn't something a live site should ship. */}
        {AD_SLOT_ENABLED && <AdSlot />}
      </div>

      {/* Results. lg:self-start matters: grid items stretch to the row height
          by default, and a stretched item has no room to stick — the panel
          scrolled away and left an empty block beside the deductions.
          top-24 clears the 72px sticky header. */}
      <aside
        ref={asideRef}
        tabIndex={-1}
        aria-label="Your tax estimate"
        className="print:col-span-2 relative scroll-mt-24 overflow-hidden rounded-card bg-deep p-7 text-white md:p-9 lg:sticky lg:top-24 lg:self-start"
      >
        <div className="pointer-events-none absolute -right-20 -top-16 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className={`relative flex flex-col ${hasIncome ? "min-h-[420px]" : ""}`}>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-accent-light">Your tax estimate</p>
            <Tooltip label="What is SE tax?" tone="dark">
              {"Self-employment (SE) tax covers Social Security and Medicare — the share normally split between an employer and employee, but paid entirely by you when you're self-employed."}
            </Tooltip>
          </div>

          {!hasIncome ? (
            <EmptyResultsState />
          ) : (
            <div aria-live="polite" className="flex flex-1 flex-col motion-safe:animate-[results-in_320ms_ease-out]">
              {deductionsExceedIncome && (
                <div className="mt-6 flex items-start gap-2 rounded-control bg-amber-400/10 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-200">
                  <AlertIcon className="mt-px size-4 flex-shrink-0" />
                  <span>
                    Your deductions ({money(deductionsSum)}) exceed your gross training income. Double-check your numbers — profit below $0 is shown as $0.
                  </span>
                </div>
              )}

              {results.qbiAboveSimpleThreshold && (
                <div className="mt-6 flex items-start gap-2 rounded-control bg-amber-400/10 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-200">
                  <AlertIcon className="mt-px size-4 flex-shrink-0" />
                  <span>
                    Your income is above the $201,750 / $403,500 QBI phase-in threshold, where the real deduction gets more complex (W-2 wage and property limits, possible SSTB rules). This estimate uses a simplified flat calculation above that point — talk to a CPA.
                  </span>
                </div>
              )}

              {/* Quarterly payment is the most actionable number on the page — it's what a trainer actually has to go do something about four times a year. */}
              <p className="mt-8 eyebrow text-accent-light">Your quarterly payment</p>
              <p key={results.quarterlyPayment} className="value-pop mt-1 font-serif text-6xl md:text-7xl tracking-[-.06em] tabular-nums">
                {money(results.quarterlyPayment)}
              </p>
              <p className="mt-2 text-sm text-haze">
                Due <strong className="text-white">Apr 15, Jun 15, Sep 15 &amp; Jan 15</strong> — {money(results.amountOwed)} estimated total for the year
              </p>

              {/* Action hierarchy: one primary (the calendar, which is what a
                  trainer has to act on four times a year), one secondary (the
                  breakdown), and quiet tertiary actions below. */}
              <div className="mt-6 flex flex-col gap-3">
                <button type="button" onClick={downloadIcs} className={button({ size: "lg", full: true })}>
                  <CalendarIcon className="size-5" />
                  Add due dates to calendar (.ics)
                </button>
                {!embed && (
                  <Link href="/dashboard" className={button({ variant: "secondary", size: "lg", full: true })}>
                    See the full breakdown
                    <ArrowRightIcon className="size-4" />
                  </Link>
                )}
              </div>

              {/* Neither tertiary action exists in embed mode: printing from inside
                  a third-party site's iframe is unpredictable, and the embed must stay
                  anonymous — a sign-in link would hijack the host page's iframe. */}
              {!embed && (
                <div className="mt-2 flex flex-wrap items-center justify-center">
                  <button type="button" onClick={() => window.print()} className={button({ variant: "ghost", size: "sm" })}>
                    <PrinterIcon className="size-4" />
                    Print / save as PDF
                  </button>
                  <SaveEstimateButton inputs={inputs} results={results} />
                </div>
              )}

              <div className="mt-8 space-y-3.5 border-y border-white/15 py-6 text-sm">
                <ResultRow label="Net self-employment profit" value={results.netSeProfit} />
                <ResultRow label="Total SE tax" value={results.seTax.total} />
                <ResultRow label="Federal income tax" value={results.federalTax} />
                {inputs.w2Withheld > 0 && <ResultRow label="W-2 tax already withheld" value={-inputs.w2Withheld} />}
                <ResultRow label="Total estimated liability" value={results.totalLiability} bold />
              </div>

              <TaxBreakdownBar w2Wages={inputs.w2Wages} gross1099={inputs.gross1099} seTax={results.seTax.total} federalTax={results.federalTax} money={money} />

              {/* TODO: LLC vs S-Corp savings indicator — needs CPA-reviewed logic before shipping real numbers */}
              {results.netSeProfit > 80000 && (
                <p className="mt-6 flex items-start justify-center gap-1.5 text-center text-xs text-haze">
                  <InfoIcon className="size-4 flex-shrink-0 text-accent-light" />
                  You&apos;re earning enough that an S-Corp might save you money. (Comparison coming soon)
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-dusk">
            For planning purposes only — not formal tax or legal advice.
          </p>
        </div>
      </aside>

      {/* Mobile summary bar (see showSummaryBar). Not in embed mode: a fixed bar
          inside a host page's iframe would float over their layout. Opaque
          bg-deep on purpose — it keeps the cyan focus ring (see globals.css). */}
      {!embed && (
        <div
          className={`print:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-deep px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-12px_32px_rgba(12,12,28,.35)] transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:hidden ${
            showSummaryBar ? "visible translate-y-0" : "invisible translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-accent-light">Quarterly payment</p>
              <p className="font-serif text-2xl tracking-[-.04em] tabular-nums">{money(results.quarterlyPayment)}</p>
            </div>
            <button type="button" onClick={scrollToResults} className={button({ variant: "secondary", size: "sm" })}>
              See estimate
              <ArrowDownIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
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
      <p className="eyebrow text-accent-light mb-3">Where your income goes</p>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${seTaxPct.toFixed(0)}% self-employment tax, ${fedTaxPct.toFixed(0)}% federal tax, ${takeHomePct.toFixed(0)}% take-home`}>
        <div className="h-full bg-accent" style={{ width: `${seTaxPct}%` }} />
        <div className="h-full bg-accent-soft/60" style={{ width: `${fedTaxPct}%` }} />
        <div className="h-full bg-white/25" style={{ width: `${takeHomePct}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-haze">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" />SE tax {money(seTax)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent-soft/60" />Federal tax {money(federalTax)}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-white/40" />Take-home {money(Math.max(0, total - seTax - federalTax))}</span>
      </div>
    </div>
  );
}

function EmptyResultsState() {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-accent-light">
        <DollarIcon className="size-5" />
      </div>
      <p className="text-white font-semibold mb-1">Your estimate will appear here</p>
      <p className="text-sm text-dusk max-w-[250px]">Add your income on the left and this panel fills in.</p>
      <ul className="mt-5 w-full max-w-[250px] space-y-2 text-left text-xs text-dusk">
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

/** Boxed money field for income amounts: "$" adornment, the numeric keypad
 *  on phones, and the scroll wheel can't nudge the value while it's focused. */
function MoneyInput({
  id,
  value,
  onChange,
  warning,
  className = "",
}: {
  id: string;
  value: number;
  onChange: (val: string) => void;
  warning?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-medium text-inkmuted">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          className={`${field} pl-8`}
          placeholder="0"
          aria-describedby={warning ? `${id}-warning` : undefined}
          aria-invalid={warning ? true : undefined}
        />
      </div>
      {warning && (
        <p id={`${id}-warning`} role="alert" className={fieldError}>
          <AlertIcon className="size-3.5 flex-shrink-0" />
          {warning}
        </p>
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
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    // relative: on phones the tooltip anchors to the whole card. focus-within
    // turns the card border teal, so the compact underline field has a focus
    // state you can see from across the form, not just a 1px colour change.
    <div className="relative flex min-h-[84px] items-center justify-between gap-3 rounded-tile border border-line p-3.5 transition-colors hover:border-accent-deep/60 focus-within:border-accent-deep">
      <div className="flex min-w-0 flex-1 items-start gap-1">
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-[13px] font-semibold text-inktext">{label}</label>
          <p className="mt-0.5 text-xs leading-snug text-inkmuted">{hint}</p>
        </div>
        {tooltipText && (
          <Tooltip label={`More information about ${label}`} anchor="container">
            <p>{tooltipText}</p>
            {learnMoreLink && (
              <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block rounded ${linkOnLight}`}>
                Learn more
              </a>
            )}
          </Tooltip>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="flex min-h-[44px] items-center gap-1 border-b border-linestrong pb-1 transition-[border-color,box-shadow] focus-within:border-accent-deep focus-within:shadow-[0_1px_0_0_theme(colors.accent.deep)]">
          {prefix === "$" && <span className="text-sm text-inkmuted">$</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min="0"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            // The card border and the thickened underline carry focus; the global
            // outline would draw a box around this deliberately bare input.
            className="w-20 bg-transparent text-right font-semibold tabular-nums text-inktext focus-visible:outline-none"
            placeholder="0"
            aria-describedby={warning ? `${id}-warning` : undefined}
            aria-invalid={warning ? true : undefined}
          />
          {prefix !== "$" && <span className="text-xs text-inkmuted">{prefix}</span>}
        </div>
        {warning ? (
          <p id={`${id}-warning`} role="alert" className={`${fieldError} justify-end`}>{warning}</p>
        ) : savings && savings > 0.5 ? (
          <p className="mt-1 text-xs text-accent-deep">≈ {money(savings)} saved</p>
        ) : null}
      </div>
    </div>
  );
}

function ResultRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-haze">{label}</span>
      <span key={value} className={`value-pop tabular-nums ${bold ? "font-semibold text-white" : "font-medium text-offwhite"}`}>
        {value < 0 ? "− " : ""}
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(value))}
      </span>
    </div>
  );
}
