import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";
import PageHeader from "../../../components/PageHeader";

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
    <main className="flex-1 overflow-x-clip">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* A short intro band: the old one pushed the form ~630px down on a phone. */}
      <section className="bg-ink px-6 pb-10 pt-8 sm:pb-14 sm:pt-12 lg:px-12">
        <PageHeader
          align="center"
          title="Personal trainer deduction finder"
          lede="Certifications, liability insurance, gym rental splits, mileage, equipment, coaching software — most trainers miss at least one of these on their taxes. Walk through each category below and see roughly how much each one is worth in tax savings as you go."
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
