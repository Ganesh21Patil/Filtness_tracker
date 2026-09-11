"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus, TAX_CONFIG } from "../lib/calculator";
import SaveEstimateButton from "./SaveEstimateButton";
import Link from "next/link";
import { downloadQuarterlyIcs } from "../lib/ics";
import Tooltip from "./Tooltip";
import { button, field, fieldError, fieldHint, fieldLabel, linkOnDark } from "./ui";
import {
  AlertIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BulbIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CoinsIcon,
  DocumentIcon,
  DollarIcon,
  InfoIcon,
  LockIcon,
  PlusCircleIcon,
  PrinterIcon,
  ReceiptIcon,
  ShieldIcon,
  TrendIcon,
  UserIcon,
} from "./icons";

// Flip to true once real ads are wired up.
const AD_SLOT_ENABLED = false;

function AdSlot() {
  return (
    <div className="flex min-h-[100px] w-full items-center justify-center rounded-control border-2 border-dashed border-white/15 bg-white/[.02] p-4 text-center">
      <span className="text-sm font-medium text-dusk">Advertisement Slot (Future)</span>
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

// Short names for the chips shown while the deductions section is collapsed.
const CHIP_LABELS: Record<DeductionKey, string> = {
  gymRent: "Gym rent",
  certs: "Certifications",
  liabilityIns: "Insurance",
  equipment: "Equipment",
  software: "Software",
  mileageH1: "Mileage Jan–Jun",
  mileageH2: "Mileage Jul–Dec",
  marketing: "Marketing",
  apparel: "Apparel",
  homeOffice: "Home office",
  other: "Other",
};

const STEP_TITLES = ["About your work", "Your income", "Your deductions"];

/** Numbered step badge: a check once the step holds an answer. */
function StepBadge({ n, done, current }: { n: number; done: boolean; current: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-8 flex-shrink-0 place-items-center rounded-full border text-sm font-semibold tabular-nums transition-colors ${
        done
          ? "border-electric-light bg-electric text-white shadow-[0_0_16px_-2px_rgba(42,98,255,.8)]"
          : current
            ? "border-electric-light text-accent-light shadow-[0_0_18px_-4px_rgba(77,134,255,.9)]"
            : "border-white/20 text-dusk"
      }`}
    >
      {done ? <CheckIcon className="size-4" strokeWidth={2.5} /> : n}
    </span>
  );
}

function SectionHeading({ n, done, current, children }: { n: number; done: boolean; current: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <StepBadge n={n} done={done} current={current} />
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-lg font-semibold text-offwhite">{STEP_TITLES[n - 1]}</h3>
        {children}
      </div>
    </div>
  );
}

/** One-line note under a field, with the brand's small glowing dot. */
function FieldNote({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-xs leading-snug text-dusk">
      <span aria-hidden="true" className="mt-[5px] size-1.5 flex-shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(31,182,255,.9)]" />
      {children}
    </p>
  );
}

export default function Calculator({
  embed = false,
  defaultDeductionsOpen = false,
}: {
  embed?: boolean;
  /** Pages whose whole job is deductions (/deductions, the deduction finder) open that section. */
  defaultDeductionsOpen?: boolean;
}) {
  const [inputs, setInputs] = useState<TaxInputs>(emptyInputs);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [workType, setWorkType] = useState<WorkType | null>(null);
  const [showAllFields, setShowAllFields] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(defaultDeductionsOpen);

  // Deep links to #deductions (the homepage deduction tiles) land with it open.
  useEffect(() => {
    if (window.location.hash === "#deductions") setDeductionsOpen(true);
  }, []);

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

  // Presentation only: which of the three steps already hold an answer.
  const stepsDone = [workType !== null, hasIncome, deductionsSum > 0];
  const currentStep = stepsDone.findIndex((d) => !d);
  const selectedWorkType = WORK_TYPES.find((w) => w.id === workType);
  // Shown as chips while the deductions section is collapsed, so a value that
  // is changing the estimate is never out of sight.
  const filledDeductions = DEDUCTION_FIELDS.filter((f) => inputs.deductions[f.key] > 0);

  return (
    // Items stretch, so the form and results cards are always the same height.
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] xl:gap-7">
      {/* Form. Container-query host: inner grids go two-up only when the card
          itself is wide enough, whatever page it sits on. */}
      <div ref={formRef} className="print:hidden glass-glow flex flex-col rounded-card p-6 [container-type:inline-size] md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/[.08] pb-7">
          <div className="min-w-0">
            <p className="eyebrow text-dusk">
              {currentStep === -1 ? "All steps filled in" : `Step ${currentStep + 1} of 3`}
            </p>
            <h2 className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-.015em] text-offwhite">Your tax picture</h2>
            <p className="mt-2 text-sm leading-relaxed text-haze">Start with the essentials. Add details only when they matter to you.</p>
          </div>
          {/* Visual progress; the eyebrow above carries the same information as text. */}
          <ol aria-hidden="true" className="mt-1 hidden items-center sm:flex">
            {stepsDone.map((done, i) => (
              <li key={i} className="flex items-center">
                {i > 0 && <span className={`h-px w-5 ${stepsDone[i - 1] ? "bg-electric-light/70" : "bg-white/15"}`} />}
                <StepBadge n={i + 1} done={done} current={i === currentStep} />
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-1 flex-col gap-9 pt-8">
          <section>
            <SectionHeading n={1} done={stepsDone[0]} current={currentStep === 0}>
              <p className="mt-1 text-sm text-dusk">This just decides which fields you see. Nothing is locked away.</p>
            </SectionHeading>

            <div className="mt-6 grid gap-5 [@container(min-width:34rem)]:grid-cols-2">
              <div>
                <label htmlFor="workType" className={fieldLabel}>
                  Type of training work
                </label>
                <div className="relative mt-2">
                  <BriefcaseIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dusk" />
                  <select
                    id="workType"
                    value={workType ?? ""}
                    onChange={(e) => setWorkType(e.target.value as WorkType)}
                    aria-describedby="workType-note"
                    className={`${field} cursor-pointer appearance-none pl-12 pr-11 ${workType ? "" : "!text-dusk"}`}
                  >
                    <option value="" disabled>
                      Choose one
                    </option>
                    {WORK_TYPES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-accent-light" />
                </div>
                <FieldNote id="workType-note">{selectedWorkType ? selectedWorkType.hint : "Pick the closest match — you can change it anytime"}</FieldNote>
              </div>

              <div>
                <label htmlFor="filingStatus" className={fieldLabel}>
                  Filing status
                </label>
                <div className="relative mt-2">
                  <UserIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dusk" />
                  <select
                    id="filingStatus"
                    value={inputs.filingStatus}
                    onChange={(e) => handleInputChange("filingStatus", e.target.value as FilingStatus)}
                    aria-describedby="filingStatus-note"
                    className={`${field} cursor-pointer appearance-none pl-12 pr-11`}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-accent-light" />
                </div>
                <FieldNote id="filingStatus-note">Sets your standard deduction and tax brackets</FieldNote>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6">
              <button type="button" onClick={fillTypical} className={`inline-flex min-h-[44px] items-center rounded text-sm ${linkOnDark}`}>
                Not sure? Fill typical trainer numbers
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = !showAllFields;
                  setShowAllFields(next);
                  if (next) setDeductionsOpen(true);
                }}
                className="inline-flex min-h-[44px] items-center rounded text-sm font-semibold text-dusk underline-offset-4 hover:text-offwhite hover:underline"
              >
                {showAllFields ? "Use the guided view" : "Show all fields"}
              </button>
            </div>
          </section>

          {/* 1099 + W‑2 income */}
          <section className="border-t border-white/[.08] pt-8">
            <SectionHeading n={2} done={stepsDone[1]} current={currentStep === 1} />
            <div className="mt-6">
              <label htmlFor="gross1099" className={fieldLabel}>Gross training income</label>
              <span className={fieldHint}>Before expenses and deductions</span>
              <MoneyInput id="gross1099" value={inputs.gross1099} onChange={(v) => handleInputChange("gross1099", v)} warning={fieldWarnings.gross1099} />
              {/* relative: on phones the note anchors to this row, not the page. */}
              <div className="relative mt-1 flex items-center gap-0.5 text-xs text-dusk">
                <span>Count all of it — even payments that never came with a 1099.</span>
                <Tooltip label="Why income without a 1099 still counts" anchor="container">
                  <p>
                    <strong className="text-offwhite">Not receiving a 1099 doesn&apos;t mean it isn&apos;t taxable.</strong> For 2026, clients don&apos;t have to send you a 1099‑NEC unless they paid you $2,000+ (up from $600), and payment apps only issue a 1099‑K above $20,000 and 200 transactions. Track and report all your training income yourself, regardless of what forms show up.
                  </p>
                </Tooltip>
              </div>
            </div>

            {showW2Section && (
              <div className="mt-5 overflow-hidden rounded-tile border border-electric-light/30 bg-electric/[.05]">
                <p className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 border-b border-electric-light/20 bg-electric/[.07] px-4 py-3 text-sm font-semibold text-accent-light">
                  <DocumentIcon className="size-5" />
                  W‑2 income
                  <span className="font-normal text-dusk">— only if you also get a paycheck</span>
                </p>
                <div className="grid gap-5 p-4 [@container(min-width:30rem)]:grid-cols-2">
                  <div>
                    <label htmlFor="w2Wages" className={fieldLabel}>Annual W‑2 wages</label>
                    <span className={fieldHint}>Income from employment</span>
                    <MoneyInput id="w2Wages" value={inputs.w2Wages} onChange={(v) => handleInputChange("w2Wages", v)} warning={fieldWarnings.w2Wages} />
                  </div>
                  <div>
                    <label htmlFor="w2Withheld" className={fieldLabel}>Tax already withheld</label>
                    <span className={fieldHint}>From your W‑2 or pay stubs</span>
                    <MoneyInput id="w2Withheld" value={inputs.w2Withheld} onChange={(v) => handleInputChange("w2Withheld", v)} warning={fieldWarnings.w2Withheld} />
                  </div>
                </div>
                {workType === "hybrid" && (
                  <p className="mx-4 mb-4 flex gap-2.5 rounded-control border border-electric-light/25 bg-electric/[.08] p-3 text-xs leading-relaxed text-haze">
                    <InfoIcon className="mt-px size-4 flex-shrink-0 text-accent-light" />
                    <span>
                      <strong className="text-offwhite">Both boxes matter for you.</strong> Your gym already withheld Social Security on the W‑2 side, so entering those wages stops the calculator from charging you that portion twice on your private-client income.
                    </span>
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Deductions. Collapsed by default so the form stays short (the
              owner's call, Sept 2026) — but what's inside is never out of
              sight: while collapsed, every non-zero deduction shows as a chip
              with its amount, so the estimate stays explainable. */}
          <section id="deductions" className="scroll-mt-24 border-t border-white/[.08] pt-8">
            <SectionHeading n={3} done={stepsDone[2]} current={currentStep === 2}>
              <p className="mt-1 text-sm text-dusk">Most trainers miss at least one.</p>
            </SectionHeading>

            <button
              type="button"
              aria-expanded={deductionsOpen}
              aria-controls="deduction-fields"
              onClick={() => setDeductionsOpen((o) => !o)}
              className={`group mt-5 flex w-full items-center gap-4 rounded-tile border p-4 text-left transition-colors ${
                deductionsOpen
                  ? "border-electric-light/50 bg-electric/[.08]"
                  : "border-dashed border-electric-light/45 bg-electric/[.04] hover:border-electric-light/80 hover:bg-electric/[.09]"
              }`}
            >
              <PlusCircleIcon
                className={`size-9 flex-shrink-0 text-accent-light motion-safe:transition-transform motion-safe:duration-200 ${deductionsOpen ? "rotate-45" : ""}`}
                strokeWidth={1.5}
              />
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-accent-light">Optional</span>
                <span className="mt-1 block font-serif text-xl text-offwhite">
                  {deductionsOpen ? "Hide deductions" : filledDeductions.length > 0 ? "Edit your deductions" : "Add deductions"}
                </span>
                <span className="mt-0.5 block text-xs text-dusk">
                  {deductionsSum > 0 ? (
                    <>
                      <span className="font-semibold text-accent-light">{money(deductionsSum)} found</span>
                      {estimatedSavings > 0 && <> · ≈ {money(estimatedSavings)} saved in tax</>}
                    </>
                  ) : (
                    "Add only what applies to you."
                  )}
                </span>
              </span>
              <ChevronDownIcon
                className={`size-5 flex-shrink-0 text-dusk group-hover:text-offwhite motion-safe:transition-transform motion-safe:duration-200 ${deductionsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {!deductionsOpen && filledDeductions.length > 0 && (
              <ul aria-label="Deductions in your estimate" className="mt-3 flex flex-wrap gap-2">
                {filledDeductions.map((f) => (
                  <li key={f.key} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-haze">
                    {f.key === "gymRent" && workType === "studio" ? "Studio rent" : CHIP_LABELS[f.key]}{" "}
                    <span className="font-semibold tabular-nums text-offwhite">
                      {f.prefix ? `${inputs.deductions[f.key].toLocaleString("en-US")} ${f.prefix}` : money(inputs.deductions[f.key])}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div id="deduction-fields" hidden={!deductionsOpen} className="motion-safe:animate-[fade-in_200ms_ease-out]">
              <p className="mt-5 text-xs text-dusk">
                {workType === null
                  ? "Pick a work type above and this list narrows to what applies to you."
                  : "Showing what usually applies to your setup."}
              </p>

              {/* Two-up only on a genuinely wide card; narrower, the labels
                  squeezed onto three lines beside the amount box. */}
              <div className="mt-3 grid gap-2.5 [@container(min-width:48rem)]:grid-cols-2">
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
                  className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded text-sm font-semibold text-accent-light hover:text-offwhite"
                >
                  <PlusCircleIcon className="size-5" />
                  Show {hiddenDeductionCount} more {hiddenDeductionCount === 1 ? "deduction" : "deductions"}
                </button>
              )}
            </div>
          </section>

          {/* Ad slot: kept in the codebase for when real ads are wired up, but not
              rendered — a visible placeholder isn't something a live site should ship. */}
          {AD_SLOT_ENABLED && <AdSlot />}

          {/* mt-auto: when the results card is taller, this settles at the
              bottom of the stretched form card instead of floating mid-card. */}
          <div className="mt-auto border-t border-white/[.08] pt-6">
            {/* Below lg the results sit under this form. */}
            {hasIncome && (
              <button type="button" onClick={scrollToResults} className={`${button({ variant: "electric", size: "lg", full: true })} mb-4 lg:hidden`}>
                See my estimate
                <ArrowDownIcon className="size-4" />
              </button>
            )}
            <p className="flex items-center justify-center gap-2 text-center text-xs text-dusk">
              <LockIcon className="size-4 flex-shrink-0" />
              {embed ? "Nothing you type is stored or sent anywhere." : "Your numbers stay in this browser — private and secure."}
            </p>
          </div>
        </div>
      </div>

      {/* Results. The panel stretches to the form's height so the two cards
          always line up; its contents stick inside it while a long form
          scrolls (top-28 clears the 72px header; the embed has none).
          overflow-clip, not overflow-hidden: hidden makes a scroll container
          and silently disables the sticky child. */}
      <aside
        ref={asideRef}
        tabIndex={-1}
        aria-label="Your tax estimate"
        className="print:col-span-2 glass-glow relative flex scroll-mt-24 flex-col overflow-clip rounded-card p-6 text-offwhite md:p-8"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-electric/25 blur-3xl" />
        <div className={`relative flex flex-col [container-type:inline-size] lg:sticky ${embed ? "lg:top-6" : "lg:top-28"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="eyebrow text-haze">Your tax estimate</p>
              <span className="rounded-full border border-white/15 bg-white/[.04] px-2.5 py-1 text-xs font-semibold tabular-nums text-offwhite">
                {TAX_CONFIG.TAX_YEAR}
              </span>
            </div>
            {/* Saving needs an account, and the embed must stay anonymous. */}
            {!embed && hasIncome && <SaveEstimateButton inputs={inputs} results={results} />}
          </div>

          {!hasIncome ? (
            <EmptyResultsState />
          ) : (
            <div aria-live="polite" className="flex flex-col motion-safe:animate-[results-in_320ms_ease-out]">
              {deductionsExceedIncome && (
                <div className="mt-6 flex items-start gap-2 rounded-control border border-gold/35 bg-gold/[.08] px-3 py-2.5 text-xs text-gold-light">
                  <AlertIcon className="mt-px size-4 flex-shrink-0" />
                  <span>
                    Your deductions ({money(deductionsSum)}) exceed your gross training income. Double-check your numbers — profit below $0 is shown as $0.
                  </span>
                </div>
              )}

              {results.qbiAboveSimpleThreshold && (
                <div className="mt-6 flex items-start gap-2 rounded-control border border-gold/35 bg-gold/[.08] px-3 py-2.5 text-xs text-gold-light">
                  <AlertIcon className="mt-px size-4 flex-shrink-0" />
                  <span>
                    Your income is above the $201,750 / $403,500 QBI phase-in threshold, where the real deduction gets more complex (W‑2 wage and property limits, possible SSTB rules). This estimate uses a simplified flat calculation above that point — talk to a CPA.
                  </span>
                </div>
              )}

              {/* Quarterly payment is the most actionable number on the page — it's what a trainer actually has to go do something about four times a year. */}
              <div className="mt-7 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow text-haze">Quarterly payment</p>
                  <p key={results.quarterlyPayment} className="value-pop mt-2 type-figure text-glow text-[3.6rem] leading-none md:text-7xl">
                    {money(results.quarterlyPayment)}
                  </p>
                </div>
                <PlanTile />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-haze">
                Set aside this amount by <strong className="text-offwhite">Apr 15, Jun 15, Sep 15 &amp; Jan 15</strong> — {money(results.amountOwed)} for the year.
              </p>

              {/* Action hierarchy: one primary (the calendar, which is what a
                  trainer has to act on four times a year), one secondary (the
                  breakdown), and a quiet tertiary action. */}
              <div className="mt-6 flex flex-col gap-3">
                <button type="button" onClick={downloadIcs} className={button({ variant: "glow", size: "lg", full: true })}>
                  <CalendarIcon className="size-5" />
                  Add due dates to calendar
                  <ChevronRightIcon className="size-4" />
                </button>
                {!embed && (
                  <Link href="/dashboard" className={button({ variant: "secondary", size: "lg", full: true })}>
                    See the full breakdown
                    <ArrowRightIcon className="size-4" />
                  </Link>
                )}
              </div>

              {/* Printing from inside a third-party site's iframe is unpredictable. */}
              {!embed && (
                <div className="mt-2 flex justify-center">
                  <button type="button" onClick={() => window.print()} className={button({ variant: "ghost", size: "sm" })}>
                    <PrinterIcon className="size-4" />
                    Print / save as PDF
                  </button>
                </div>
              )}

              <TaxBreakdownBar
                w2Wages={inputs.w2Wages}
                gross1099={inputs.gross1099}
                seTax={results.seTax.total}
                federalTax={results.federalTax}
                money={money}
                info={
                  <Tooltip label="What is SE tax?" align="left">
                    {"Self-employment (SE) tax covers Social Security and Medicare — the share normally split between an employer and employee, but paid entirely by you when you're self-employed."}
                  </Tooltip>
                }
              />

              <div className="mt-6 divide-y divide-white/[.07] rounded-tile border border-white/10 bg-white/[.02] text-sm">
                <ResultRow icon={TrendIcon} label="Net self-employment profit" value={results.netSeProfit} />
                <ResultRow icon={ShieldIcon} label="Total SE tax" value={results.seTax.total} />
                <ResultRow icon={DocumentIcon} label="Federal income tax" value={results.federalTax} />
                {inputs.w2Withheld > 0 && <ResultRow icon={ReceiptIcon} label="W‑2 tax already withheld" value={-inputs.w2Withheld} />}
                <ResultRow icon={CoinsIcon} label="Total estimated liability" value={results.totalLiability} bold />
              </div>

              {/* TODO: LLC vs S-Corp savings indicator — needs CPA-reviewed logic before shipping real numbers */}
              {results.netSeProfit > 80000 && (
                <p className="mt-5 flex items-start justify-center gap-1.5 text-center text-xs text-haze">
                  <InfoIcon className="size-4 flex-shrink-0 text-accent-light" />
                  You&apos;re earning enough that an S-Corp might save you money. (Comparison coming soon)
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 rounded-control border border-white/10 bg-white/[.02] py-1 pl-4 pr-2">
            <p className="flex items-center gap-2.5 py-2 text-xs leading-snug text-dusk">
              <BulbIcon className="size-5 flex-shrink-0 text-gold" />
              This is an estimate, not tax or legal advice.
            </p>
            <Link
              href="/terms#disclaimer"
              target={embed ? "_blank" : undefined}
              rel={embed ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-[44px] flex-shrink-0 items-center gap-1 rounded px-2 text-xs font-semibold text-accent-light hover:text-offwhite"
            >
              Learn more
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile summary bar (see showSummaryBar). Not in embed mode: a fixed bar
          inside a host page's iframe would float over their layout. Opaque on
          purpose, so the page never shows through behind the number. */}
      {!embed && (
        <div
          className={`print:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-panel px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 text-offwhite shadow-[0_-12px_32px_rgba(0,0,0,.55)] transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:hidden ${
            showSummaryBar ? "visible translate-y-0" : "invisible translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-accent-light">Quarterly payment</p>
              <p className="type-figure text-2xl">{money(results.quarterlyPayment)}</p>
            </div>
            <button type="button" onClick={scrollToResults} className={button({ variant: "electric", size: "sm" })}>
              See estimate
              <ArrowDownIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Decorative gold chart tile beside the quarterly figure. Only shown when
 *  the results panel is wide enough to hold both without squeezing the number. */
function PlanTile() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[112px] w-[128px] flex-shrink-0 overflow-hidden rounded-tile border border-gold/30 bg-gradient-to-br from-deep3 via-deep2 to-ink shadow-[0_0_30px_-12px_rgba(217,178,95,.6)] [@container(min-width:26rem)]:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_85%_10%,rgba(217,178,95,.22),transparent_60%)]" />
      <svg viewBox="0 0 128 112" className="absolute inset-0 size-full text-gold">
        <polyline
          points="6,82 22,74 34,79 50,62 64,67 80,46 96,50 118,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_6px_rgba(217,178,95,.9)]"
        />
        <circle cx="118" cy="20" r="2.4" fill="currentColor" className="text-gold-light" />
        <circle cx="80" cy="46" r="1.2" fill="currentColor" opacity=".7" />
        <circle cx="100" cy="14" r=".8" fill="currentColor" opacity=".6" />
        <circle cx="60" cy="30" r=".7" fill="currentColor" opacity=".45" />
      </svg>
      <p className="absolute bottom-2.5 left-3 font-serif text-[15px] leading-[1.1] text-offwhite">
        Plan smart.
        <br />
        Keep more.
      </p>
    </div>
  );
}

function TaxBreakdownBar({
  w2Wages,
  gross1099,
  seTax,
  federalTax,
  money,
  info,
}: {
  w2Wages: number;
  gross1099: number;
  seTax: number;
  federalTax: number;
  money: (n: number) => string;
  info?: React.ReactNode;
}) {
  const total = w2Wages + gross1099;
  if (total <= 0) return null;
  const seTaxPct = Math.max(0, Math.min(100, (seTax / total) * 100));
  const fedTaxPct = Math.max(0, Math.min(100 - seTaxPct, (federalTax / total) * 100));
  const takeHomePct = Math.max(0, 100 - seTaxPct - fedTaxPct);
  const takeHome = Math.max(0, total - seTax - federalTax);

  const legend = [
    { label: "Self-employment", value: seTax, pct: seTaxPct, dot: "bg-accent" },
    { label: "Federal", value: federalTax, pct: fedTaxPct, dot: "bg-violet" },
    { label: "Take-home", value: takeHome, pct: takeHomePct, dot: "bg-white/40" },
  ];

  return (
    <div className="mt-8 border-t border-white/[.08] pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-0.5">
            <p className="eyebrow text-haze">Where your income goes</p>
            {info}
          </div>
          <p className="text-xs text-dusk">A simple estimate, updated live</p>
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums text-offwhite sm:text-lg">{money(takeHome)}</p>
          <p className="text-xs text-dusk">take-home</p>
        </div>
      </div>

      <div aria-hidden="true" className="mt-5 flex justify-between text-xs tabular-nums text-fog">
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>
      <div
        className="relative mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10"
        role="img"
        aria-label={`${seTaxPct.toFixed(0)}% self-employment tax, ${fedTaxPct.toFixed(0)}% federal tax, ${takeHomePct.toFixed(0)}% take-home`}
      >
        <div className="h-full bg-accent shadow-[0_0_12px_rgba(31,182,255,.8)]" style={{ width: `${seTaxPct}%` }} />
        <div className="h-full bg-violet" style={{ width: `${fedTaxPct}%` }} />
        <div className="h-full bg-white/30" style={{ width: `${takeHomePct}%` }} />
        {[25, 50, 75].map((t) => (
          <span key={t} className="absolute inset-y-0 w-px bg-ink/70" style={{ left: `${t}%` }} />
        ))}
      </div>

      {/* Rows on a narrow panel, three columns once it has room — the
          columns used to break "Self-employment" across two lines. */}
      <dl className="mt-4 grid gap-2 [@container(min-width:27rem)]:grid-cols-3 [@container(min-width:27rem)]:gap-3">
        {legend.map((l) => (
          <div key={l.label} className="flex min-w-0 items-baseline justify-between gap-3 [@container(min-width:27rem)]:block">
            <dt className="flex items-center gap-1.5 whitespace-nowrap text-xs text-dusk">
              <span aria-hidden="true" className={`size-2 flex-shrink-0 rounded-full ${l.dot}`} />
              {l.label}
            </dt>
            <dd className="whitespace-nowrap text-right [@container(min-width:27rem)]:mt-1 [@container(min-width:27rem)]:text-left">
              <span className="text-sm font-semibold tabular-nums text-offwhite [@container(min-width:27rem)]:block">{money(l.value)}</span>
              <span className="ml-2 text-xs tabular-nums text-fog [@container(min-width:27rem)]:ml-0 [@container(min-width:27rem)]:block">{l.pct.toFixed(1)}%</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EmptyResultsState() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full border border-electric-light/40 bg-electric/10 text-accent-light shadow-[0_0_30px_-8px_rgba(42,98,255,.8)]">
        <DollarIcon className="size-6" />
      </div>
      <p className="mb-1 font-serif text-2xl text-offwhite">Your estimate will appear here</p>
      <p className="max-w-[260px] text-sm text-dusk">Add your income and this panel fills in, live.</p>
      <ul className="mt-6 w-full max-w-[280px] space-y-2.5 text-left text-sm text-haze">
        {[
          "What to set aside each quarter",
          "The four IRS due dates, downloadable",
          "Self-employment tax and federal tax, split out",
          "Where your income actually goes",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 size-4 flex-shrink-0 text-accent" strokeWidth={2.25} />
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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-field font-medium text-haze">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          className={`${field} pl-9`}
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
    // lights the card, so the compact field has a focus state you can see
    // from across the form, not just its own border.
    <div className="relative flex items-center justify-between gap-3 rounded-tile border border-white/10 bg-white/[.025] py-3 pl-4 pr-3 transition-colors hover:border-white/20 focus-within:border-electric-light/70 focus-within:bg-electric/[.06]">
      <div className="flex min-w-0 flex-1 items-center gap-0.5">
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-label font-semibold leading-snug text-offwhite">{label}</label>
          <p className="mt-0.5 text-xs leading-snug text-dusk">{hint}</p>
        </div>
        {tooltipText && (
          <Tooltip label={`More information about ${label}`} anchor="container">
            <p>{tooltipText}</p>
            {learnMoreLink && (
              <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block rounded ${linkOnDark}`}>
                Learn more
              </a>
            )}
          </Tooltip>
        )}
      </div>
      <div className="flex w-[7.25rem] flex-shrink-0 flex-col items-end">
        <div className="flex h-11 w-full items-center gap-1 rounded-control border border-edge bg-ink/40 px-3 transition-colors focus-within:border-electric-light focus-within:shadow-[0_0_0_3px_rgba(42,98,255,.2)]">
          {prefix === "$" && <span className="text-sm text-dusk">$</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min="0"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            // The box border and halo carry focus; the global outline would
            // draw a second ring around the bare input inside it.
            className="w-full min-w-0 bg-transparent text-right font-semibold tabular-nums text-offwhite placeholder:text-fog focus-visible:outline-none"
            placeholder="0"
            aria-describedby={warning ? `${id}-warning` : undefined}
            aria-invalid={warning ? true : undefined}
          />
          {prefix !== "$" && <span className="text-xs text-dusk">{prefix}</span>}
        </div>
        {warning ? (
          <p id={`${id}-warning`} role="alert" className={`${fieldError} justify-end text-right`}>{warning}</p>
        ) : savings && savings > 0.5 ? (
          <p className="mt-1 text-xs text-accent-light">≈ {money(savings)} saved</p>
        ) : null}
      </div>
    </div>
  );
}

function ResultRow({
  icon: Icon,
  label,
  value,
  bold,
}: {
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <span className={`flex items-center gap-3 ${bold ? "font-semibold text-offwhite" : "text-haze"}`}>
        <Icon className="size-5 flex-shrink-0 text-dusk" />
        {label}
      </span>
      <span key={value} className={`value-pop tabular-nums text-offwhite ${bold ? "text-base font-semibold" : "font-medium"}`}>
        {value < 0 ? "− " : ""}
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(value))}
      </span>
    </div>
  );
}
