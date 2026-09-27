import Link from "next/link";
import Image from "next/image";
import Calculator from "../components/Calculator";
import Faq from "../components/Faq";
import GuideCard from "../components/GuideCard";
import { button } from "../components/ui";
import {
  ArrowRightIcon,
  BoltIcon,
  CapIcon,
  CarIcon,
  CheckCircleIcon,
  DumbbellIcon,
  HomeIcon,
  LaptopIcon,
  ShieldIcon,
  StudioIcon,
  UsersIcon,
} from "../components/icons";
import { calculateTaxes } from "../lib/calculator";
import { faqs } from "../lib/faqs";
import heroImage from "../public/images/hero-athlete.jpg";
import mountains from "../public/images/mountains.jpg";
import summit from "../public/images/summit.jpg";
import guideTrainer from "../public/images/guide-trainer.jpg";
import guideLaptop from "../public/images/guide-laptop.jpg";
import guideW2 from "../public/images/guide-w2.jpg";

const guides = [
  {
    title: "What counts as a business expense?",
    summary: "Understand the line between personal and business spending.",
    href: "/guides/personal-trainer-tax-deductions",
    image: guideTrainer,
  },
  {
    title: "1099 vs W‑2, untangled",
    summary: "See the key differences, and why hybrid trainers need to watch Social Security.",
    href: "/guides/1099-vs-w2-personal-trainers",
    image: guideW2,
  },
  {
    title: "Quarterly deadlines, explained",
    summary: "The four IRS due dates and how to stay on track.",
    href: "/guides/quarterly-tax-deadlines-fitness-pros",
    image: guideLaptop,
  },
];

// Every tile is a category the tax engine really models (see
// DEDUCTION_FIELDS in components/Calculator.tsx) — nothing it can't estimate.
// Each opens /deductions at its own field (#deduction-<key>), lit briefly.
const deductionTiles = [
  { title: "Equipment", hint: "Weights, bands, training gear", Icon: DumbbellIcon, field: "equipment" },
  { title: "Education", hint: "Certifications, CEUs, courses", Icon: CapIcon, field: "certs" },
  { title: "Home office", hint: "Space used only for the business", Icon: HomeIcon, field: "homeOffice" },
  { title: "Mileage", hint: "Travel between clients and gyms", Icon: CarIcon, field: "mileageH1" },
  { title: "Software", hint: "Coaching apps, subscriptions", Icon: LaptopIcon, field: "software" },
  { title: "Gym rent", hint: "Booth fees and revenue splits", Icon: StudioIcon, field: "gymRent" },
];

const trustPoints = [
  { title: "Free to use", body: "No signup required", Icon: BoltIcon },
  { title: "Your data stays private", body: "All in your browser", Icon: ShieldIcon },
  { title: "Built for fitness pros", body: "Trainers. Coaches. You.", Icon: UsersIcon },
];

const calculatorPoints = [
  "Self-employment + federal taxes",
  "W‑2 and 1099 income",
  "Deductions, with their real tax impact",
  "Updated for the 2026 tax year",
];

