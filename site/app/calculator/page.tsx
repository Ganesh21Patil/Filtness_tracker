import Calculator from "../../components/Calculator";
import type { Metadata } from "next";
import PageHeader, { PageBand } from "../../components/PageHeader";
import summit from "../../public/images/summit.jpg";

export const metadata: Metadata = {
  title: "Calculator | TrainerLedger",
  description: "Estimate your 2026 self-employment taxes as a personal trainer — income, deductions, and quarterly payments in one place.",
};

export default function CalculatorPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand photo={summit}>
        <PageHeader
          align="center"
          eyebrow="2026 tax estimate"
          title="Calculator"
          lede="Enter your income and deductions below for a real 2026 estimate of what you owe and what to set aside each quarter."
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
