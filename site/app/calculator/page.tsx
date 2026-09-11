import Calculator from "../../components/Calculator";
import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Calculator | TrainerLedger",
  description: "Estimate your 2026 self-employment taxes as a personal trainer — income, deductions, and quarterly payments in one place.",
};

export default function CalculatorPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* A short intro band: the old one pushed the form ~630px down on a phone. */}
      <section className="bg-ink px-6 pb-10 pt-8 sm:pb-14 sm:pt-12 lg:px-12">
        <PageHeader
          align="center"
          title="Calculator"
          lede="Enter your income and deductions below for a real 2026 estimate of what you owe and what to set aside each quarter."
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