export default function Home() {
  // Illustrative example for the hero's floating stat card, computed with the
  // real tax engine (not a fabricated number) using representative sample inputs.
  const heroPreview = calculateTaxes({
    filingStatus: "single",
    w2Wages: 0,
    w2Withheld: 0,
    gross1099: 85000,
    deductions: { certs: 0, liabilityIns: 0, gymRent: 0, equipment: 0, software: 0, mileageH1: 0, mileageH2: 0, apparel: 0, marketing: 0, homeOffice: 0, other: 0 },
  });
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  // Share of the example income that goes to tax — what the card's bar shows.
  const heroTaxShare = Math.round((heroPreview.totalLiability / 85000) * 100);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <main className="-mt-[72px] flex-1 overflow-x-clip">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO — the header floats over it (the -72px above), so the photo
          runs to the top edge. From xl the photo is pinned top-right at a
          fixed 3:2, starting where the copy column ends (see .hero in
          globals.css), so the live card always lands on the same patch of it
          and never on the headline. */}
      <section id="top" className="hero relative isolate overflow-hidden pt-[72px]">
        <div aria-hidden="true" className="absolute -left-24 bottom-0 -z-10 hidden h-[75%] w-[46%] opacity-45 xl:block [mask-image:radial-gradient(70%_70%_at_30%_70%,black,transparent)]">
          <Image src={mountains} alt="" fill sizes="46vw" className="object-cover object-[15%_60%]" />
        </div>
        <div aria-hidden="true" className="aurora absolute inset-0 -z-20" />

        <div className="shell relative z-10 pb-10 pt-12 sm:pt-16 lg:pt-20 xl:pb-20 xl:pt-20">
          <div className="max-w-xl">
            {/* The headline is brand voice; this line is the five-second answer
                to "what is this?". */}
            <p className="eyebrow text-accent-light">Free 2026 tax calculator for trainers</p>
            <h1 className="mt-6 type-hero">
              Build a business that <span className="text-accent">moves</span> with you.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-haze">
              A free tax estimate built for independent trainers, gym contractors, and hybrid coaches. Put your income, deductions, and next move in one clear view.
            </p>
            {/* Equal full-width buttons on phones (they wrapped to two
                different widths); side by side from sm. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#calculator" className={`${button({ size: "lg" })} w-full sm:w-auto`}>
                Calculate my taxes
                <ArrowRightIcon className="size-4" />
              </a>
              <Link href="/guides" className={`${button({ variant: "secondary", size: "lg" })} w-full sm:w-auto`}>
                Explore guides
              </Link>
            </div>
            {/* Items size to their text, so no label breaks onto a second line.
                From md the row sizes to its content (~590px), a touch wider
                than the copy column, so all three sit on one line instead of
                wrapping 2 + 1; it still ends before the photo starts at xl. */}
            <ul className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-9 md:w-max md:flex-nowrap">
              {trustPoints.map(({ title, body, Icon }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-6 flex-shrink-0 text-accent-light" />
                  <span>
                    <span className="block whitespace-nowrap text-sm font-semibold text-offwhite">{title}</span>
                    <span className="block text-hint text-dusk">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* From xl, vertically centred in the hero: the copy column is taller
            than a 3:2 photo that width, and top-pinned it left a dead band
            under the photo beside the buttons. */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[21/9] xl:absolute xl:right-0 xl:top-1/2 xl:left-[var(--media-left)] xl:w-auto xl:-translate-y-1/2 xl:aspect-[3/2]">
          <Image
            src={heroImage}
            alt="A personal trainer between sessions in a dark gym, towel over her shoulder"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1280px) 60vw, 100vw"
            className="photo-grade object-cover object-right lg:object-center"
          />
          {/* Lighter below xl, where the photo sits below the copy instead of beside it. */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent xl:from-ink xl:via-ink/20" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink to-transparent xl:h-28 xl:from-ink/80" />

          {/* Below xl: bottom-left, clear of her face. From xl: top-left, where
              the photo's original mockup card was painted out, sized so it
              stays left of her profile at every width. */}
          <div className="absolute bottom-[9%] left-[4%] w-[54%] max-w-[330px] -rotate-6 rounded-tile border border-white/15 bg-panel/80 p-4 shadow-card backdrop-blur-md motion-safe:animate-card-settle sm:w-[40%] sm:p-5 lg:w-[30%] xl:bottom-auto xl:left-[2%] xl:top-[15%] xl:w-[clamp(200px,28%,300px)]">
            <p className="eyebrow text-haze">Quarterly reserve</p>
            <p className="mt-2 type-figure text-3xl text-offwhite sm:text-4xl">{money(Math.round(heroPreview.quarterlyPayment))}</p>
            {/* A real figure, not decoration: the share of this example income
                that goes to self-employment and federal tax. */}
            <div className="mt-3 flex items-center gap-3">
              <div aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-accent" style={{ width: `${heroTaxShare}%` }} />
              </div>
              <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-accent-light">{heroTaxShare}% of income</span>
            </div>
            <p className="mt-2.5 text-hint text-haze">Example: $85k of training income, set aside each quarter.</p>
          </div>
        </div>
      </section>

      {/* DEDUCTIONS STRIP — the categories the calculator covers, each a way in. */}
      <section aria-labelledby="deductions-strip" className="relative border-y border-white/[.06] bg-ink2/60 py-12">
        <h2 id="deductions-strip" className="sr-only">Deductions trainers can claim</h2>
        <div className="shell grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {deductionTiles.map(({ title, hint, Icon, field }) => (
            <Link
              key={title}
              href={`/deductions#deduction-${field}`}
              data-reveal
              className="glass group flex flex-col rounded-tile p-4 transition-[border-color,transform] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5 sm:min-h-[176px] sm:p-5"
            >
              <Icon className="size-7 text-accent-light sm:size-8" strokeWidth={1.5} />
              <span className="mt-3 font-semibold text-offwhite sm:mt-5">{title}</span>
              <span className="mt-1 text-hint text-dusk">{hint}</span>
              {/* The whole tile is the link; the arrow is a pointer cue for
                  larger screens. On phones it only made each tile taller. */}
              <span aria-hidden="true" className="mt-auto hidden size-8 place-items-center rounded-full border border-accent/50 text-accent-light transition-colors group-hover:bg-accent group-hover:text-ink sm:grid">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          ))}
          <Link
            href="/deductions"
            data-reveal
            className="group col-span-2 flex flex-col justify-between rounded-tile border border-gold/35 bg-gradient-to-br from-deep3/80 via-deep2 to-ink p-4 transition-colors hover:border-gold/60 sm:col-span-3 sm:min-h-[176px] sm:p-5 lg:col-span-1"
          >
            <span className="font-serif text-2xl leading-tight text-offwhite">Turn your expenses into growth.</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light">
              See all deductions
              <ArrowRightIcon className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="relative isolate scroll-mt-16 py-20 sm:py-24">
        <div aria-hidden="true" className="aurora absolute inset-0 -z-20" />
        {/* The summit photo settles behind the lower half of the calculator,
            where the section was empty, fading in from above and out into the
            next band. From 2xl it's shifted so the climber stands in the open
            margin left of the calculator at any window width: the photo is
            2450px wide at this height and the climber is 563px in, so
            x-offset = half the shell's left edge − 563px. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-[900px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_85%,transparent)]"
        >
          <Image
            src={summit}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[20%_center] opacity-45 2xl:object-[calc(max(3rem,(100vw_-_1376px)_/_2_+_3rem)_/_2_-_563px)_center] 2xl:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/50 2xl:from-ink/25 2xl:via-transparent 2xl:to-ink/30" />
        </div>
        <span aria-hidden="true" className="streak -left-20 top-24 hidden w-[34%] -rotate-[22deg] md:block" />
        <span aria-hidden="true" className="streak -right-24 bottom-40 hidden w-[30%] -rotate-[18deg] md:block" />
        <div className="shell">
          {/* The intro is a row above the calculator, so the calculator gets
              the full content width at every size — the same proportions as
              the /calculator page. As a third column it squeezed the results
              panel to ~350px on laptops, and content is capped at 1280px, so
              wider screens never gave it room back. */}
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] xl:items-end xl:gap-16">
            <div data-reveal className="max-w-2xl">
              <p className="eyebrow text-accent-light">Calculator</p>
              <h2 className="mt-5 type-display">Get your tax estimate in minutes.</h2>
              <p className="mt-6 text-lg leading-relaxed text-haze">
                See where your income goes, estimate your quarterly payments, and plan ahead — all in one place.
              </p>
            </div>
            <div data-reveal>
              <ul className="grid gap-4 sm:grid-cols-2 sm:gap-x-8">
                {calculatorPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-haze">
                    <CheckCircleIcon className="size-6 flex-shrink-0 text-accent-light" strokeWidth={1.5} />
                    {point}
                  </li>
                ))}
              </ul>
              <p aria-hidden="true" className="script-note mt-8 hidden xl:block">
                Know your numbers. Own your next move.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <Calculator />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="divider-glow" />

      {/* GUIDES */}
      <section id="guides" className="relative scroll-mt-20 py-20 sm:py-24">
        {/* Side by side from xl; below that the three cards had ~200px each. */}
        <div className="shell grid gap-10 xl:grid-cols-[minmax(0,320px)_1fr] xl:gap-10">
          <div data-reveal className="xl:pt-4">
            <p className="eyebrow text-accent-light">Featured guides</p>
            <h2 className="mt-5 type-display">A little more clarity, whenever you need it.</h2>
            <p className="mt-6 text-lg leading-relaxed text-haze">Straightforward guides for trainers, coaches, and gym professionals.</p>
            <Link href="/guides" className={`mt-8 ${button({ variant: "secondary", size: "md" })}`}>
              View all guides
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.href} title={g.title} summary={g.summary} href={g.href} image={g.image} />
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="divider-glow" />

      {/* FAQ */}
      <section id="faq" className="relative scroll-mt-20 py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <div data-reveal className="lg:pt-4">
            <p className="eyebrow text-accent-light">Questions</p>
            <h2 className="mt-5 type-display">Good to know before you start.</h2>
            <p className="mt-6 text-lg leading-relaxed text-haze">Straight answers about how the estimate works and what it covers.</p>
          </div>
          <div data-reveal>
            <Faq />
          </div>
        </div>
      </section>
    </main>
  );
}
