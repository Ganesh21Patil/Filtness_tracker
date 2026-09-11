"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { downloadQuarterlyIcs } from "../lib/ics";
import { button } from "./ui";
import { AlertIcon, CalendarIcon, ChevronDownIcon } from "./icons";
import {
  BLS_TRAINER_WAGES,
  TAX_CONFIG,
  calculateTaxes,
  quarterlyDueDates,
  sumDeductions,
  type TaxInputs,
  type TaxResults,
} from "../lib/calculator";

const STORAGE_KEY = "trainerledger-inputs-v2";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function hasShape(v: any): v is TaxInputs {
  return v && typeof v === "object" && v.deductions && typeof v.deductions.mileageH1 === "number";
}

interface SavedRow {
  id: string;
  created_at: string;
  tax_year: number;
  inputs: TaxInputs;
  results: TaxResults;
}

/** Categories a working trainer plausibly has a real cost for. Used only to
 *  prompt, never to claim they "missed" money: we have no idea what they
 *  actually spent, so no dollar figure is ever attached to a blank field. */
const PROMPTABLE: { key: keyof TaxInputs["deductions"]; label: string; note: string }[] = [
  { key: "liabilityIns", label: "Liability insurance", note: "Most trainers carry it; it usually runs $150–$300 a year." },
  { key: "certs", label: "Certifications & CEUs", note: "Renewals and continuing education generally qualify." },
  { key: "mileageH1", label: "Business mileage", note: "Driving between clients counts. Commuting doesn't." },
  { key: "software", label: "Coaching software & apps", note: "Scheduling, programming, and payment fees are business costs." },
  { key: "equipment", label: "Equipment", note: "Gear you buy for client sessions is generally deductible in full." },
];

/** The three published BLS points drawn on the benchmark scale. Ticks and
 *  labels both read from this list so they stay in lockstep. */
const BLS_MARKERS = [
  { value: BLS_TRAINER_WAGES.PERCENTILE_10, label: "10th" },
  { value: BLS_TRAINER_WAGES.MEDIAN, label: "median" },
  { value: BLS_TRAINER_WAGES.PERCENTILE_90, label: "90th" },
];

const CATEGORY_LABELS: Record<keyof TaxInputs["deductions"], string> = {
  certs: "Certifications & CEUs",
  liabilityIns: "Liability insurance",
  gymRent: "Gym / studio rent",
  equipment: "Equipment",
  software: "Software & apps",
  mileageH1: "Mileage (Jan–Jun)",
  mileageH2: "Mileage (Jul–Dec)",
  apparel: "Branded apparel",
  marketing: "Marketing",
  homeOffice: "Home office",
  other: "Other expenses",
};

