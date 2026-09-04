import Link from "next/link";
import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Trainer Deduction Finder | TrainerLedger",
  description: "Find the business deductions trainers miss most — certifications, liability insurance, mileage, equipment, and more — and see the estimated tax savings.",
};

export default function DeductionFinderPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Personal Trainer Deduction Finder",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free tool that walks self-employed personal trainers through common business deductions and estimates the tax savings for each.",
  };

  return (
    <main className="flex-1 overflow-hidden">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-ink px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-6">Personal trainer deduction finder</h1>
          <p className="text-lg leading-relaxed text-offwhite/80">
            Certifications, liability insurance, gym rental splits, mileage, equipment, coaching software — most trainers miss at least one of these on their taxes. Walk through each category below and see roughly how much each one is worth in tax savings as you go.
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
