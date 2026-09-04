import Calculator from "../../components/Calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator | TrainerLedger",
  description: "Estimate your 2026 self-employment taxes as a personal trainer — income, deductions, and quarterly payments in one place.",
};

export default function CalculatorPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="bg-ink px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-4">Calculator</h1>
          <p className="text-lg leading-relaxed text-offwhite/80">
            Enter your income and deductions below for a real 2026 estimate of what you owe and what to set aside each quarter.
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