function Card({ title, children, className = "", glow = false }: { title?: string; children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <section className={`${glow ? "glass-glow" : "glass"} rounded-card p-6 sm:p-8 ${className}`}>
      {title && <h2 className="mb-5 eyebrow text-accent-light">{title}</h2>}
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [sessionInputs, setSessionInputs] = useState<TaxInputs | null | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState<SavedRow[]>([]);
  const [sourceId, setSourceId] = useState<string>("current");
  const [scenarioIncome, setScenarioIncome] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      setSessionInputs(hasShape(parsed) ? parsed : null);
    } catch {
      setSessionInputs(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("saved_estimates")
      .select("id, created_at, tax_year, inputs, results")
      .order("created_at", { ascending: false })
      .then(({ data }) => setSaved((data as unknown as SavedRow[]) ?? []));
  }, [user]);

  const savedRow = saved.find((s) => s.id === sourceId);
  const isSavedView = !!savedRow;

  // A saved estimate shows the numbers frozen at save time; the live session
  // recomputes. Never silently re-run an old snapshot through new tax rules.
  const inputs = savedRow ? savedRow.inputs : sessionInputs ?? null;
  const results = useMemo(() => {
    if (!inputs) return null;
    return savedRow ? savedRow.results : calculateTaxes(inputs);
  }, [inputs, savedRow]);

  if (sessionInputs === undefined) {
    return (
      <div aria-busy="true" className="space-y-4">
        <span className="sr-only">Loading your breakdown…</span>
        <div className="skeleton h-32 rounded-card" />
        <div className="skeleton h-40 rounded-card" />
        <div className="skeleton h-56 rounded-card" />
      </div>
    );
  }

  const grossIncome = inputs ? inputs.gross1099 + inputs.w2Wages : 0;
  const hasCalculation = !!inputs && !!results && grossIncome > 0;

  if (!hasCalculation && saved.length === 0) {
    return (
      <Card>
        <div className="py-6 text-center">
          <p className="font-serif text-2xl text-offwhite">Nothing to break down yet</p>
          <p className="mt-2 text-haze">Run a calculation first and your full breakdown appears here.</p>
          <Link href="/calculator" className={`mt-6 ${button({ size: "lg" })}`}>
            Go to the calculator
          </Link>
        </div>
      </Card>
    );
  }

  if (!inputs || !results) {
    return (
      <Card>
        <p className="text-center text-haze">Pick a saved estimate above to see its breakdown.</p>
      </Card>
    );
  }

  const deductions = sumDeductions(inputs.deductions);
  const effectiveRate = grossIncome > 0 ? results.totalLiability / grossIncome : 0;
  const takeHome = Math.max(0, grossIncome - results.totalLiability - deductions);

  const segments = [
    { label: "SE tax", value: results.seTax.total, className: "bg-accent" },
    { label: "Federal tax", value: results.federalTax, className: "bg-violet" },
    { label: "Business expenses", value: deductions, className: "bg-gold/70" },
    { label: "Take-home", value: takeHome, className: "bg-white/30" },
  ].map((s) => ({ ...s, share: grossIncome > 0 ? s.value / grossIncome : 0 }));

  const topCategories = (Object.keys(inputs.deductions) as (keyof TaxInputs["deductions"])[])
    .map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      value:
        key === "mileageH1"
          ? inputs.deductions.mileageH1 * TAX_CONFIG.MILEAGE_RATE_H1
          : key === "mileageH2"
            ? inputs.deductions.mileageH2 * TAX_CONFIG.MILEAGE_RATE_H2
            : inputs.deductions[key],
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const untouched = PROMPTABLE.filter((p) =>
    p.key === "mileageH1" ? inputs.deductions.mileageH1 === 0 && inputs.deductions.mileageH2 === 0 : inputs.deductions[p.key] === 0
  );

  // BLS comparison uses training income only — that's the self-employment
  // figure the occupation's wages are loosely comparable to.
  const trainingIncome = inputs.gross1099;
  // The scale is FIXED to the published range, not stretched to fit the user.
  // If it grew with income, the three BLS markers would slide leftward as someone
  // earned more and the labels would no longer sit under their own ticks —
  // the reader would misjudge their own position against the benchmark.
  const scaleMax = BLS_TRAINER_WAGES.PERCENTILE_90 * 1.25;
  const markerPct = (v: number) => Math.min(100, Math.max(0, (v / scaleMax) * 100));
  const markerPos = (v: number) => `${markerPct(v)}%`;
  const aboveScale = trainingIncome > scaleMax;
  const benchmarkSentence = () => {
    if (trainingIncome <= 0) return "Add your training income to see where it sits against national figures.";
    if (trainingIncome < BLS_TRAINER_WAGES.PERCENTILE_10)
      return `Your ${money(trainingIncome)} sits below the BLS 10th percentile of ${money(BLS_TRAINER_WAGES.PERCENTILE_10)}.`;
    if (trainingIncome < BLS_TRAINER_WAGES.MEDIAN)
      return `Your ${money(trainingIncome)} sits between the BLS 10th percentile and the ${money(BLS_TRAINER_WAGES.MEDIAN)} median.`;
    if (trainingIncome < BLS_TRAINER_WAGES.PERCENTILE_90)
      return `Your ${money(trainingIncome)} is above the national median of ${money(BLS_TRAINER_WAGES.MEDIAN)} for fitness trainers.`;
    return `Your ${money(trainingIncome)} is above the BLS 90th percentile of ${money(BLS_TRAINER_WAGES.PERCENTILE_90)}.`;
  };

  const dues = quarterlyDueDates(isSavedView ? savedRow.tax_year : TAX_CONFIG.TAX_YEAR);
  const today = new Date();
  const nextDue = dues.find((d) => d.date > today);

  const scenario =
    scenarioIncome === null || isSavedView
      ? null
      : calculateTaxes({ ...inputs, gross1099: scenarioIncome });

  return (
    // Two columns from lg: the headline and the income bar span the width,
    // then related cards pair up (benchmark | deductions, plan | what-if).
    // Rows stretch, so paired cards share a height and edges line up.
    <div className="grid gap-5 lg:grid-cols-2 motion-safe:animate-[results-in_320ms_ease-out]">
      {saved.length > 0 && (
        <div className="glass flex flex-wrap items-center gap-3 rounded-tile px-5 py-3 lg:col-span-2">
          <label htmlFor="estimate-source" className="eyebrow text-accent-light">
            Showing
          </label>
          <div className="relative">
            <select
              id="estimate-source"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="min-h-[44px] cursor-pointer appearance-none rounded-control border border-edge bg-panel py-2 pl-3 pr-10 text-sm text-offwhite"
            >
              {sessionInputs && <option value="current">This session&apos;s estimate</option>}
              {saved.map((s) => (
                <option key={s.id} value={s.id}>
                  Saved {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {s.tax_year}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-light" />
          </div>
          {isSavedView && <span className="text-xs text-fog">Frozen at save time, using {savedRow.tax_year} rules.</span>}
        </div>
      )}

      {/* 1. HEADLINE */}
      <Card glow className="relative overflow-hidden lg:col-span-2">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-electric/25 blur-3xl" />
        <div className="relative grid gap-8 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-haze">Every quarter</p>
            <p className="mt-2 type-figure text-glow text-6xl">{money(results.quarterlyPayment)}</p>
          </div>
          <div className="sm:border-l sm:border-white/[.08] sm:pl-8">
            <p className="eyebrow text-fog">Total tax for the year</p>
            <p className="mt-2 type-figure text-4xl">{money(results.totalLiability)}</p>
          </div>
          <div className="sm:border-l sm:border-white/[.08] sm:pl-8">
            <p className="eyebrow text-fog">Effective rate</p>
            <p className="mt-2 type-figure text-4xl">{pct(effectiveRate)}</p>
            <p className="mt-1 text-xs text-fog">of {money(grossIncome)} gross</p>
          </div>
        </div>
      </Card>

      {/* 2. WHERE YOUR MONEY GOES */}
      <Card title="Where your money goes" className="lg:col-span-2">
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-white/10"
          role="img"
          aria-label={segments.map((s) => `${s.label} ${pct(s.share)}`).join(", ")}
        >
          {segments.map((s) => (
            <div key={s.label} className={`h-full ${s.className}`} style={{ width: `${s.share * 100}%` }} />
          ))}
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((s) => (
            <div key={s.label} className="rounded-control border border-white/[.08] bg-white/[.02] p-4">
              <dt className="flex items-center gap-2 text-xs text-dusk">
                <span aria-hidden="true" className={`size-2.5 flex-shrink-0 rounded-full ${s.className}`} />
                {s.label}
              </dt>
              <dd className="mt-2">
                <span className="block text-lg font-semibold tabular-nums text-offwhite">{money(s.value)}</span>
                <span className="text-xs tabular-nums text-fog">{pct(s.share)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* 3. BLS BENCHMARK */}
      <Card title="How you compare">
        <p className="text-lg leading-relaxed text-offwhite">{benchmarkSentence()}</p>
        <div className="mt-6">
          <div className="relative h-2 w-full rounded-full bg-white/10">
            {BLS_MARKERS.map((m) => (
              <span key={m.value} aria-hidden="true" className="absolute top-0 h-2 w-px bg-white/40" style={{ left: markerPos(m.value) }} />
            ))}
            {trainingIncome > 0 && (
              <span
                aria-hidden="true"
                className={`absolute -top-1 size-4 rounded-full border-2 border-ink bg-accent shadow-[0_0_12px_rgba(31,182,255,.9)] ${aboveScale ? "-translate-x-full" : "-translate-x-1/2"}`}
                style={{ left: markerPos(trainingIncome) }}
              />
            )}
          </div>
          {/* Each label is pinned to its own tick's percentage, so the two can
              never drift apart. The end labels shift inward instead of
              centring so they don't hang off the edge of the card. */}
          <div className="relative mt-2 h-8 text-xs text-fog">
            {BLS_MARKERS.map((m) => {
              const p = markerPct(m.value);
              return (
                <span
                  key={m.value}
                  className="absolute top-0 whitespace-nowrap"
                  style={{
                    left: `${p}%`,
                    transform: p > 92 ? "translateX(-100%)" : p < 8 ? "none" : "translateX(-50%)",
                  }}
                >
                  {money(m.value)}
                  <br />
                  {m.label}
                </span>
              );
            })}
          </div>
          {aboveScale && (
            <p className="text-xs text-fog">
              Your income is past the end of this scale, so the marker sits at the edge.
            </p>
          )}
        </div>
        <p className="mt-6 flex gap-2 rounded-control border border-gold/30 bg-gold/[.07] p-3 text-xs leading-relaxed text-gold-light">
          <AlertIcon className="mt-px size-4 flex-shrink-0" />
          <span>
            Treat this as rough context, not a like-for-like comparison. BLS tracks <strong>employed</strong> trainers and
            includes part-time roles, so those figures aren&apos;t measuring the same thing as a self-employed trainer&apos;s
            gross training income.
          </span>
        </p>
        <p className="mt-3 text-xs text-dusk">
          Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics,{" "}
          {BLS_TRAINER_WAGES.REFERENCE}, SOC {BLS_TRAINER_WAGES.SOC_CODE}.{" "}
          <a href={BLS_TRAINER_WAGES.SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-offwhite">
            bls.gov
          </a>
        </p>
      </Card>

      {/* 4. DEDUCTION PICTURE */}
      <Card title="Your deduction picture">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="type-figure text-4xl">{money(deductions)}</p>
          <p className="text-sm text-dusk">
            claimed{grossIncome > 0 ? `, ${pct(deductions / grossIncome)} of your gross income` : ""}
          </p>
        </div>

        {topCategories.length > 0 && (
          <dl className="mt-5 space-y-2.5">
            {topCategories.map((c) => (
              // The label takes its own line on a phone: sharing one row with
              // a fixed-width label and value left the bar ~14px wide at 360px.
              <div key={c.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <dt className="w-full flex-shrink-0 truncate text-haze sm:w-40">{c.label}</dt>
                <dd className="flex flex-1 items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-gradient-to-r from-accent to-electric-light" style={{ width: `${(c.value / topCategories[0].value) * 100}%` }} />
                  </span>
                  <span className="w-20 text-right tabular-nums">{money(c.value)}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {untouched.length > 0 && (
          <div className="mt-6 border-t border-white/[.08] pt-5">
            <p className="text-sm font-semibold">Left at zero</p>
            <p className="mt-1 text-xs text-fog">
              We don&apos;t know what you actually spend, so these are prompts, not missed money.
            </p>
            <ul className="mt-3 space-y-2">
              {untouched.map((u) => (
                <li key={u.key} className="text-sm text-haze">
                  <span className="font-medium text-offwhite">{u.label}.</span> {u.note}
                </li>
              ))}
            </ul>
            <Link href="/deductions" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-light hover:underline">
              Go add them
            </Link>
          </div>
        )}
      </Card>

      {/* 5. QUARTERLY PLAN */}
      <Card title="Your quarterly plan" className={isSavedView ? "lg:col-span-2" : undefined}>
        <ul className="space-y-2">
          {dues.map(({ label, date }) => {
            const isNext = nextDue?.label === label;
            const passed = date <= today;
            const days = Math.ceil((date.getTime() - today.getTime()) / 86400000);
            return (
              <li
                key={label}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-control border px-4 py-3 ${
                  isNext ? "border-electric-light/50 bg-electric/[.1] shadow-[0_0_24px_-12px_rgba(42,98,255,.9)]" : "border-white/10 bg-white/[.02]"
                }`}
              >
                <span className="text-sm">
                  <span className="font-semibold">{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  {isNext && <span className="ml-2 text-xs font-semibold text-accent-light">next · in {days} {days === 1 ? "day" : "days"}</span>}
                  {passed && <span className="ml-2 text-xs text-dusk">passed</span>}
                </span>
                <span className="tabular-nums font-semibold">{money(results.quarterlyPayment)}</span>
              </li>
            );
          })}
        </ul>
        {!nextDue && <p className="mt-3 text-xs text-fog">All four dates for this tax year have passed.</p>}
        <button
          type="button"
          onClick={() => downloadQuarterlyIcs(results.quarterlyPayment, isSavedView ? savedRow.tax_year : TAX_CONFIG.TAX_YEAR)}
          className={`mt-5 ${button({ variant: "glow", size: "lg", full: true })}`}
        >
          <CalendarIcon className="size-5" />
          Add due dates to calendar
        </button>
      </Card>

      {/* 6. WHAT IF */}
      {!isSavedView && (
        <Card title="What if you earned more?">
          <label htmlFor="scenario-income" className="block text-sm text-haze">
            Training income
            <span className="ml-2 font-semibold tabular-nums text-offwhite">{money(scenarioIncome ?? inputs.gross1099)}</span>
          </label>
          <input
            id="scenario-income"
            type="range"
            min={0}
            max={Math.max(150000, Math.round(inputs.gross1099 * 2))}
            step={1000}
            value={scenarioIncome ?? inputs.gross1099}
            onChange={(e) => setScenarioIncome(Number(e.target.value))}
            // h-11 keeps the drag target at 44px on touch; the track itself
            // still renders at its natural height inside it.
            className="mt-3 h-11 w-full cursor-pointer accent-accent"
          />
          <p className="mt-2 text-xs text-fog">Keeps your current deductions and filing status. One variable at a time.</p>

          {scenario && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-control border border-white/10 bg-white/[.02] p-4">
                <p className="eyebrow text-fog">Now · {money(inputs.gross1099)}</p>
                <p className="mt-1 type-figure text-2xl">{money(results.quarterlyPayment)}<span className="ml-1 font-sans text-sm text-fog">/qtr</span></p>
                <p className="mt-1 text-xs text-fog">{money(results.totalLiability)} total · {pct(effectiveRate)}</p>
              </div>
              <div className="rounded-control border border-electric-light/40 bg-electric/[.08] p-4">
                <p className="eyebrow text-accent-light">If · {money(scenarioIncome ?? 0)}</p>
                <p className="mt-1 type-figure text-2xl">{money(scenario.quarterlyPayment)}<span className="ml-1 font-sans text-sm text-fog">/qtr</span></p>
                <p className="mt-1 text-xs text-fog">
                  {money(scenario.totalLiability)} total ·{" "}
                  {pct(((scenarioIncome ?? 0) + inputs.w2Wages) > 0 ? scenario.totalLiability / ((scenarioIncome ?? 0) + inputs.w2Wages) : 0)}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      <p className="px-2 text-center text-xs leading-relaxed text-dusk lg:col-span-2">
        For planning purposes only — not formal tax or legal advice.
      </p>
    </div>
  );
}
