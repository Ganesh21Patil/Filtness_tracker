"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { button } from "./ui";
import { ArrowRightIcon, CodeIcon } from "./icons";
import mountains from "../public/images/mountains.jpg";
import athlete from "../public/images/cta-athlete.jpg";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/calculator", label: "Calculator" },
      { href: "/deductions", label: "Deductions" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Tax guides" },
      { href: "/guides/quarterly-tax-deadlines-fitness-pros", label: "Quarterly deadlines" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/widget", label: "Embed the calculator" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/terms#disclaimer", label: "Disclaimer" },
    ],
  },
];

// The closing band sends people to the calculator. On pages where they're
// already doing that task — or signing in, or reading embed instructions —
// it's a detour, so it's left off.
const NO_CTA_ROUTES = [
  "/calculator",
  "/deductions",
  "/calculators/quarterly-tax-calculator-personal-trainers",
  "/calculators/personal-trainer-deduction-finder",
  "/dashboard",
  "/saved-estimates",
  "/auth",
  "/widget",
];

export default function Footer() {
  const pathname = usePathname();
  const showCta = !NO_CTA_ROUTES.some((r) => pathname === r || pathname?.startsWith(`${r}/`));

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname?.startsWith("/embed")) return null;

  return (
    <>
      {showCta && (
        <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden border-y border-white/[.08] bg-ink2">
          {/* Two photographs melt into the navy from either side: the athlete
              (left) and the mountain range (right). Decorative only. */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[36%] md:block [mask-image:linear-gradient(to_right,black_45%,transparent)]">
            <Image src={athlete} alt="" fill sizes="36vw" className="photo-grade object-cover object-[45%_30%] opacity-70" />
          </div>
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full md:w-[62%] [mask-image:linear-gradient(to_left,black_40%,transparent)]">
            <Image src={mountains} alt="" fill sizes="62vw" className="object-cover object-[35%_center] opacity-50 md:opacity-70" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(40%_70%_at_50%_50%,rgb(5_8_15/.85),transparent)]" />
          <span aria-hidden="true" className="streak animate-beam -left-10 top-[30%] w-[40%] -rotate-[12deg]" />

          <p aria-hidden="true" className="slogan absolute bottom-16 left-[5%] hidden max-w-[11ch] xl:block">
            Same hard work. Smarter finances.
          </p>
          <p aria-hidden="true" className="slogan absolute bottom-14 right-[5%] hidden max-w-[13ch] text-right xl:block [&::after]:ml-auto">
            A stronger tomorrow starts with a clear plan.
          </p>

          <div className="shell relative py-20 text-center sm:py-24">
            <p className="eyebrow text-accent-light">Ready to take control?</p>
            <h2 id="cta-heading" className="mx-auto mt-4 max-w-xl type-display">
              Know what you owe. Keep moving forward.
            </h2>
            <p className="mt-5 text-lg text-haze">Free, no signup — your numbers stay in your browser.</p>
            <Link href="/calculator" className={`mt-9 ${button({ size: "lg" })}`}>
              Calculate my taxes
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </section>
      )}

      <footer className="relative text-sm text-dusk">
        <div className="shell py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-[1.6fr_repeat(4,1fr)_1.5fr]">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <Logo />
              <p className="mt-4 max-w-[26ch] leading-relaxed">A tax planner for independent trainers and fitness coaches.</p>
            </div>

            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-offwhite">{col.title}</h3>
                <ul className="mt-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="inline-flex min-h-[40px] items-center rounded transition-colors hover:text-offwhite">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* A real offer in the slot a newsletter would usually take. */}
            <Link
              href="/widget"
              className="glass group col-span-2 flex flex-col justify-between gap-4 rounded-tile p-5 transition-colors hover:border-white/20 md:col-span-4 lg:col-span-1"
            >
              <span className="grid size-10 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent-light">
                <CodeIcon className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-offwhite">Run a fitness blog or studio site?</span>
                <span className="mt-1 inline-flex items-center gap-1.5 font-semibold text-accent-light">
                  Embed the calculator
                  <ArrowRightIcon className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/[.08] pt-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} TrainerLedger. Privacy first — your numbers stay yours.</p>
            <p>Built for a stronger, more independent you.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
