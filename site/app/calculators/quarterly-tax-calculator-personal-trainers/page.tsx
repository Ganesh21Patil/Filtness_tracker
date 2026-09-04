import Link from "next/link";
import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quarterly Tax Calculator for Personal Trainers | TrainerLedger",
  description: "Estimate your 2026 quarterly estimated tax payments as a self-employed personal trainer — free, with real IRS due dates and a downloadable calendar.",
};

export default function QuarterlyCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Quarterly Tax Calculator for Personal Trainers",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free calculator that estimates quarterly estimated tax payments for self-employed personal trainers, using 2026 IRS figures.",
  };

  return (
    <main className="flex-1 overflow-hidden">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-ink px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-6">Quarterly tax calculator for personal trainers</h1>
          <p className="text-lg leading-relaxed text-offwhite/80">
            Self-employed trainers generally owe the IRS four times a year, not once. This calculator estimates what you owe each quarter — Apr 15, Jun 15, Sep 15, and Jan 15 — based on your actual income and deductions, using 2026 federal tax figures.
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Calculator />
        </div>
      </section>
    </main>
  );
}
