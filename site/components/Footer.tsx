"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Footer() {
  const pathname = usePathname();

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname?.startsWith("/embed")) return null;

  return (
    <>
      {/* Footer CTA band */}
      <section className="bg-deep2 px-6 py-20 text-center lg:px-12">
        <h2 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite">Ready to know what you owe?</h2>
        <p className="mt-4 text-lg text-offwhite/75">Free, no signup — your numbers, your quarterly plan, right now.</p>
        <Link
          href="/calculator"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-semibold text-ink transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,199,239,.25)]"
        >
          Calculate my taxes
        </Link>
      </section>

      <footer className="mx-auto w-full max-w-[1440px] px-6 py-12 text-sm text-offwhite/70 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="rounded text-xl font-semibold text-offwhite">
              TrainerLedger
            </Link>
            <p className="mt-3 max-w-xs">A free tax estimate tool for independent personal trainers and fitness coaches.</p>
            <Link
              href="/widget"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent-light transition hover:bg-accent/20"
            >
              ✦ Embed this tool on your site
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-offwhite">{col.title}</h3>
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
