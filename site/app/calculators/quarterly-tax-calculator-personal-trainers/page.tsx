import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";
import PageHeader, { PageBand } from "../../../components/PageHeader";
import summit from "../../../public/images/summit.jpg";

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

      <PageBand photo={summit}>
        <PageHeader
          align="center"
          eyebrow="Free tool"
          title="Quarterly tax calculator for personal trainers"
          lede="Self-employed trainers generally owe the IRS four times a year, not once. This calculator estimates what you owe each quarter — Apr 15, Jun 15, Sep 15, and Jan 15 — based on your actual income and deductions, using 2026 federal tax figures."
        />
      </PageBand>

      {/* Overlaps the photo band's faded bottom edge. */}
      <section className="relative z-10 -mt-12 pb-16 sm:-mt-20 sm:pb-24">
        <div className="shell">
          <Calculator />
        </div>
      </section>
    </main>
  );
}
