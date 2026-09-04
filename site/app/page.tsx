import Link from "next/link";
import Calculator from "../components/Calculator";
import { calculateTaxes } from "../lib/calculator";

const heroImage = "https://images.unsplash.com/photo-1614367674345-f414b2be3e5b?auto=format&fit=crop&w=1600&h=1900&q=85";

const guides = [
  ["01", "What counts as a business expense?", "Understand the line between personal spending and expenses connected to running your training business.", "/guides/personal-trainer-tax-deductions"],
  ["02", "Business mileage, explained", "Learn which drives may qualify and why accurate records matter.", "/guides/personal-trainer-tax-deductions#mileage"],
  ["03", "1099 trainer taxes, untangled", "See the difference between your business income, expenses, and tax liability.", "/guides/1099-vs-w2-personal-trainers"],
] as const;

function Spark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none">
      <path d="M36 0c2.8 24.8 11.2 33.2 36 36-24.8 2.8-33.2 11.2-36 36-2.8-24.8-11.2-33.2-36-36C24.8 33.2 33.2 24.8 36 0Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  // Illustrative example for the hero's floating stat card, computed with the
  // real tax engine (not a fabricated number) using representative sample inputs.
  const heroPreview = calculateTaxes({
    filingStatus: "single",
    w2Wages: 0,
    w2Withheld: 0,
    gross1099: 85000,
    deductions: { certs: 0, liabilityIns: 0, gymRent: 0, equipment: 0, software: 0, mileage: 0, apparel: 0, marketing: 0, homeOffice: 0, other: 0 },
  });
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <main className="flex-1 overflow-hidden">
      {/* HERO */}
      <section id="top" className="relative mx-auto grid min-h-[720px] max-w-[1440px] items-center px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
        <div className="pointer-events-none absolute left-[8%] top-20 size-[500px] rounded-full bg-violet/30 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-[10%] size-80 rounded-full bg-accent/15 blur-[110px]" />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[.2em] text-accent-light">Tax clarity for trainers who do more</p>
          <h1 className="font-serif text-[clamp(3.4rem,8.5vw,8.4rem)] leading-[.83] tracking-[-.065em]">
            Build a business
            <br />
            that <i className="text-violet-light font-serif">moves</i>
            <br />
            with you.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-offwhite/80">
            A free tax estimate built for independent trainers, gym contractors, and hybrid coaches. Put your income, deductions, and next move in one clear view.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#calculator" className="rounded-full bg-accent px-6 py-3.5 font-semibold text-ink transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,199,239,.25)]">
              Calculate my taxes <span className="ml-2">↗</span>
            </a>
            <Link href="/guides/personal-trainer-tax-deductions" className="rounded-full border border-white/20 px-6 py-3.5 font-semibold transition hover:bg-white/10">
              Explore guides
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-16 h-[510px] w-full max-w-md lg:mt-0">
          <div className="animate-float-card absolute -left-10 top-10 z-10 rounded-2xl border border-white/15 bg-panel/90 p-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[.18em] text-offwhite/60">Quarterly reserve</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{money(Math.round(heroPreview.quarterlyPayment))}</p>
            <div className="mt-2 h-1.5 w-32 overflow-hidden rounded bg-white/15">
              <div className="h-full w-[72%] rounded bg-accent" />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="Personal trainer in a dark gym" className="h-full w-full rounded-[140px_140px_22px_22px] object-cover object-center opacity-90" />
          <div className="pointer-events-none absolute inset-0 rounded-[140px_140px_22px_22px] bg-gradient-to-t from-ink2/80 via-transparent" />
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
            <p className="text-sm">
              For every way
              <br />
              you coach.
            </p>
            <Spark className="animate-spin-slow size-11 text-accent" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-white/10 bg-ink2 py-5">
        <div className="marquee-track flex whitespace-nowrap text-xl text-offwhite/85">
          <span>FREE TO USE&nbsp;&nbsp; ✦ &nbsp;&nbsp;TRAINER-SPECIFIC DEDUCTIONS&nbsp;&nbsp; ✦ &nbsp;&nbsp;YOUR NUMBERS STAY YOURS&nbsp;&nbsp; ✦ &nbsp;&nbsp;UPDATED FOR 2026&nbsp;&nbsp; ✦ &nbsp;&nbsp;</span>
          <span aria-hidden="true">FREE TO USE&nbsp;&nbsp; ✦ &nbsp;&nbsp;TRAINER-SPECIFIC DEDUCTIONS&nbsp;&nbsp; ✦ &nbsp;&nbsp;YOUR NUMBERS STAY YOURS&nbsp;&nbsp; ✦ &nbsp;&nbsp;UPDATED FOR 2026&nbsp;&nbsp; ✦ &nbsp;&nbsp;</span>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="relative bg-cream px-6 py-24 text-[#17162a] lg:px-12 scroll-mt-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 md:grid-cols-[.7fr_1.3fr]">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-text">The calculator</p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[.9] tracking-[-.05em] md:text-6xl">Know what you owe. Keep doing what you love.</h2>
          </div>
          <Calculator />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 lg:grid-cols-2 lg:px-12 scroll-mt-10">
        <div className="relative min-h-[400px] overflow-hidden rounded-[30px] bg-ink2 lg:min-h-[530px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trainer-portrait.png"
            alt="Personal trainer reviewing a client training plan in a gym"
            className="h-full w-full scale-[1.03] object-cover object-center opacity-90 contrast-125 brightness-[.72] saturate-[.85] transition duration-700 hover:scale-[1.08]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(0,199,239,.26),transparent_38%,rgba(12,12,28,.72)_100%)] mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,transparent_15%,rgba(12,12,28,.2)_48%,rgba(12,12,28,.68)_100%)]" />
          <div className="absolute bottom-7 left-7 max-w-xs rounded-2xl bg-cream p-5 text-[#17162a] shadow-2xl">
            <Spark className="size-6 text-[#00a9cf]" />
            <p className="mt-8 font-serif text-2xl leading-none">The numbers are part of the training.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">Built specifically for trainers</p>
          <h2 className="mt-6 font-serif text-4xl leading-[.9] tracking-[-.05em] md:text-6xl">
            Your work is personal.
            <br />
            <i className="text-violet-lighter font-serif">Your plan</i> should be too.
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-offwhite/80">
            From your first private client to a fully booked practice, TrainerLedger turns messy self-employment tax concepts into a few clear next steps.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-sm">
            <div>
              <b className="block text-2xl text-accent-light">0</b>
              <span className="text-offwhite/60">signup required</span>
            </div>
            <div>
              <b className="block text-2xl text-accent-light">100%</b>
              <span className="text-offwhite/60">local calculations</span>
            </div>
            <div>
              <b className="block text-2xl text-accent-light">2026</b>
              <span className="text-offwhite/60">tax year rates</span>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section id="guides" className="bg-deep2 px-6 py-24 lg:px-12 scroll-mt-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">The trainer ledger</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-8">
            <h2 className="font-serif text-4xl leading-[.9] tracking-[-.05em] md:text-6xl">
              A little more
              <br />
              clarity, whenever.
            </h2>
            <Link href="/guides/personal-trainer-tax-deductions" className="rounded-full border border-white/30 px-5 py-3 text-sm transition hover:bg-white hover:text-deep2">
              All guides ↗
            </Link>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {guides.map(([n, title, body, href]) => (
              <Link key={n} href={href} className="group block rounded-2xl border border-white/15 p-6 transition hover:-translate-y-2 hover:bg-deep3">
                <p className="text-sm text-accent-light">{n}</p>
                <h3 className="mt-16 font-serif text-3xl leading-[.95]">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-offwhite/70">{body}</p>
                <span className="mt-7 inline-block text-sm text-accent-light transition group-hover:translate-x-2">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
