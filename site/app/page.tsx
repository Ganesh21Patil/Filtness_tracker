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
const deductionTiles = [
  { title: "Equipment", hint: "Weights, bands, training gear", Icon: DumbbellIcon },
  { title: "Education", hint: "Certifications, CEUs, courses", Icon: CapIcon },
  { title: "Home office", hint: "Space used only for the business", Icon: HomeIcon },
  { title: "Mileage", hint: "Travel between clients and gyms", Icon: CarIcon },
  { title: "Software", hint: "Coaching apps, subscriptions", Icon: LaptopIcon },
  { title: "Gym rent", hint: "Booth fees and revenue splits", Icon: StudioIcon },
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
          runs to the top edge. From lg the photo is pinned to the right at a
          fixed 3:2 so the live card always lands on the same patch of it. */}
      <section id="top" className="relative isolate overflow-hidden pt-[72px] lg:min-h-[max(660px,40vw)]">
        <div aria-hidden="true" className="absolute -left-24 bottom-0 -z-10 hidden h-[75%] w-[46%] opacity-45 lg:block [mask-image:radial-gradient(70%_70%_at_30%_70%,black,transparent)]">
          <Image src={mountains} alt="" fill sizes="46vw" className="object-cover object-[15%_60%]" />
        </div>
        <div aria-hidden="true" className="aurora absolute inset-0 -z-20" />

        <div className="shell relative z-10 pb-10 pt-12 sm:pt-16 lg:pb-24 lg:pt-24">
          <div className="max-w-xl">
            {/* The headline is brand voice; this line is the five-second answer
                to "what is this?". */}
            <p className="eyebrow text-accent-light">Free 2026 tax calculator for trainers</p>
            <h1 className="mt-6 type-hero">
              Build a business that <span className="text-glow text-accent">moves</span> with you.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-haze">
              A free tax estimate built for independent trainers, gym contractors, and hybrid coaches. Put your income, deductions, and next move in one clear view.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#calculator" className={button({ size: "lg" })}>
                Calculate my taxes
                <ArrowRightIcon className="size-4" />
              </a>
              <Link href="/guides" className={button({ variant: "secondary", size: "lg" })}>
                Explore guides
              </Link>
            </div>
            {/* Items size to their text, so no label breaks onto a second line. */}
            <ul className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-9">
              {trustPoints.map(({ title, body, Icon }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-6 flex-shrink-0 text-accent-light" />
                  <span>
                    <span className="block whitespace-nowrap text-sm font-semibold text-offwhite">{title}</span>
                    <span className="block text-xs text-dusk">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:right-0 lg:top-0 lg:aspect-[3/2] lg:w-[60vw]">
          <Image
            src={heroImage}
            alt="A personal trainer between sessions in a dark gym, towel over her shoulder"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="photo-grade object-cover object-right lg:object-center"
          />
          {/* Lighter on phones, where the photo sits below the copy instead of behind it. */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent lg:from-ink lg:via-ink/20" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink to-transparent lg:h-28 lg:from-ink/80" />

          {/* Phones: bottom-left, clear of her face. From lg: top-left, where the
              photo's original mockup card was painted out. */}
          <div className="animate-float-card absolute bottom-[9%] left-[4%] w-[54%] max-w-[330px] -rotate-6 rounded-tile border border-white/15 bg-panel/80 p-4 shadow-card backdrop-blur-md sm:w-[40%] sm:p-5 lg:bottom-auto lg:left-[4%] lg:top-[15%] lg:w-[31%]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-haze">Quarterly reserve</p>
              <span className="hidden size-8 place-items-center rounded-lg border border-accent/50 text-accent-light sm:grid">
                <ArrowRightIcon className="size-4 -rotate-45" />
              </span>
            </div>
            <p className="mt-2 type-figure text-3xl text-offwhite sm:text-4xl">{money(Math.round(heroPreview.quarterlyPayment))}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-accent to-electric-light shadow-[0_0_10px_rgba(31,182,255,.8)]" />
            </div>
            <p className="mt-2.5 text-xs text-haze">Example: $85k of training income. Set aside by Apr 15.</p>
          </div>
        </div>
      </section>

      {/* DEDUCTIONS STRIP — the categories the calculator covers, each a way in. */}
      <section aria-labelledby="deductions-strip" className="relative border-y border-white/[.06] bg-ink2/60 py-12">
        <h2 id="deductions-strip" className="sr-only">Deductions trainers can claim</h2>
        <span aria-hidden="true" className="streak animate-beam -left-16 -top-px w-[38%] -rotate-[8deg]" />
        <div className="shell grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {deductionTiles.map(({ title, hint, Icon }) => (
            <Link
              key={title}
              href="/deductions#deductions"
              className="glass group flex min-h-[176px] flex-col rounded-tile p-5 transition-[border-color,transform] duration-200 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
            >
              <Icon className="size-8 text-accent-light drop-shadow-[0_0_10px_rgba(31,182,255,.55)]" strokeWidth={1.5} />
              <span className="mt-5 font-semibold text-offwhite">{title}</span>
              <span className="mt-1 text-xs leading-snug text-dusk">{hint}</span>
              <span className="mt-auto grid size-8 place-items-center rounded-full border border-accent/50 pt-0 text-accent-light transition-colors group-hover:bg-accent group-hover:text-ink">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          ))}
          <Link
            href="/deductions"
            className="group col-span-2 flex min-h-[176px] flex-col justify-between rounded-tile border border-gold/35 bg-gradient-to-br from-deep3/80 via-deep2 to-ink p-5 shadow-[0_0_40px_-18px_rgba(217,178,95,.6)] transition-colors hover:border-gold/60 sm:col-span-3 lg:col-span-1"
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
            next band. From xl it's shifted so the climber stands in the open
            space under the copy column at any window width:
            x-offset = the shell's left edge − 365px, never past 0. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-[900px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_85%,transparent)]"
        >
          <Image
            src={summit}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[20%_center] opacity-45 xl:object-[min(0px,calc(max(0px,(100vw_-_1376px)_/_2)_-_365px))_center] xl:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/50 xl:from-ink/25 xl:via-transparent xl:to-ink/30" />
        </div>
        <span aria-hidden="true" className="streak animate-beam -left-20 top-24 w-[34%] -rotate-[22deg]" />
        <span aria-hidden="true" className="streak animate-beam -right-24 bottom-40 w-[30%] -rotate-[18deg]" />
        <div className="shell grid gap-12 xl:grid-cols-[minmax(0,290px)_1fr] xl:gap-12">
          <div className="max-w-2xl xl:pt-6">
            <p className="eyebrow text-accent-light">Calculator</p>
            <h2 className="mt-5 type-display">Get your tax estimate in minutes.</h2>
            <p className="mt-6 text-lg leading-relaxed text-haze">
              See where your income goes, estimate your quarterly payments, and plan ahead — all in one place.
            </p>
            <ul className="mt-8 space-y-4">
              {calculatorPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-haze">
                  <CheckCircleIcon className="size-6 flex-shrink-0 text-accent-light" strokeWidth={1.5} />
                  {point}
                </li>
              ))}
            </ul>
            <p aria-hidden="true" className="script-note mt-16 hidden xl:block">
              Know your numbers.
              <br />
              Own your next move.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      <div aria-hidden="true" className="divider-glow" />

      {/* GUIDES */}
      <section id="guides" className="relative scroll-mt-20 py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <div className="lg:pt-4">
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
        <span aria-hidden="true" className="streak animate-beam -right-10 top-10 w-[30%] -rotate-[14deg]" />
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <div className="lg:pt-4">
            <p className="eyebrow text-accent-light">Questions</p>
            <h2 className="mt-5 type-display">Good to know before you start.</h2>
            <p className="mt-6 text-lg leading-relaxed text-haze">Straight answers about how the estimate works and what it covers.</p>
          </div>
          <Faq />
        </div>
      </section>
    </main>
  );
}
