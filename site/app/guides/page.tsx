import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides | TrainerLedger",
  description: "Plain-language guides on personal trainer taxes: deductions, 1099 vs W-2, and quarterly deadlines.",
};

const guides = [
  ["Personal trainer tax deductions", "Understand the line between personal spending and expenses connected to running your training business.", "/guides/personal-trainer-tax-deductions"],
  ["1099 vs W-2 for personal trainers", "See the difference between W-2 wages and 1099 income, and why hybrid trainers need to watch Social Security withholding.", "/guides/1099-vs-w2-personal-trainers"],
  ["Quarterly tax deadlines for fitness pros", "The four IRS due dates for estimated tax payments, and what happens if you miss one.", "/guides/quarterly-tax-deadlines-fitness-pros"],
] as const;

export default function GuidesIndex() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">The trainer ledger</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-10">Guides</h1>

        <div className="space-y-4">
          {guides.map(([title, body, href]) => (
            <Link key={href} href={href} className="group block rounded-[28px] bg-cream p-6 sm:p-8 text-inktext shadow-[0_18px_50px_rgba(31,25,74,.1)] transition hover:-translate-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2>
              <p className="mt-3 text-[#413d57] leading-relaxed">{body}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-accent-deep">Read guide</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
