"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { button } from "./ui";
import { Spark } from "./icons";

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
    links: [{ href: "/about", label: "About" }],
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
        <section className="bg-deep2 px-6 py-20 text-center lg:px-12">
          <h2 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite">Ready to know what you owe?</h2>
          <p className="mt-4 text-lg text-offwhite/75">Free, no signup — your numbers, your quarterly plan, right now.</p>
          <Link
            href="/calculator"
            className={`mt-8 ${button({ size: "lg" })}`}
          >
            Calculate my taxes
          </Link>
        </section>
      )}

      <footer className="shell py-12 text-sm text-offwhite/70">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs">A free tax estimate tool for independent personal trainers and fitness coaches.</p>
            <Link
              href="/widget"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent-light transition hover:bg-accent/20"
            >
              <Spark className="size-3" />
              Embed this tool on your site
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 eyebrow text-offwhite">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="rounded hover:text-offwhite">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-offwhite/50">
          <p>&copy; {new Date().getFullYear()} TrainerLedger &middot; Privacy first</p>
        </div>
      </footer>
    </>
  );
}
