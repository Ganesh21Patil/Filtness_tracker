import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";
import PageHeader from "../../../components/PageHeader";

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
    <main className="flex-1 overflow-x-clip">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* A short intro band: the old one pushed the form ~630px down on a phone. */}
      <section className="bg-ink px-6 pb-10 pt-8 sm:pb-14 sm:pt-12 lg:px-12">
        <PageHeader
          align="center"
          title="Quarterly tax calculator for personal trainers"
          lede="Self-employed trainers generally owe the IRS four times a year, not once. This calculator estimates what you owe each quarter — Apr 15, Jun 15, Sep 15, and Jan 15 — based on your actual income and deductions, using 2026 federal tax figures."
        />
      </section>

      <section className="bg-cream py-10 sm:py-16">
        <div className="shell">
          <Calculator />
        </div>
      </section>
    </main>
  );
}
